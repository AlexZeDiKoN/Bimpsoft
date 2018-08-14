import React from 'react'
import './style.css'
import PropTypes from 'prop-types'
import i18n from '../../../i18n'

const FormButtonCancel = (props) => (
  <button className="dzvin-button dzvin-button-cancel" onClick={props.onClick}>{i18n.CANCEL}</button>
)
FormButtonCancel.propTypes = {
  onClick: PropTypes.func,
}
export default FormButtonCancel
