import React from 'react'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
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

  sectorChangeHandler = (target) => {
    const { coord1, coord2, index } = target
    this.setResult((result) => {
      result = result.updateIn(COORDINATE_PATH, (coordinates) => {
        const coordNew = coordinates.set((2 + index * 2), coord1)
        return coordNew.set((3 + index * 2), coord2)
      })
      // result = result.updateIn(COORDINATE_PATH, (coordinates) => coordinates.set(3 + index * 2, coord2))
      return result
    })
  }

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
          coord1={points[i]}
          coord2={points[i + 1]}
          sectorInfo={sectorInfo}
          canRemove={canRemove}
          readOnly={readOnly}
          onRemove={this.sectorRemoveHandler}
          onChangeProps={this.sectorPropertiesChangeHandler}
          onChange={this.sectorChangeHandler}
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
