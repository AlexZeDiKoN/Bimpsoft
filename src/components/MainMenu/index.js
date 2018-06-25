import React from 'react'
import { Icon, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import './style.css'

export default class MainMenu extends React.Component {
  constructor () {
    super()
    this.state = {
      openedKeys: [],
    }
  }

  toggleMenu = (key, level) => {
    const openedKeys = this.state.openedKeys.slice(0, level)
    if (this.state.openedKeys[level] !== key) {
      openedKeys[level] = key
    }
    this.setState({ openedKeys })
  }

  renderItem (itemData, level) {
    const title = itemData.icon ? (
      <Tooltip placement="bottom" title={itemData.title}>
        <Icon className="toolbar-button-icon" type={itemData.icon} />
      </Tooltip>
    ) : itemData.title

    if (itemData.items) {
      const subMenu = (this.state.openedKeys[level] === itemData.key) && (
        <div className = "submenu">
          {itemData.items.map((item) => this.renderItem(item, level + 1))}
        </div>
      )
      const isSelected = this.state.openedKeys[level] === itemData.key
      const className = 'menu-button' + (isSelected ? ' menu-button-selected' : '')
      return (
        <div className={className} key={itemData.key}>
          <button
            onClick={() => this.toggleMenu(itemData.key, level)}
            disabled={itemData.disabled}
          >
            {title}
          </button>
          {subMenu}
        </div>
      )
    } else {
      const isSelected = this.props.selectedKeys.indexOf(itemData.name) !== -1
      const className = 'menu-button' + (isSelected ? ' menu-button-selected' : '')
      return (
        <div className={className} key={itemData.key}>
          <button
            onClick={() => {
              this.props.onAction(itemData.key)
              this.toggleMenu(null, level)
            }}
            disabled={itemData.disabled}
          >
            {itemData.checkable && (<Icon className="main-menu-check-icon" type="check"/>)}
            {title}
          </button>
        </div>
      )
    }
  }

  render () {
    return (
      <div className="menu-toolbar">
        {this.props.items.map((item) => this.renderItem(item, 0))}
      </div>
    )
  }
}

MainMenu.propTypes = {
  selectedKeys: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  onAction: PropTypes.func.isRequired,
}
