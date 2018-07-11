import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import * as app6 from '../model/APP6Code'
import i18n from '../i18n'
import * as symbolOptions from '../model/symbolOptions'
import CoordinatesForm from './CoordinatesForm'
import MilSymbol from './MilSymbol'
import OrgStructureSelect from './OrgStructureSelect'
import AmplifiersForm from './AmplifiersForm'
import ModifiersForm from './ModifiersForm'
import FlagsForm from './FlagsForm'
import CredibilityForm from './CredibilityForm'

export default class SymbolGeneratorComponent extends React.Component {
  constructor (props) {
    super(props)
    const { code, orgStructureId, coordinates, amplifiers } = props
    this.state = {
      code,
      orgStructureId,
      coordinates,
      amplifiers,
      previewCode: null,
    }
  }

  setCode (newCode) {
    if (app6.getSymbol(this.state.code) !== app6.getSymbol(newCode)) {
      newCode = app6.setAmplifier(newCode, '')
      newCode = app6.setIcon(newCode, '')
      newCode = app6.setModifier1(newCode, '')
      newCode = app6.setModifier2(newCode, '')
    }
    this.setState({ code: newCode })
  }

  codeChangeHandler = (code) => {
    this.setCode(code)
  }

  codePreviewStartHandler = (previewCode) => {
    this.setState({ previewCode })
  }

  codePreviewEndHandler = () => {
    this.setState({ previewCode: null })
  }

  onCodeInputChange = (e) => {
    this.setCode(e.target.value)
  }

  okHandler = () => {
    const { code, orgStructureId, coordinates, amplifiers } = this.state
    this.props.onChange({ code, orgStructureId, coordinates, amplifiers })
  }

  cancelHandler = () => {
    this.props.onClose()
  }

  addToTemplatesHandler = () => {
    const { code, orgStructureId, coordinates, amplifiers } = this.state
    this.props.onAddToTemplates({ code, orgStructureId, coordinates, amplifiers })
  }

  orgStructureChangeHandler = (orgStructureId) => {
    this.setState({ orgStructureId })
  }

  coordinatesChangeHandler = (coordinates) => {
    this.setState({ coordinates })
  }

  amplifiersChangeHandler = (amplifiers) => {
    this.setState({ amplifiers })
  }

  credibilityChangeHandler = (credibility) => {
    let { amplifiers = {} } = this.state
    const { source, information } = credibility
    const evaluationRating = `${source}${information}`
    amplifiers = { ...amplifiers, [symbolOptions.evaluationRating]: evaluationRating }
    this.setState({ amplifiers, credibility })
  }

  render () {
    const { code, previewCode, coordinates, orgStructureId, amplifiers } = this.state
    return (
      <div className="symbol-generator">
        <div className="symbol-generator-container">
          <MilSymbol code={previewCode || code} size={72} amplifiers={amplifiers} coordinates={coordinates} />
        </div>
        <ModifiersForm
          code={ code }
          onChange={this.codeChangeHandler}
          onPreviewStart={this.codePreviewStartHandler}
          onPreviewEnd={this.codePreviewEndHandler}
        />
        <div className="symbol-generator-code">
          <input value={previewCode || code} onChange={this.onCodeInputChange}/>
        </div>
        <FlagsForm
          code={ code }
          onChange={this.codeChangeHandler}
          onPreviewStart={this.codePreviewStartHandler}
          onPreviewEnd={this.codePreviewEndHandler}
        />
        <div className="symbol-generator-org-structure">
          <OrgStructureSelect
            label="Підрозділ"
            values={this.props.orgStructures}
            onChange={this.orgStructureChangeHandler}
            id={orgStructureId}
          />
        </div>
        <CoordinatesForm coordinates={coordinates} onChange={this.coordinatesChangeHandler}/>
        <AmplifiersForm amplifiers={amplifiers} onChange={this.amplifiersChangeHandler}/>
        <CredibilityForm onChange={this.credibilityChangeHandler}/>
        <div className="symbol-generator-buttons">
          <a onClick={this.addToTemplatesHandler}>{i18n.ADD_TO_TEMPLATES}</a>
          <button onClick={this.okHandler}>{i18n.OK}</button>
          <button onClick={this.cancelHandler}>{i18n.CANCEL}</button>
        </div>
      </div>
    )
  }
}

SymbolGeneratorComponent.propTypes = {
  code: PropTypes.string,
  amplifiers: PropTypes.object,
  orgStructureId: PropTypes.number,
  orgStructures: PropTypes.shape({
    roots: PropTypes.array.isRequired,
    byIds: PropTypes.object.isRequired,
  }),
  coordinates: PropTypes.object,
  onChange: PropTypes.func,
  onAddToTemplates: PropTypes.func,
  onClose: PropTypes.func,
}
