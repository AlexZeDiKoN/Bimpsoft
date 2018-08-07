import React from 'react'
import PropTypes from 'prop-types'
import FormRow from './Row'
import FormColumn from './Column'
import './style.css'

const Form = (props) => (<div className={`dzvin-form ${props.className || ''}`}>{props.children}</div>)

Form.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([ PropTypes.node, PropTypes.arrayOf(PropTypes.node) ]),
}

export default Form

export {
  FormRow,
  FormColumn,
}
