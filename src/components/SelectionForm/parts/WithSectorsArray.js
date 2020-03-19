import React from 'react'
import { components, utils } from '@DZVIN/CommonComponents'
// import { Checkbox } from 'antd'
import i18n from '../../../i18n'
import SectorItem from './SectorItem'

const {
  FormRow,
  FormDivider,
  FormDarkPart,
} = components.form

const { Coordinates: Coord } = utils

const {
  icons: { IconHovered, names: IconNames },
} = components

function getCoordinatesFromRadius (coordinatesArray, radius) {
  // const coord1 = coordinatesArray[0]
  const coord2 = coordinatesArray[1]
  // if (Coord.check(coord1) && Coord.check(coord2)) {
  //   const corner1 = L.latLng(coord1)
  //   const corner2 = L.latLng(coord2)
  //
  //   const radiusNew = Math.round(corner1.distanceTo(corner2))
  //   console.log(corner1, corner2, radius, radiusNew)
  // }
  return coord2
}

// const SHOWN_INTERMEDIATE_AMPLIFIERS_PATH = [ 'attributes', 'shownIntermediateAmplifiers' ]
// const SHOWN_NODAL_POINT_AMPLIFIERS_PATH = [ 'attributes', 'shownNodalPointAmplifiers' ]
const PATH_S_INFO = [ 'attributes', 'sectorsInfo' ]
const COORDINATE_PATH = [ 'geometry' ]

const WithSectorsArray = (Component) => class SectorsArrayComponent extends Component {
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
    // const indexDelete = index * 2
    // console.log(JSON.stringify(indexDelete))
    result.updateIn(COORDINATE_PATH, (coordinatesArray) => {
      // coordinatesArray.size < (indexDelete + 1) ? coordinatesArray : coordinatesArray.delete(indexDelete + 1)
      // console.log(JSON.stringify(coordinatesArray))
      return coordinatesArray
    })
    // result.updateIn(COORDINATE_PATH, (coordinatesArray) =>
    //   coordinatesArray.size < indexDelete ? coordinatesArray : coordinatesArray.delete(indexDelete),
    // )
    result.updateIn(PATH_S_INFO, (fieldSectors) => {
      // console.log(JSON.stringify(fieldSectors))
      return fieldSectors
    })
  })

  // onSectorRemoveHandler = this.sectorRemoveHandler.bind(this)

  // Обработчик нажатия кнопки добавления сектора
  sectorAddHandler = () => this.setResult((result) => {
    // console.log(JSON.stringify('Добавить сектор'))
    // result.updateIn(COORDINATE_PATH, (coordinatesArray) => coordinatesArray.push({ text: '' }))
    // result.updateIn(COORDINATE_PATH, (coordinatesArray) => coordinatesArray.push({ text: '' }))
  })

  sectorPropertiesChangeHandler = (target) => {
    const { name, value, index } = target
    this.setResult((result) => {
      result = result.updateIn([ ...PATH_S_INFO ],
        (sectorsInfo) => sectorsInfo.set(index, Object.assign({}, sectorsInfo.get(index), { [name]: value })))
      return result
    })
  }

  // обработка изменения радиуса
  radiusChangeHandler = (index) => (radiusText) => {
    // const { index } = this.props
    // console.log(JSON.stringify(index), JSON.stringify(radiusText))
    this.setResult((result) => {
      const radius = Number(radiusText)
      if (Number.isFinite(radius)) {
        const coordinatesArray = result.getIn(COORDINATE_PATH)
        const coord1 = coordinatesArray.get(0)
        const coord2 = coordinatesArray.get(index)
        const coord3 = coordinatesArray.get(index + 1)
        if (Coord.check(coord1) && Coord.check(coord2) && Coord.check(coord3)) {
          // const coord3 = L.CRS.Earth.calcPairRight(coord1, radius)
          const coordN2 = getCoordinatesFromRadius([ coord1, coord2 ], radius)
          result = result.updateIn(COORDINATE_PATH, (coordinates) => coordinates.set(index, coordN2))
          const coordN3 = getCoordinatesFromRadius([ coord1, coord3 ], radius)
          result = result.updateIn(COORDINATE_PATH, (coordinates) => coordinates.set(index, coordN3))
        }
      }
      return result
    })
    this.setState({ radiusText })
  }

  radiusBlurHandler = () => this.setState({ radiusText: null })

  addSectors (points, readOnly) {
    const sector = []
    const formStore = this.getResult()
    const canRemove = points.size > 8
    const sectorsInfo = formStore.getIn([ ...PATH_S_INFO ])
    for (let i = 2, numSector = 0; i < points.length; i += 2, numSector++) {
      const sectorInfo = sectorsInfo.get(numSector)
      sector.push(
        <SectorItem key={`${points[i].lat}/${points[i].lng}`}
          index = {numSector}
          beginCoordinate={points[0]}
          coordinate1={points[i]}
          coordinate2={points[i + 1]}
          sectorInfo={sectorInfo}
          canRemove={canRemove}
          readOnly={readOnly}
          onRemove={this.sectorRemoveHandler}
          onChangeProps={this.sectorPropertiesChangeHandler}
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
