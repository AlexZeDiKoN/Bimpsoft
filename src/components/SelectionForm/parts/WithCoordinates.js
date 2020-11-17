import React from 'react'
import { components } from '@C4/CommonComponents'
import { List } from 'immutable'
import i18n from '../../../i18n'
import lineDefinitions from '../../WebMap/patch/Sophisticated/lineDefinitions'
import { extractLineCode } from '../../WebMap/patch/Sophisticated/utils'
import CoordinateItem from './CoordinateItem'
import CoordinatesMixin, { COORDINATE_PATH } from './CoordinatesMixin'

const {
  FormDivider,
  FormDarkPart,
} = components.form

const { icons: { IconHovered, names: iconNames } } = components

const WithCoordinates = (Component) => class CoordinatesComponent extends CoordinatesMixin(Component) {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      editCoordinates: false,
    }
  }

  coordinateRemoveHandler = (index) => {
    const count = this.getResult().getIn(COORDINATE_PATH).size
    const lineCode = extractLineCode(this.props.data.code)
    if (lineDefinitions[lineCode]?.deleteCoordinatesForm) {
      // определяем какие опорные точки нужно удалить вместе с выбранной
      const removeCoord = lineDefinitions[lineCode].deleteCoordinatesForm(index, count)
      if (lineDefinitions[lineCode]?.adjustForm) { // приводим в порядок опорные точки, если есть обработчик
        const prevPoint = this.getResult().getIn(COORDINATE_PATH).splice(removeCoord.index, removeCoord.count).toJS()
        const nextPoint = [ ...prevPoint ]
        lineDefinitions[lineCode].adjustForm(prevPoint, nextPoint, [ removeCoord.index ])
        this.setResult((result) => result.setIn(COORDINATE_PATH, List(nextPoint)))
      } else { // просто удаляем
        this.setResult((result) =>
          result.updateIn(COORDINATE_PATH,
            (coordinatesArray) => coordinatesArray.splice(removeCoord.index, removeCoord.count)),
        )
      }
    } else { // удаляем только выбранную опорную точку
      this.setResult((result) =>
        result.updateIn(COORDINATE_PATH, (coordinatesArray) =>
          coordinatesArray.size <= 2 ? coordinatesArray : coordinatesArray.delete(index),
        ),
      )
    }
  }

  coordinatesEditClickHandler = () => this.setState((state) => ({
    editCoordinates: !state.editCoordinates,
  }))

  coordinateAddHandler = (index) => {
    const formStore = this.getResult()
    const coordArray = formStore.getIn(COORDINATE_PATH).toJS()
    const count = coordArray.length
    const lineCode = extractLineCode(this.props.data.code)
    if (lineDefinitions[lineCode]?.addCoordinatesLL) {
      const addCoords = lineDefinitions[lineCode]?.addCoordinatesLL(coordArray, index)
      this.setResult((result) =>
        result.updateIn(COORDINATE_PATH, (coordinates) => coordinates.splice(index + 1, 0, ...addCoords)))
    } else {
      const amplCount = lineDefinitions[extractLineCode(this.props.data.code)]?.amplCount ?? 0
      const index2 = (index + 1) % (count - amplCount)
      // вставка между опорными точками
      const coordNew = {
        lat: (coordArray[index2].lat + coordArray[index].lat) / 2,
        lng: (coordArray[index2].lng + coordArray[index].lng) / 2,
      }
      this.setResult((result) =>
        result.updateIn(COORDINATE_PATH, (coordinatesArray) => coordinatesArray.insert(index + 1, coordNew)))
    }
  }

  renderCoordinates () {
    const { editCoordinates } = this.state
    const { coordinatesType } = this.props
    const formStore = this.getResult()
    const coordinatesArray = formStore.getIn(COORDINATE_PATH).toJS()
    const canEdit = this.isCanEdit()
    const canEditCoord = canEdit && editCoordinates
    const codeLine = extractLineCode(this.props.data.code)
    const allowDelete = lineDefinitions[codeLine]?.allowDeleteForm
      ? lineDefinitions[codeLine]?.allowDeleteForm
      : lineDefinitions[codeLine]?.allowDelete
    const allowMiddle = lineDefinitions[codeLine]?.allowMiddle
    const countCoordinates = coordinatesArray.length
    return (
      <FormDarkPart>
        <div className='coordinatesNotArrayContainer'>
          <div>{i18n.NODAL_POINTS}</div>
          {canEdit && (<IconHovered
            icon={editCoordinates ? iconNames.BAR_2_EDIT_ACTIVE : iconNames.BAR_2_EDIT_DEFAULT}
            hoverIcon={iconNames.BAR_2_EDIT_HOVER}
            onClick={this.coordinatesEditClickHandler}
          />)}
        </div>
        <FormDivider/>
        <div className="shape-form-scrollable">
          <div>{i18n.COORDINATES}</div>
          {coordinatesArray.map((coordinate, index) => {
            const canRemove = allowDelete ? allowDelete(index, countCoordinates) : countCoordinates > 2
            const canAdd = canEditCoord && (allowMiddle ? allowMiddle(index, index + 1, countCoordinates) : false)
            return (
              <div
                style={{ display: 'flex', alignItems: 'center' }}
                key={`${coordinate.lat}/${coordinate.lng}`}>
                <CoordinateItem
                  key={index}
                  coordinate={coordinate}
                  index={index}
                  readOnly={!canEditCoord}
                  canRemove={canRemove && canEditCoord }
                  onExitWithChange={canEdit ? this.onCoordinateExitWithChangeHandler : null}
                  onRemove={this.coordinateRemoveHandler}
                  onFocus={this.onCoordinateFocusHandler}
                  onBlur={this.onCoordinateBlurHandler}
                  coordinatesType={coordinatesType}
                />
                {canAdd && <IconHovered
                  icon={iconNames.MAP_SCALE_PLUS_DEFAULT}
                  hoverIcon={iconNames.MAP_SCALE_PLUS_HOVER}
                  onClick={() => this.coordinateAddHandler(index)}
                />}
              </div>
            )
          })}
        </div>
      </FormDarkPart>
    )
  }
}

export default WithCoordinates
