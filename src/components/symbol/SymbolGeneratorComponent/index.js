import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import * as app6 from '../model/APP6Code'
import CoordinatesForm from './CoordinatesForm'
import MilSymbol from './MilSymbol'
import OrgStructureSelect from './OrgStructureSelect'
import AmplifiersForm from './AmplifiersForm'
import ModifiersForm from './ModifiersForm'
import FlagsForm from './FlagsForm'
import i18n from "../i18n";

export default class SymbolGeneratorComponent extends React.Component {
  static getDerivedStateFromProps (props) {
    const { code, orgStructureId, coordinates, amplifiers } = props
    return { code, orgStructureId, coordinates, amplifiers }
  }

  constructor (props) {
    super(props)

    this.state = {
      // code: '10011500521200000800',
      code: '10000000000000000000',
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

  onOkHandler = () => {
    const { code, orgStructureId, coordinates, amplifiers } = this.state
    this.props.onChange({ code, orgStructureId, coordinates, amplifiers })
  }

  onCancelHandler = () => {
    this.props.onClose()
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

  render () {
    const { code, previewCode, coordinates, orgStructureId, amplifiers } = this.state
    return (
      <div className="symbol-generator">
        <div className="symbol-generator-container">
          <MilSymbol code={previewCode || code} size={72} amplifiers={amplifiers} />
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
        <div className="symbol-generator-buttons">
          <button onClick={this.onOkHandler}>{i18n.OK}</button>
          <button onClick={this.onCancelHandler}>{i18n.CANCEL}</button>
        </div>
      </div>
    )
  }
}

SymbolGeneratorComponent.propTypes = {
  code: PropTypes.string,
  orgStructureId: PropTypes.number,
  orgStructures: PropTypes.shape({
    roots: PropTypes.array.isRequired,
    byIds: PropTypes.object.isRequired,
  }),
  coordinates: PropTypes.object,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
}
