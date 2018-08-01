import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import './style.css'

const { IconHovered } = components.icons

export default class CommandButton extends React.Component {
  static propTypes = {
    command: PropTypes.object,
    showTitle: PropTypes.bool,
    onCommand: PropTypes,
    children: PropTypes.node,
  }

  clickHandler = () => this.props.onCommand(this.props.command)

  render () {
    const { command, children } = this.props
    const { title, icon, hoverIcon, disabled } = command
    return (
      <Tooltip
        className="command-button"
        placement="bottomLeft"
        title={title}
        onClick={this.clickHandler}>
        <IconHovered style={{ display: disabled ? 'none' : null }} icon={icon} hoverIcon={hoverIcon} />
        {children && (
          <div className="command-button-sub-panel">
            {children}
          </div>
        )}
      </Tooltip>
    )
  }
}
