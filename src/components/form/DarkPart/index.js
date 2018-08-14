import React from 'react'
import './style.css'
import PropTypes from 'prop-types'

const FormDarkPart = (props) => (
  <div className="dzvin-form-dark-part">{props.children}</div>
)
FormDarkPart.propTypes = {
  children: PropTypes.oneOfType([ PropTypes.node, PropTypes.arrayOf(PropTypes.node) ]),
}
export default FormDarkPart
