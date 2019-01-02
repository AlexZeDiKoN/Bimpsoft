import React from 'react'
import PropTypes from 'prop-types'
import { components, utils } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'

const { IconHovered, names: IconNames } = components.icons
const { InputWithSuffix, FormItem } = components.form
const { Coordinates } = utils

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
    onChange(index, Coordinates.parse(value))
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
    const isWrong = Coordinates.isWrong(coordinate)
    const suffix = isWrong ? i18n.ERROR : Coordinates.getName(coordinate)
    return (
      <FormItem>
        <InputWithSuffix
          readOnly={readOnly}
          value={Coordinates.stringify(coordinate)}
          onChange={this.changeHandler}
          isWrong={isWrong}
          suffix={suffix}
          onBlur={this.onBlurHandler}
          onFocus={this.onFocusHandler}
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
