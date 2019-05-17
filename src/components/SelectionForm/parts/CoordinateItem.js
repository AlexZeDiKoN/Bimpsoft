import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import placeSearch from '../../../server/places'

const {
  icons: { IconHovered, names: IconNames },
  form: { Coordinates, FormItem },
} = components

export default class CoordinateItem extends React.Component {
  static propTypes = {
    index: PropTypes.number,
    coordinate: PropTypes.object,
    canRemove: PropTypes.bool,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  }

  changeHandler = (value) => {
    const { onChange, index } = this.props
    onChange(index, value)
  }

  removeClickHandler = () => {
    const { onRemove, index } = this.props
    onRemove(index)
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
    const { coordinate = {}, canRemove, readOnly } = this.props
    return (
      <FormItem>
        <Coordinates
          isReadOnly={readOnly}
          coordinates={coordinate}
          onChange={this.changeHandler}
          onEnter={this.onFocusHandler}
          onExit={this.onBlurHandler}
          onSearch={placeSearch}
        />
        {!readOnly && (<IconHovered
          icon={canRemove ? IconNames.DELETE_24_DEFAULT : IconNames.DELETE_24_DISABLE}
          hoverIcon={canRemove ? IconNames.DELETE_24_HOVER : IconNames.DELETE_24_ACTIVE}
          onClick={this.removeClickHandler}
        />)}
      </FormItem>
    )
  }
}
