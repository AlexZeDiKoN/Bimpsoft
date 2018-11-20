import React from 'react'
import './style.css'
import PropTypes from 'prop-types'

const CountLabel = (props) => {
  const { children, className, ...otherProps } = props
  return (
    <div className={(className ? className + ' ' : '') + 'dzvin-count-label'} {...otherProps} >
      {children}
    </div>
  )
}
CountLabel.propTypes = {
  children: PropTypes.oneOfType([ PropTypes.node, PropTypes.arrayOf(PropTypes.node) ]),
  className: PropTypes.string,
}
export default CountLabel
