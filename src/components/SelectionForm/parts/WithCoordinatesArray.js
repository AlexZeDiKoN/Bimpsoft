import React from 'react'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import CoordinateItem from './CoordinateItem'
import CoordinatesMixin, { COORDINATE_PATH } from './CoordinatesMixin'

const {
  FormRow,
  FormDivider,
  FormDarkPart,
} = components.form

const { icons: { IconHovered, names: iconNames } } = components

const WithCoordinatesArray = (Component) => class CoordinatesArrayComponent extends CoordinatesMixin(Component) {
  state = { editCoordinates: false }

  coordinateRemoveHandler = (index) => this.setResult((result) =>
    result.updateIn(COORDINATE_PATH, (coordinatesArray) =>
      coordinatesArray.size <= 2 ? coordinatesArray : coordinatesArray.delete(index)
    )
  )

  coordinatesEditClickHandler = () => this.setState((state) => ({
    editCoordinates: !state.editCoordinates,
  }))

  coordinateAddHandler = () => this.setResult((result) =>
    result.updateIn(COORDINATE_PATH, (coordinatesArray) => coordinatesArray.push({ text: '' }))
  )

  renderCoordinatesArray () {
    const { editCoordinates } = this.state
    const coordinatesArray = this.getResult().getIn(COORDINATE_PATH).toJS()
    const canEdit = this.isCanEdit()
    console.log(canEdit)
    return (
      <FormDarkPart>
        <FormRow label={i18n.COORDINATES}>
          {canEdit && (<IconHovered
            icon={editCoordinates ? iconNames.BAR_2_EDIT_ACTIVE : iconNames.BAR_2_EDIT_DEFAULT}
            hoverIcon={iconNames.BAR_2_EDIT_HOVER}
            onClick={this.coordinatesEditClickHandler}
          />)}
        </FormRow>
        <FormDivider/>
        <FormRow label={i18n.NODAL_POINTS}>
          {canEdit && editCoordinates && (<IconHovered
            icon={iconNames.MAP_SCALE_PLUS_DEFAULT}
            hoverIcon={iconNames.MAP_SCALE_PLUS_HOVER}
            onClick={this.coordinateAddHandler}
          />)}
        </FormRow>
        <div className="shape-form-scrollable">
          {coordinatesArray.map((coordinate, index) => (
            <CoordinateItem
              key={index}
              coordinate={coordinate}
              index={index}
              readOnly={!canEdit || !editCoordinates}
              canRemove={coordinatesArray.size > 2}
              onExitWithChange={canEdit ? this.onCoordinateExitWithChangeHandler : null}
              onRemove={this.coordinateRemoveHandler}
              onFocus={this.onCoordinateFocusHandler}
              onBlur={this.onCoordinateBlurHandler}
            />
          ))}
        </div>
      </FormDarkPart>
    )
  }
}

export default WithCoordinatesArray
