import React from 'react'
import PropTypes from 'prop-types'
import ContextMenuItem from './ContextMenuItem'

import './style.css'

export default class ContextMenu extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]),
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
