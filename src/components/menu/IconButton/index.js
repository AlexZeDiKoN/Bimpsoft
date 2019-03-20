import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import './style.css'
const { IconHovered } = components.icons

export default class IconButton extends React.PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    hoverIcon: PropTypes.string,
    text: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.any,
    checked: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.oneOfType([ PropTypes.node, PropTypes.arrayOf(PropTypes.node) ]),
  }

  clickHandler = () => this.props.onClick && this.props.onClick(this.props.value)

  render () {
    const { icon, hoverIcon, text, title, checked = false, children } = this.props
    const classList = [ 'icon-button' ]
    if (checked) {
      classList.push('icon-button-checked')
    }
    if (hoverIcon) {
      classList.push('icon-button-hoverable')
    }
    return (
      <div className={classList.join(' ')}>
        <Tooltip placement="bottomLeft" title={text} mouseEnterDelay={0.5}>
          <IconHovered
            title={title}
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
