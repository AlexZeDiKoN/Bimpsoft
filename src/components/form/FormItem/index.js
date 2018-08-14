import React from 'react'
import './style.css'
import PropTypes from 'prop-types'

const FormItem = (props) => {
  let className = 'dzvin-form-item'
  if (props.className) {
    className += ' ' + props.className
  }
  return (
    <div className={className}>{props.children}</div>
  )
}
FormItem.propTypes = {
  children: PropTypes.oneOfType([ PropTypes.node, PropTypes.arrayOf(PropTypes.node) ]),
  className: PropTypes.string,
}
export default FormItem
