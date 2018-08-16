import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import { coordinates } from '../../../utils'
import { FormItem } from './../../form'

const { IconHovered, names: IconNames } = components.icons

export default class CoordinateItem extends React.Component {
  static propTypes = {
    index: PropTypes.number,
    coordinate: PropTypes.object,
    canRemove: PropTypes.bool,
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
  }

  changeHandler = ({ target: { value } }) => {
    const { onChange, index } = this.props
    onChange(index, coordinates.parse(value))
  }

  removeClickHandler = () => {
    const { onRemove, index } = this.props
    onRemove(index)
  }

  render () {
    const { coordinate = null, canRemove } = this.props
    const isWrong = coordinates.isWrong(coordinate)
    const typeName = coordinates.getName(coordinate)
    return (
      <FormItem>
        <Input
          className={isWrong ? 'wrong-coordinate' : null}
          value={coordinates.stringify(coordinate)}
          onChange={this.changeHandler}
          suffix={typeName}
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
