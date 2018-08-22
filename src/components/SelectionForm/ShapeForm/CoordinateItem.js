import React from 'react'
import PropTypes from 'prop-types'
import { components, utils } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import { FormItem } from './../../form'

const { IconHovered, names: IconNames } = components.icons
const { InputWithSuffix } = components.form
const { Coordinates } = utils

export default class CoordinateItem extends React.Component {
  static propTypes = {
    index: PropTypes.number,
    coordinate: PropTypes.object,
    canRemove: PropTypes.bool,
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
  }

  changeHandler = (value) => {
    const { onChange, index } = this.props
    onChange(index, Coordinates.parse(value))
  }

  removeClickHandler = () => {
    const { onRemove, index } = this.props
    onRemove(index)
  }

  render () {
    const { coordinate = {}, canRemove } = this.props
    const isWrong = Coordinates.isWrong(coordinate)
    const suffix = isWrong ? i18n.ERROR : Coordinates.getName(coordinate)
    return (
      <FormItem>
        <InputWithSuffix
          value={Coordinates.stringify(coordinate)}
          onChange={this.changeHandler}
          isWrong={isWrong}
          suffix={suffix}
        />
        <IconHovered
          icon={canRemove ? IconNames.EMPTY_DEFAULT : IconNames.EMPTY_DISABLE}
          hoverIcon={canRemove ? IconNames.EMPTY_HOVER : IconNames.EMPTY_DISABLE}
          onClick={this.removeClickHandler}
        />
      </FormItem>
    )
  }
}
