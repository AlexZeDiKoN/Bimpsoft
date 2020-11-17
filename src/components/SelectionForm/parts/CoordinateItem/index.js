import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@C4/CommonComponents'
import placeSearch from '../../../../server/places'
import './style.css'

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
    onExitWithChange: PropTypes.func,
    onRemove: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  }

  changeHandler = (value) => {
    const { onChange, index } = this.props
    onChange && onChange(index, value)
  }

  removeClickHandler = () => {
    const { onRemove, index } = this.props
    onRemove && onRemove(index)
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
    const { coordinate = {}, canRemove, readOnly, coordinatesType } = this.props
    return (
      <FormItem className="coordinatesModal">
        <Coordinates
          isReadOnly={readOnly}
          coordinates={coordinate}
          onChange={this.changeHandler}
          onEnter={this.onFocusHandler}
          onBlur={this.onBlurHandler}
          onExitWithChange={this.onExitWithChangeHandler}
          onSearch={placeSearch}
          preferredType={coordinatesType}
        />
        { canRemove && (<IconHovered
          icon={canRemove ? IconNames.DELETE_24_DEFAULT : IconNames.DELETE_24_DISABLE}
          hoverIcon={canRemove ? IconNames.DELETE_24_HOVER : IconNames.DELETE_24_ACTIVE}
          onClick={this.removeClickHandler}
        />)}
      </FormItem>
    )
  }
}
