import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import { coordinates } from '../../../utils'
import i18n from '../../../i18n'
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
    const { coordinate = {}, canRemove } = this.props
    const isWrong = coordinates.isWrong(coordinate)
    const suffix = isWrong ? i18n.ERROR : coordinates.getName(coordinate)
    return (
      <FormItem className={isWrong ? ' wrong-coordinate' : ''}>
        <div className="input-block">
          <input
            className="input-control"
            value={coordinates.stringify(coordinate)}
            onChange={this.changeHandler}
          />
          {suffix && (<div className='input-suffix'>
            {suffix}
          </div>)}
        </div>
        <IconHovered
          icon={canRemove ? IconNames.EMPTY_DEFAULT : IconNames.EMPTY_DISABLE}
          hoverIcon={canRemove ? IconNames.EMPTY_HOVER : IconNames.EMPTY_DISABLE}
          onClick={this.removeClickHandler}
        />
      </FormItem>
    )
  }
}
