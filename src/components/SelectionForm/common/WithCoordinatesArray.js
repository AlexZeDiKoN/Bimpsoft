import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import { List } from 'immutable'
import i18n from '../../../i18n'
import coordinates from '../../../utils/coordinates'
import CoordinateItem from './CoordinateItem'

const {
  FormRow,
  FormDivider,
  FormDarkPart,
} = components.form

const { icons: { IconHovered, names: iconNames } } = components

const WithCoordinatesArray = (Component) => class CoordinatesArrayComponent extends Component {
  static propTypes = {
    coordinatesArray: PropTypes.arrayOf(PropTypes.object),
  }

  constructor (props) {
    super(props)
    const coordinatesArray = props.coordinatesArray || []
    while (coordinatesArray.length < 2) {
      coordinatesArray.push(coordinates.parse(''))
    }
    this.state.coordinatesArray = List(coordinatesArray)
    this.state.editCoordinates = false
  }

  coordinateChangeHandler = (index, item) => this.setState((state) => ({
    coordinatesArray: state.coordinatesArray.set(index, item),
  }))

  coordinateRemoveHandler = (index) => {
    if (this.state.coordinatesArray.size <= 2) {
      return
    }
    this.setState((state) => ({
      coordinatesArray: state.coordinatesArray.delete(index),
    }))
  }

  coordinatesEditClickHandler = () => this.setState((state) => ({
    editCoordinates: !state.editCoordinates,
  }))

  fillResult (result) {
    super.fillResult(result)
    const { state } = this
    result.lineType = state.lineType
    result.coordinatesArray = state.coordinatesArray.toJS()
  }

  coordinateAddHandler = () => this.setState((state) => ({
    coordinatesArray: state.coordinatesArray.push(coordinates.parse('')),
  }))

  getErrors () {
    const errors = super.getErrors()
    this.state.coordinatesArray.forEach((coordinate) => {
      if (!coordinate || coordinates.isWrong(coordinate)) {
        errors.coordinatesArray = { text: i18n.INCORRECT_COORDINATE }
      }
    })
    return errors
  }

  renderCoordinatesArray () {
    const {
      coordinatesArray,
      editCoordinates,
    } = this.state
    return (
      <FormDarkPart>
        <FormRow label={i18n.COORDINATES}>
          <IconHovered
            icon={editCoordinates ? iconNames.BAR_2_EDIT_ACTIVE : iconNames.BAR_2_EDIT_DEFAULT}
            hoverIcon={iconNames.BAR_2_EDIT_HOVER}
            onClick={this.coordinatesEditClickHandler}
          />
        </FormRow>
        <FormDivider />
        <FormRow label={i18n.NODAL_POINTS}>
          <IconHovered
            icon={iconNames.MAP_SCALE_PLUS_DEFAULT}
            hoverIcon={iconNames.MAP_SCALE_PLUS_HOVER}
            onClick={this.coordinateAddHandler}
          />
        </FormRow>
        <div className="shape-form-scrollable">
          {coordinatesArray.map((coordinate, index) => (
            <CoordinateItem
              key={index}
              coordinate={coordinate}
              index={index}
              canRemove={coordinatesArray.size > 1}
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
