import React from 'react'
import L from 'leaflet'
import { components } from '@C4/CommonComponents'
import { Checkbox } from 'antd'
import i18n from '../../../i18n'
import SelectionTypes from '../../../constants/SelectionTypes'
import CoordinateItem from './CoordinateItem'
import CoordinatesMixin, { COORDINATE_PATH } from './CoordinatesMixin'
import { figureArea, renderNodes } from './render'
import {
  NODAL_POINT_ICON_PATH,
  NODAL_POINT_ICONS,
} from './WithNodalPointType'
import {
  NAME_OF_AMPLIFIERS,
} from './WithIntermediateAmplifiers'

const {
  FormRow,
  FormDivider,
  FormDarkPart,
} = components.form

const { icons: { IconHovered, names: iconNames } } = components

const SHOWN_INTERMEDIATE_AMPLIFIERS_PATH = [ 'attributes', 'shownIntermediateAmplifiers' ]
const SHOWN_NODAL_POINT_AMPLIFIERS_PATH = [ 'attributes', 'shownNodalPointAmplifiers' ]
const TYPE_PATH = [ 'type' ]

const WithCoordinatesArray = (Component) => class CoordinatesArrayComponent extends CoordinatesMixin(Component) {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      editCoordinates: false,
      changeCoordinates: false,
    }
  }

  createAmplifierShowerHandler = (path, index) => () => this.setResult((result) =>
    result.updateIn(path, (showedSet) =>
      showedSet.has(index) ? showedSet.delete(index) : showedSet.add(index),
    ),
  )

  coordinateRemoveHandler = (index) => this.setResult((result) =>
    result.updateIn(COORDINATE_PATH, (coordinatesArray) =>
      coordinatesArray.size <= 2 ? coordinatesArray : coordinatesArray.delete(index),
    ),
  this.setState({ changeCoordinates: true }),
  )

  coordinatesEditClickHandler = () => this.setState((state) => ({
    editCoordinates: !state.editCoordinates,
  }))

  coordinateAddHandler = () => this.setResult((result) =>
    result.updateIn(COORDINATE_PATH, (coordinatesArray) => {
      const endIndex = coordinatesArray.size - 1
      if (endIndex > 0) {
        const end = coordinatesArray.get(endIndex)
        if (endIndex === 0) {
          return coordinatesArray.push(end)
        }
        const prevEnd = coordinatesArray.get(endIndex - 1)
        const coordNew = end.set('lat', 2 * end.lat - prevEnd.lat).set('lng', 2 * end.lng - prevEnd.lng)
        return coordinatesArray.push(coordNew)
      } else {
        return coordinatesArray.push({ text: '' })
      }
    }),
  this.setState({ changeCoordinates: true }),
  )

  renderCoordinatesArray (lock = false) {
    const { editCoordinates, changeCoordinates } = this.state
    const { coordinatesType } = this.props
    const formStore = this.getResult()

    const shownIntermediateAmplifiersSet = formStore.getIn(SHOWN_INTERMEDIATE_AMPLIFIERS_PATH)
    const shownNodalPointAmplifiersSet = formStore.getIn(SHOWN_NODAL_POINT_AMPLIFIERS_PATH)

    const coordinatesArray = formStore.getIn(COORDINATE_PATH).toJS()
    // определение nипа фигуры, для расчета площади нужен полигон
    const isPoligon = this.getResult().getIn(TYPE_PATH) === SelectionTypes.POLYGON

    const nodalPointIcon = formStore.getIn(NODAL_POINT_ICON_PATH)
    const canEdit = this.isCanEdit()
    const readOnly = !canEdit || !editCoordinates
    const nodalPointIconPreview = renderNodes(nodalPointIcon)
    const coordinatesLength = coordinatesArray.length
    const noNodalPointAmplifier = nodalPointIcon === NODAL_POINT_ICONS.NONE
    return (
      <FormDarkPart>
        <FormDivider />
        <FormRow label={i18n.NODAL_POINTS}>
          {canEdit && (<IconHovered
            icon={editCoordinates ? iconNames.BAR_2_EDIT_ACTIVE : iconNames.BAR_2_EDIT_DEFAULT}
            hoverIcon={iconNames.BAR_2_EDIT_HOVER}
            onClick={this.coordinatesEditClickHandler}
          />)}
        </FormRow>
        <div className="headerSiding">
          <div className="shape-form-scrollable">
            <div className={'columns-container'}>
              <div className={'amplifiers-title'}>
                {i18n.AMPLIFIERS}
              </div>
              <div className={'coordinates-title'}>
                {i18n.COORDINATES}
              </div>
              <div className="col-add">
                {canEdit && editCoordinates && <IconHovered
                  icon={iconNames.MAP_SCALE_PLUS_DEFAULT}
                  hoverIcon={iconNames.MAP_SCALE_PLUS_HOVER}
                  onClick={this.coordinateAddHandler}
                />}
                    &nbsp;
              </div>
            </div>
            {coordinatesArray.map((coordinate, index) => (
              <div tabIndex={changeCoordinates ? index : undefined} key={`${coordinate.lat}/${coordinate.lng}`}>
                <div className={'coordinates-checkbox-container'}>
                  <div className="icon-option">
                    <Checkbox
                      disabled={!canEdit || noNodalPointAmplifier}
                      checked={noNodalPointAmplifier || shownNodalPointAmplifiersSet.has(index)}
                      onChange={this.createAmplifierShowerHandler(SHOWN_NODAL_POINT_AMPLIFIERS_PATH, index)}
                    />
                    {nodalPointIconPreview}
                  </div>
                  <CoordinateItem
                    key={index}
                    coordinate={coordinate}
                    index={index}
                    readOnly={readOnly}
                    canRemove={coordinatesLength > 2 && !readOnly}
                    onExitWithChange={canEdit ? this.onCoordinateExitWithChangeHandler : null}
                    onRemove={this.coordinateRemoveHandler}
                    onFocus={this.onCoordinateFocusHandler}
                    onBlur={this.onCoordinateBlurHandler}
                    coordinatesType={coordinatesType}
                  />
                </div>
                {index !== coordinatesLength - (lock ? 0 : 1) ? (
                  <div className={'coordinate-check'}>
                    <Checkbox
                      disabled={!canEdit}
                      onChange={this.createAmplifierShowerHandler(SHOWN_INTERMEDIATE_AMPLIFIERS_PATH, index)}
                      checked={shownIntermediateAmplifiersSet.has(index)}
                    /> &laquo;{NAME_OF_AMPLIFIERS}&raquo;
                  </div>
                ) : null}
              </div>
            ))}
            {isPoligon && figureArea(L.polygon(coordinatesArray.map(({ lat, lng }) => [ lat, lng ])))}
          </div>
        </div>
      </FormDarkPart>
    )
  }
}

export default WithCoordinatesArray
