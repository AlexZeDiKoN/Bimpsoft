import React from 'react'
import PropTypes from 'prop-types'
import './style.css'

export default class Toolbar extends React.Component {
  render () {
    return (
      <div className={`toolbar ${this.props.className}`}>
        {this.props.children}
      </div>
    )
  }
}

Toolbar.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}
