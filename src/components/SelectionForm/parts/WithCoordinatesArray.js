import React from 'react'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import coordinates from '../../../utils/coordinates'
import CoordinateItem from './CoordinateItem'
import CoordinatesMixin from './CoordinatesMixin'

const {
  FormRow,
  FormDivider,
  FormDarkPart,
} = components.form

const { icons: { IconHovered, names: iconNames } } = components

const WithCoordinatesArray = (Component) => class CoordinatesArrayComponent extends CoordinatesMixin(Component) {
  constructor (props) {
    super(props)
    this.state.editCoordinates = false
  }

  coordinateRemoveHandler = (index) => this.setState(
    (state) => (state.coordinatesArray.size <= 2) ? null : { coordinatesArray: state.coordinatesArray.delete(index) }
  )

  coordinatesEditClickHandler = () => this.setState((state) => ({
    editCoordinates: !state.editCoordinates,
  }))

  coordinateAddHandler = () => this.setState((state) => ({
    coordinatesArray: state.coordinatesArray.push(coordinates.parse('')),
  }))

  renderCoordinatesArray () {
    const {
      coordinatesArray,
      editCoordinates,
    } = this.state
    const canEdit = this.isCanEdit()
    return (
      <FormDarkPart>
        <FormRow label={i18n.COORDINATES}>
          {canEdit && (<IconHovered
            icon={editCoordinates ? iconNames.BAR_2_EDIT_ACTIVE : iconNames.BAR_2_EDIT_DEFAULT}
            hoverIcon={iconNames.BAR_2_EDIT_HOVER}
            onClick={this.coordinatesEditClickHandler}
          />)}
        </FormRow>
        <FormDivider />
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
              onChange={this.coordinateChangeHandler}
              onRemove={this.coordinateRemoveHandler}
            />
          ))}
        </div>
      </FormDarkPart>
    )
  }
}

export default WithCoordinatesArray
