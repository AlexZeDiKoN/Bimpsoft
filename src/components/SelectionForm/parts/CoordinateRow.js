import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@C4/CommonComponents'
import i18n from '../../../i18n'
import placeSearch from '../../../server/places'

const {
  form: { Coordinates },
} = components

export default class CoordinateRow extends React.Component {
  static propTypes = {
    index: PropTypes.number,
    label: PropTypes.string,
    coordinate: PropTypes.object,
    onChange: PropTypes.func,
    onExitWithChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    readOnly: PropTypes.bool,
    coordinatesType: PropTypes.string,
  }

  changeHandler = (value) => {
    const { onChange, index } = this.props
    onChange && onChange(index, value)
  }

  onExitWithChangeHandler = (value) => {
    const { onExitWithChange, index } = this.props
    onExitWithChange && onExitWithChange(index, value)
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
    const { coordinate = {}, index, label, readOnly, coordinatesType } = this.props
    return (
      <div className='coordinateRow-container'>
        <div className='coordinate-title'>{label || i18n.NODAL_POINT_INDEX(index + 1)}</div>
        <Coordinates
          coordinates={coordinate}
          isReadOnly={readOnly}
          onChange={this.changeHandler}
          onBlur={this.onBlurHandler}
          onExitWithChange={this.onExitWithChangeHandler}
          onEnter={this.onFocusHandler}
          onSearch={placeSearch}
          prerefredType={coordinatesType}
        />
      </div>
    )
  }
}
