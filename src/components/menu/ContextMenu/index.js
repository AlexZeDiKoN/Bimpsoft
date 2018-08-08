import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import ContextMenuItem from './ContextMenuItem'

export default class ContextMenu extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([ PropTypes.node, PropTypes.arrayOf(PropTypes.node) ]),
  }

  render () {
    return (
      <div className="context-menu">
        {this.props.children}
      </div>
    )
  }
}
export { ContextMenuItem }
