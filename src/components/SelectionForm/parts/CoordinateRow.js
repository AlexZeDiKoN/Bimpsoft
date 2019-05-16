import React from 'react'
import PropTypes from 'prop-types'
import { components, utils } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import placeSearch from '../../../server/places'

const {
  form: { Coordinates, FormRow },
} = components

const { Coordinates: Coord } = utils

export default class CoordinateRow extends React.Component {
  static propTypes = {
    index: PropTypes.number,
    label: PropTypes.string,
    coordinate: PropTypes.object,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    readOnly: PropTypes.bool,
  }

  changeHandler = (value) => {
    const { onChange, index } = this.props
    onChange && onChange(index, Coord.parse(value))
  }

  onBlurHandler = () => {
    const { onBlur, index } = this.props
    onBlur && onBlur(index)
  }

  onFocusHandler = () => {
    const { onFocus, index } = this.props
    onFocus && onFocus(index)
  }

  render () {
    const { coordinate = {}, index, label, readOnly } = this.props
    return (
      <FormRow label={label || i18n.NODAL_POINT_INDEX(index + 1)}>
        <Coordinates
          coordinates={coordinate}
          readOnly={readOnly}
          onChange={this.changeHandler}
          onExit={this.onBlurHandler}
          onEnter={this.onFocusHandler}
          onSearch={placeSearch}
        />
      </FormRow>
    )
  }
}
