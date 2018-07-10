import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import i18n from '../../i18n'

export const COMPLETELY_RELIABLE = 'A'
export const USUALLY_RELIABLE = 'B'
export const FAIRLY_RELIABLE = 'C'
export const NOT_USUALLY_RELIABLE = 'D'
export const UNRELIABLE = 'E'
export const RELIABILITY_CANNOT_BE_JUDGED = 'F'

export const CONFIRMED_BY_OTHER_SOURCES = '1'
export const PROBABLY_TRUE = '2'
export const POSSIBLY_TRUE = '3'
export const DOUBTFULLY_TRUE = '4'
export const IMPROBABLE = '5'
export const TRUTH_CANNOT_BE_JUDGED = '6'

export default class CredibilityForm extends React.Component {
  state = {
    source: FAIRLY_RELIABLE,
    information: CONFIRMED_BY_OTHER_SOURCES,
  }

  changeSourceHandler = (e) => {
    this.setState({ source: e.target.value })
  }

  changeInformationHandler = (e) => {
    this.setState({ information: e.target.value })
  }

  onVerifyHandler = () => {
    const { source, information } = this.state
    this.props.onChange({ source, information })
  }

  render () {
    const { source, information } = this.state

    return (
      <div className="credibility-form" >
        <div className="credibility-form-title">{i18n.SOURCE_CREDIBILITY_AND_INFORMATION_RELIABILITY}</div>
        <div className="credibility-form-controls">
          <label>{i18n.SOURCE}</label>
          <select onChange={this.changeSourceHandler} value={source} >
            <option value={COMPLETELY_RELIABLE }>{i18n.COMPLETELY_RELIABLE }</option>
            <option value={USUALLY_RELIABLE }>{i18n.USUALLY_RELIABLE }</option>
            <option value={FAIRLY_RELIABLE }>{i18n.FAIRLY_RELIABLE }</option>
            <option value={NOT_USUALLY_RELIABLE }>{i18n.NOT_USUALLY_RELIABLE }</option>
            <option value={UNRELIABLE }>{i18n.UNRELIABLE }</option>
            <option value={RELIABILITY_CANNOT_BE_JUDGED }>{i18n.RELIABILITY_CANNOT_BE_JUDGED }</option>
          </select>
          <label>{i18n.INFORMATION}</label>
          <select onChange={this.changeInformationHandler} value={information} >
            <option value={CONFIRMED_BY_OTHER_SOURCES }>{i18n.CONFIRMED_BY_OTHER_SOURCES }</option>
            <option value={PROBABLY_TRUE }>{i18n.PROBABLY_TRUE }</option>
            <option value={POSSIBLY_TRUE }>{i18n.POSSIBLY_TRUE }</option>
            <option value={DOUBTFULLY_TRUE }>{i18n.DOUBTFULLY_TRUE }</option>
            <option value={IMPROBABLE }>{i18n.IMPROBABLE }</option>
            <option value={TRUTH_CANNOT_BE_JUDGED }>{i18n.TRUTH_CANNOT_BE_JUDGED }</option>
          </select>
          <button onClick={this.onVerifyHandler}>{i18n.VERIFY}</button>
        </div>
      </div>
    )
  }
}

CredibilityForm.propTypes = {
  onChange: PropTypes.func,
}
