import React from 'react'
import './style.css'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import Resizable from 're-resizable'

export default class MovablePanel extends React.Component {
  render () {
    return (
      <Draggable
        handle=".movable-panel-header"
        bounds="parent"
        defaultPosition={{ x: 100, y: 100 }}
      >
        <Resizable
          className="movable-panel"
          minWidth={600}
          defaultSize={{ width: 700, height: 800 }}
          style={{ zIndex: 10001, position: 'absolute' }}

        >
          <div className="movable-panel-header">{this.props.title}</div>
          {this.props.component}
        </Resizable>
      </Draggable>
    )
  }
}

MovablePanel.propTypes = {
  title: PropTypes.string,
  component: PropTypes.object,
}
