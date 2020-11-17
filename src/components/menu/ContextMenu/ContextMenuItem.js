import React from 'react'
import PropTypes from 'prop-types'
import { IButton } from '@C4/CommonComponents'

export default class ContextMenuItem extends React.Component {
  static propTypes = {
    icon: PropTypes.string,
    hoverIcon: PropTypes.string,
    text: PropTypes.string,
    value: PropTypes.any,
    checked: PropTypes.bool,
    onClick: PropTypes.func,
  }

  clickHandler = () => {
    const { value, onClick } = this.props

    onClick && onClick(value)
  }

  render () {
    const { icon, text, checked } = this.props

    let className = 'context-Index-item'
    if (checked) {
      className += ' context-Index-item-checked'
    }

    return (
      <div className={className} onClick={this.clickHandler}>
        {icon && (
          <IButton icon={icon}/>
        )}
        <div className="context-menu-item-text">{text}</div>
      </div>
    )
  }
}
