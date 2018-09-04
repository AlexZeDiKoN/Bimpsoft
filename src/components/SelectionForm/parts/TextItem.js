import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'
import { components } from '@DZVIN/CommonComponents'
const { FormItem } = components.form

const { IconHovered, names: IconNames } = components.icons

export default class TextItem extends React.Component {
  static propTypes = {
    readOnly: PropTypes.bool,
    index: PropTypes.number,
    text: PropTypes.string,
    underline: PropTypes.bool,
    canRemove: PropTypes.bool,
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
  }

  textChangeHandler = ({ target: { value } }) => {
    const { onChange, underline, index } = this.props
    onChange(index, { text: value, underline })
  }

  underlineClickHandler = () => {
    const { onChange, text, underline, index } = this.props
    onChange(index, { text, underline: !underline })
  }

  removeClickHandler = () => {
    const { onRemove, index } = this.props
    onRemove(index)
  }

  render () {
    const { text, underline, canRemove, readOnly } = this.props
    return (
      <FormItem>
        <Input value={text} onChange={readOnly ? null : this.textChangeHandler} readOnly={readOnly} />
        {!readOnly && (<IconHovered
          icon={underline ? IconNames.U_ACTIVE : IconNames.U_DEFAULT}
          hoverIcon={IconNames.U_HOVER}
          onClick={this.underlineClickHandler}
        />)}
        {!readOnly && (<IconHovered
          icon={canRemove ? IconNames.EMPTY_DEFAULT : IconNames.EMPTY_DISABLE}
          hoverIcon={canRemove ? IconNames.EMPTY_HOVER : IconNames.EMPTY_DISABLE}
          onClick={this.removeClickHandler}
        />)}
      </FormItem>
    )
  }
}
