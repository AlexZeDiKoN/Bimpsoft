import React from 'react'
import PropTypes from 'prop-types'
import './style.css'

const Column = (props) => (
  <div className="dzvin-form-column">
    <label>{props.label}</label>
    <div className="dzvin-form-input">{props.children}</div>
  </div>
)

Column.propTypes = {
  children: PropTypes.oneOfType([ PropTypes.node, PropTypes.arrayOf(PropTypes.node) ]),
  label: PropTypes.string,
}

export default Column
