import React from 'react'
import { components } from '@C4/CommonComponents'
import PropTypes from 'prop-types'
import i18n from '../../../i18n'
import { distanceAzimuth, sphereDirect } from '../../WebMap/patch/utils/sectors'
import { colors } from '../../../constants'
import SectorItem from './SectorItem'

const {
  FormDarkPart,
} = components.form

const {
  icons: { IconHovered, names: IconNames },
} = components

const PATH_S_INFO = [ 'attributes', 'sectorsInfo' ]
const COORDINATE_PATH = [ 'geometry' ]

const WithSectorsArray = (Component) => class SectorsArrayComponent extends Component {
  static propTypes = {
    data: PropTypes.object,
    canEdit: PropTypes.bool,
    orgStructures: PropTypes.object,
    readOnly: PropTypes.bool,
    onOk: PropTypes.func,
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    onAddToTemplates: PropTypes.func,
    onCoordinateFocusChange: PropTypes.func,
    ovtData: PropTypes.object,
  }

  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      editSectors: false,
    }
  }

  // createAmplifierShowerHandler = (path, index) => () => this.setResult((result) =>
  //   result.updateIn(path, (showedSet) =>
  //     showedSet.has(index) ? showedSet.delete(index) : showedSet.add(index),
  //   ),
  // )

  // Обработчик нажатия кнопки разрешения редактирования
  sectorsEditClickHandler = () => this.setState((state) => ({
    editSectors: !state.editSectors,
  }))

  // удаление сектора
  sectorRemoveHandler = (numSector) => this.setResult((result) => {
    const indexDelete = numSector * 2 + 2
    let deleteSector = false
    // удаление координат сектора
    const newResult = result.updateIn(COORDINATE_PATH, (coordArray) => {
      const oldSize = coordArray.size
      const newArray = (((oldSize > 5) && (oldSize > (indexDelete + 1))) // должен остаться хотя бы один сектор
        ? coordArray.delete(indexDelete + 1).delete(indexDelete) : coordArray)
      if (oldSize === (newArray.size + 2)) {
        deleteSector = true
        return newArray
      }
      return coordArray
    })
    // удаление свойств сектора
    if (deleteSector) {
      return newResult.updateIn(PATH_S_INFO, (fieldSectors) => (fieldSectors.delete(numSector)))
    }
    return result
  })

  // onSectorRemoveHandler = this.sectorRemoveHandler.bind(this)

  // Обработчик нажатия кнопки добавления сектора
  sectorAddHandler = () => this.setResult((result) => {
    let endIndex = 0
    const newResult = result.updateIn(COORDINATE_PATH, (coordArray) => {
      const coordO = coordArray.get(0)
      const coordA = coordArray.get(1)
      const azimun1 = distanceAzimuth(coordO, coordA)
      const coordN1 = sphereDirect(coordO, azimun1.angledeg - 30, azimun1.distance)
      const coordN2 = sphereDirect(coordO, azimun1.angledeg + 30, azimun1.distance)
      const coordNA = sphereDirect(coordO, azimun1.angledeg, azimun1.distance * 1.1)
      const newCoordArray = coordArray.set(1, coordNA).push(coordN1).push(coordN2)
      endIndex = newCoordArray.size / 2 - 2
      return newCoordArray
    })
    if (endIndex > 0 && endIndex < 10) {
      return newResult.updateIn(PATH_S_INFO, (infoArray) => (
        infoArray.set(endIndex, ({ amplifier: '', color: '#000000', fill: colors.TRANSPARENT }))
      ))
    } else {
      return result
    }
  })

  sectorPropertiesChangeHandler = (target) => {
    const { name, value, numSector } = target
    this.setResult((result) => (
      result.updateIn(PATH_S_INFO,
        (sectorsInfo) => sectorsInfo.set(numSector, Object.assign({}, sectorsInfo.get(numSector), { [name]: value })))
    ))
  }

  sectorChangeHandler = (target) => {
    const { coord1, coord2, index, coordArrow } = target
    this.setResult((result) => (
      result.updateIn(COORDINATE_PATH, (coordinates) => (
        coordArrow
          ? coordinates.set((index), coord1).set((index + 1), coord2).set(1, coordArrow)
          : coordinates.set((index), coord1).set((index + 1), coord2)
      ))
    ))
  }

  sectorFocusChange = (target) => {
    const { isActive, index } = target
    const { onCoordinateFocusChange } = this.props
    onCoordinateFocusChange && onCoordinateFocusChange(index, isActive)
  }

  addSectors (points, readOnly) {
    const sector = []
    const formStore = this.getResult()
    const canRemove = points.size > 8
    const sectorsInfo = formStore.getIn(PATH_S_INFO)
    const addOnly = points.length < 6
    for (let i = 2, numSector = 0; i < points.length; i += 2, numSector++) {
      const sectorInfo = sectorsInfo.get(numSector)
      sector.push(
        <SectorItem key={`${points[i].lat}/${points[i].lng}`}
          index = {i}
          numSector = {numSector}
          allPoints={points}
          sectorInfo={sectorInfo}
          canRemove={canRemove}
          readOnly={readOnly}
          addOnly={addOnly}
          onRemove={this.sectorRemoveHandler}
          onChangeProps={this.sectorPropertiesChangeHandler}
          onChange={this.sectorChangeHandler}
          onFocus={this.sectorFocusChange}
        />,
      )
    }
    return sector
  }

  renderSectorsArray () {
    const { editSectors } = this.state
    const formStore = this.getResult()
    const coordinatesArray = formStore.getIn(COORDINATE_PATH).toJS()
    const canEdit = this.isCanEdit() // общее разрешение редактирования
    const sector = this.addSectors(coordinatesArray, !canEdit || !editSectors)
    return (
      <FormDarkPart>
        <div className='coordinate-width-container'>
          <div className='coordinate-width-title'>{i18n.SECTORS}</div>
          <div className='coordinate-width-button'>
            {canEdit && editSectors && <IconHovered
              icon={IconNames.MAP_SCALE_PLUS_DEFAULT}
              hoverIcon={IconNames.MAP_SCALE_PLUS_HOVER}
              onClick={this.sectorAddHandler}
            />}
            {canEdit && (<IconHovered
              icon={editSectors ? IconNames.BAR_2_EDIT_ACTIVE : IconNames.BAR_2_EDIT_DEFAULT}
              hoverIcon={IconNames.BAR_2_EDIT_HOVER}
              onClick={this.sectorsEditClickHandler}
            />)}
          </div>
        </div>
        <div className="shape-form-scrollable sectors-array-container">
          {sector}
        </div>
      </FormDarkPart>
    )
  }
}

export default WithSectorsArray
