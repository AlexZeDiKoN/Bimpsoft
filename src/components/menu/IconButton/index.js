import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import './style.css'
const { IconHovered } = components.icons

export default class IconButton extends React.Component {
  static propTypes = {
    icon: PropTypes.string,
    hoverIcon: PropTypes.string,
    text: PropTypes.string,
    value: PropTypes.any,
    checked: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.oneOfType([ PropTypes.node, PropTypes.arrayOf(PropTypes.node) ]),
  }

  clickHandler = () => this.props.onClick(this.props.value)

  render () {
    const { icon, hoverIcon, text, checked = false, children } = this.props
    let className = 'icon-button'
    if (checked) {
      className += ' icon-button-checked'
    }
    return (
      <div className={className}>
        <Tooltip placement="bottomLeft" title={text} mouseEnterDelay={0.5}>
          <IconHovered
            icon={icon}
            hoverIcon={hoverIcon}
            onClick={this.clickHandler}
          />
        </Tooltip>
        {children && (
          <div className="icon-button-sub-panel">
            {children}
          </div>
        )}
      </div>
    )
  }
}
