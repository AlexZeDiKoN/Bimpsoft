import React from 'react'
import PropTypes from 'prop-types'
import './style.css'

const Row = (props) => (
  <div className="dzvin-form-row">
    {props.label && (<label>{props.label}</label>)}
    <div className="dzvin-form-input">{props.children}</div>
  </div>
)

Row.propTypes = {
  children: PropTypes.oneOfType([ PropTypes.node, PropTypes.arrayOf(PropTypes.node) ]),
  label: PropTypes.string,
}

export default Row
