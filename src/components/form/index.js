import React from 'react'
import PropTypes from 'prop-types'
import FormRow from './Row'
import FormColumn from './Column'
import FormDivider from './Divider'
import FormItem from './FormItem'
import FormDarkPart from './DarkPart'
import FormButtonOk from './ButtonOk'
import FormButtonCancel from './ButtonCancel'
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
  FormDivider,
  FormItem,
  FormDarkPart,
  FormButtonOk,
  FormButtonCancel,
}
