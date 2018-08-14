import React from 'react'
import './style.css'
import PropTypes from 'prop-types'
import i18n from '../../../i18n'

const FormButtonOk = (props) => (
  <button className="dzvin-button dzvin-button-ok" onClick={props.onClick}>{i18n.OK}</button>
)
FormButtonOk.propTypes = {
  onClick: PropTypes.func,
}
export default FormButtonOk
