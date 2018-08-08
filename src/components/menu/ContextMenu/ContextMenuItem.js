import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
const { IconHovered } = components.icons

export default class ContextMenuItem extends React.Component {
  static propTypes = {
    icon: PropTypes.string,
    hoverIcon: PropTypes.string,
    text: PropTypes.string,
    value: PropTypes.any,
    checked: PropTypes.bool,
    onClick: PropTypes.func,
  }

  clickHandler = () => this.props.onClick(this.props.value)

  render () {
    const { icon, hoverIcon, text, checked } = this.props
    let className = 'context-menu-item'
    if (checked) {
      className += ' context-menu-item-checked'
    }
    return (
      <div className={className} onClick={this.clickHandler}>
        {icon && (<IconHovered icon={icon} hoverIcon={hoverIcon} />)}
        <div className="context-menu-item-text">{text}</div>
      </div>
    )
  }
}
