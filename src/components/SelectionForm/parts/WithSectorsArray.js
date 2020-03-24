import React from 'react'
import { components } from '@DZVIN/CommonComponents'
import PropTypes from 'prop-types'
import i18n from '../../../i18n'
import { distanceAngle, sphereDirect } from '../../WebMap/patch/utils/sectors'
import { colors } from '../../../constants'
import SectorItem from './SectorItem'

const {
  FormRow,
  FormDivider,
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

  state = { editCoordinates: false }

  // createAmplifierShowerHandler = (path, index) => () => this.setResult((result) =>
  //   result.updateIn(path, (showedSet) =>
  //     showedSet.has(index) ? showedSet.delete(index) : showedSet.add(index),
  //   ),
  // )

  // Обработчик нажатия кнопки разрешения редактирования
  sectorsEditClickHandler = () => this.setState((state) => ({
    editCoordinates: !state.editCoordinates,
  }))

  // удаление сектора
  sectorRemoveHandler = (index) => this.setResult((result) => {
    const indexDelete = index * 2 + 2
    let deleteSector = false
    const newResult = result.updateIn(COORDINATE_PATH, (coordArray) => {
      const oldSize = coordArray.size
      const newArray = (((oldSize > 5) && (oldSize > (indexDelete + 1))) // должен остаться хотя бы один сектор
        ? coordArray.delete(indexDelete + 1).delete(indexDelete) : coordArray)
      if (oldSize === (newArray.size + 2)) {
        deleteSector = true
      }
      return newArray
    })
    if (deleteSector) {
      return newResult.updateIn(PATH_S_INFO, (fieldSectors) => (fieldSectors.delete(index)))
    }
    return result
  })

  // onSectorRemoveHandler = this.sectorRemoveHandler.bind(this)

  // Обработчик нажатия кнопки добавления сектора
  sectorAddHandler = () => this.setResult((result) => {
    let endIndex
    const newResult = result.updateIn(COORDINATE_PATH, (coordArray) => {
      const coordO = coordArray.get(0)
      const coordA = coordArray.get(1)
      const azimun1 = distanceAngle(coordO, coordA)
      const coordN1 = sphereDirect(coordO, azimun1.angledeg - 30, azimun1.distance)
      const coordN2 = sphereDirect(coordO, azimun1.angledeg + 30, azimun1.distance)
      const coordNA = sphereDirect(coordO, azimun1.angledeg, azimun1.distance * 1.1)
      const newCoordArray = coordArray.set(1, coordNA).push(coordN1).push(coordN2)
      endIndex = newCoordArray.size / 2 - 2
      return newCoordArray
    })
    if (Number.isFinite(Number(endIndex)) && endIndex > 0 && endIndex < 10) {
      return newResult.updateIn(PATH_S_INFO, (infoArray) => (
        infoArray.set(endIndex, ({ amplifier: '', color: '#000000', fill: colors.TRANSPARENT }))
      ))
    } else {
      return result
    }
  })

  sectorPropertiesChangeHandler = (target) => {
    const { name, value, index } = target
    this.setResult((result) => (
      result.updateIn(PATH_S_INFO,
        (sectorsInfo) => sectorsInfo.set(index, Object.assign({}, sectorsInfo.get(index), { [name]: value })))
    ))
  }

  sectorChangeHandler = (target) => {
    const { coord1, coord2, index } = target
    this.setResult((result) => (
      result.updateIn(COORDINATE_PATH, (coordinates) => (
        coordinates.set((2 + index * 2), coord1).set((3 + index * 2), coord2)
      ))
    ))
  }

  sectorFocusChange = (target) => {
    const { isActive, index } = target
    const { onCoordinateFocusChange } = this.props
    onCoordinateFocusChange && onCoordinateFocusChange(index * 2 + 2, isActive)
  }

  addSectors (points, readOnly) {
    const sector = []
    const formStore = this.getResult()
    const canRemove = points.size > 8
    const sectorsInfo = formStore.getIn(PATH_S_INFO)
    for (let i = 2, numSector = 0; i < points.length; i += 2, numSector++) {
      const sectorInfo = sectorsInfo.get(numSector)
      sector.push(
        <SectorItem key={`${points[i].lat}/${points[i].lng}`}
          index = {numSector}
          beginCoordinate={points[0]}
          coord1={points[i]}
          coord2={points[i + 1]}
          sectorInfo={sectorInfo}
          canRemove={canRemove}
          readOnly={readOnly}
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
    const { editCoordinates } = this.state
    const formStore = this.getResult()
    const coordinatesArray = formStore.getIn(COORDINATE_PATH).toJS()
    const canEdit = this.isCanEdit() // общее разрешение редактирования
    const sector = this.addSectors(coordinatesArray, !canEdit || !editCoordinates)
    return (
      <FormDarkPart>
        <FormRow label={i18n.SECTORS}>
          {canEdit && (<IconHovered
            icon={editCoordinates ? IconNames.BAR_2_EDIT_ACTIVE : IconNames.BAR_2_EDIT_DEFAULT}
            hoverIcon={IconNames.BAR_2_EDIT_HOVER}
            onClick={this.sectorsEditClickHandler}
          />)}
        </FormRow>
        <FormDivider/>
        <div className="shape-form-scrollable">
          <table>
            <tbody>
              <tr>
                <th>
                  <FormRow label={i18n.RADIUS}/>
                </th>
                <th>
                  <FormRow label={i18n.AZIMUT1}/>
                </th>
                <th>
                  <FormRow label={i18n.AZIMUT2}/>
                </th>
                <th>
                  <FormRow label={i18n.AMPLIFIER_T}/>
                </th>
                <th>
                  <FormRow label={i18n.COLOR}/>
                </th>
                <th>
                  <FormRow label={i18n.FILLING}/>
                </th>
              </tr>
              {sector}
            </tbody>
          </table>
          <FormRow label={i18n.SECTOR}>
            {canEdit && editCoordinates && <IconHovered
              icon={IconNames.MAP_SCALE_PLUS_DEFAULT}
              hoverIcon={IconNames.MAP_SCALE_PLUS_HOVER}
              onClick={this.sectorAddHandler}
            />}
          </FormRow>
        </div>
      </FormDarkPart>
    )
  }
}

export default WithSectorsArray
