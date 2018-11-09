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
        />
        {!readOnly && (<IconHovered
          icon={canRemove ? IconNames.BAR_2_DELETE_DEFAULT : IconNames.BAR_2_DELETE_DISABLE}
          hoverIcon={canRemove ? IconNames.BAR_2_DELETE_ACTIVE : IconNames.BAR_2_DELETE_DISABLE}
          onClick={this.removeClickHandler}
        />)}
      </FormItem>
    )
  }
}
