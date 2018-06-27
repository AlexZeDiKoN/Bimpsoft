import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import memoizeOne from 'memoize-one'
import * as app6 from '../model/APP6Code'
import app6Data from '../model/app6Data'
import i18n from '../i18n'
import MilSymbol from './MilSymbol'
import SymbolOption from './SymbolOption'
import SymbolFlag from './SymbolFlag'

const fromArray = (arr) => {
  const byIds = {}
  const roots = []
  if (arr !== undefined && Array.isArray(arr)) {
    for (const { id, title } of arr) {
      byIds[id] = { codePart: id, title }
      roots.push(id)
    }
  }
  return { byIds, roots }
}
const makeChildren = (values) => {
  const byIds = {}
  const roots = []
  if (values !== undefined && Array.isArray(values)) {
    for (const { id, title } of values) {
      byIds[id] = { codePart: id, title, children: [] }
    }
    for (const item of values) {
      const id = item.id

      const parentId = (id.substr(4, 2) !== '00')
        ? (`${id.substr(0, 4)}00`)
        : (id.substr(2, 2) !== '00') ? (`${id.substr(0, 2)}0000`) : null
      byIds[id].parentId = parentId
      const parent = byIds[parentId]
      if (parent) {
        parent.children.push(id)
      } else {
        roots.push(id)
      }
    }
  }
  return { byIds, roots }
}

function setCodesByPart (code, entity, app6Reducer) {
  const codeByPart = {}
  const codeParts = Object.keys(entity.byIds)
  for (const codePart of codeParts) {
    codeByPart[codePart] = app6Reducer(code, codePart)
  }
  return { ...entity, codeByPart }
}

const MIL_SYMBOL_LAND_UNIT = '10'
const MIL_SYMBOL_LAND_EQUIPMENT = '15'

export default class SymbolGeneratorComponent extends React.Component {

  static getDerivedStateFromProps (props) {
    return { code: props.code }
  }

  constructor (props) {
    super(props)

    this.state = {
      // code: '10011500521200000800',
      code: '10000000000000000000',
      previewCode: null,
    }

    this.setIdentity2 = this.setCodePart.bind(this, app6.setIdentity2)
    this.setSymbol = this.setCodePart.bind(this, app6.setSymbol)
    this.setStatus = this.setCodePart.bind(this, app6.setStatus)
    this.setAmplifier = this.setCodePart.bind(this, app6.setAmplifier)
    this.setModifier1 = this.setCodePart.bind(this, app6.setModifier1)
    this.setIcon = this.setCodePart.bind(this, app6.setIcon)
    this.setModifier2 = this.setCodePart.bind(this, app6.setModifier2)
    this.setHQ = this.setCodePart.bind(this, app6.setHQ)
    this.setTaskForce = this.setCodePart.bind(this, app6.setTaskForce)
    this.setDummy = this.setCodePart.bind(this, app6.setDummy)

    this.setPreviewIdentity2 = this.setPreviewCodePart.bind(this, app6.setIdentity2)
    this.setPreviewSymbol = this.setPreviewCodePart.bind(this, app6.setSymbol)
    this.setPreviewStatus = this.setPreviewCodePart.bind(this, app6.setStatus)
    this.setPreviewAmplifier = this.setPreviewCodePart.bind(this, app6.setAmplifier)
    this.setPreviewModifier1 = this.setPreviewCodePart.bind(this, app6.setModifier1)
    this.setPreviewIcon = this.setPreviewCodePart.bind(this, app6.setIcon)
    this.setPreviewModifier2 = this.setPreviewCodePart.bind(this, app6.setModifier2)
    this.setPreviewHQ = this.setPreviewCodePart.bind(this, app6.setHQ)
    this.setPreviewTaskForce = this.setPreviewCodePart.bind(this, app6.setTaskForce)
    this.setPreviewDummy = this.setPreviewCodePart.bind(this, app6.setDummy)
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

  setCodePart (app6Reducer, key) {
    this.setCode(app6Reducer(this.state.code, key))
  }

  setPreviewCodePart = (app6Reducer, key) => {
    const previewCode = app6Reducer(this.state.code, key)
    this.setState({ previewCode })
  }

  onPreviewEnd = () => {
    this.setState({ previewCode: null })
  }

  onCodeInputChange = (e) => {
    this.setCode(e.target.value)
  }

  getOptionsData = memoizeOne(
    (app6Data) => ({
      identities: fromArray(app6Data.identities),
      symbols: fromArray(app6Data.symbols),
      statuses: fromArray(app6Data.statuses),
    })
  )

  getOptionsDataBySymbol = memoizeOne((newSymbolCodePart, app6Data) => {
    const optionsData = this.getOptionsData(app6Data)
    return {
      ...optionsData,
      amplifiers: fromArray(app6Data.amplifiers[newSymbolCodePart]),
      icons: makeChildren(app6Data.icons[newSymbolCodePart]),
      modifiers1: fromArray(app6Data.modifiers1[newSymbolCodePart]),
      modifiers2: fromArray(app6Data.modifiers2[newSymbolCodePart]),
    }
  })

  getOptionsDataByCode = memoizeOne((code, app6Data) => {
    const optionsData = this.getOptionsDataBySymbol(app6.getSymbol(code), app6Data)
    code = app6.setHQ(code, false)
    code = app6.setTaskForce(code, false)
    code = app6.setDummy(code, false)
    return {
      identities: setCodesByPart(code, optionsData.identities, app6.setIdentity),
      symbols: setCodesByPart(code, optionsData.symbols, app6.setSymbol),
      statuses: setCodesByPart(code, optionsData.statuses, app6.setStatus),
      amplifiers: setCodesByPart(code, optionsData.amplifiers, app6.setAmplifier),
      icons: setCodesByPart(code, optionsData.icons, app6.setIcon),
      modifiers1: setCodesByPart(code, optionsData.modifiers1, app6.setModifier1),
      modifiers2: setCodesByPart(code, optionsData.modifiers2, app6.setModifier2),
    }
  })

  onOkHandler = () => {
    this.props.onChange(this.state.code)
  }

  onCancelHandler = () => {
    this.props.onClose()
  }

  render () {
    const { code, previewCode } = this.state

    const optionsData = this.getOptionsDataByCode(code, app6Data)

    let amplifiers1 = []
    let amplifiers2 = []

    const amplifiers = optionsData.amplifiers
    if (amplifiers !== null) {
      const symbolCodePart = app6.getSymbol(code)
      if (symbolCodePart === MIL_SYMBOL_LAND_UNIT) {
        amplifiers1 = amplifiers
      }
      if (symbolCodePart === MIL_SYMBOL_LAND_EQUIPMENT) {
        amplifiers2 = amplifiers
      }
    }

    return (
      <div className="symbol-generator">
        <div className="symbol-generator-container">
          <MilSymbol code={previewCode || code} size={72} />
        </div>
        <div className="symbol-generator-options">
          <SymbolOption
            label={i18n.APP6_SYMBOL_IDENTITY}
            values={optionsData.identities}
            onChange={this.setIdentity2}
            onPreviewStart={this.setPreviewIdentity2}
            codePart={app6.getIdentity2(code)}
            onPreviewEnd={this.onPreviewEnd}
          />
          <SymbolOption
            label={i18n.APP6_SYMBOL_SET}
            values={optionsData.symbols}
            onChange={this.setSymbol}
            onPreviewStart={this.setPreviewSymbol}
            codePart={app6.getSymbol(code)}
            onPreviewEnd={this.onPreviewEnd}
          />
          <SymbolOption
            label={i18n.APP6_SYMBOL_STATUS}
            values={optionsData.statuses}
            onChange={this.setStatus}
            onPreviewStart={this.setPreviewStatus}
            codePart={app6.getStatus(code)}
            onPreviewEnd={this.onPreviewEnd}
          />
          <SymbolOption
            label={i18n.APP6_SYMBOL_AMPLIFIER_LAND_UNIT}
            values={amplifiers1}
            onChange={this.setAmplifier}
            onPreviewStart={this.setPreviewAmplifier}
            codePart={app6.getAmplifier(code)}
            onPreviewEnd={this.onPreviewEnd}
          />
          <SymbolOption
            label={i18n.APP6_SYMBOL_MODIFIER1}
            values={optionsData.modifiers1}
            onChange={this.setModifier1}
            onPreviewStart={this.setPreviewModifier1}
            codePart={app6.getModifier1(code)}
            onPreviewEnd={this.onPreviewEnd}
          />
          <SymbolOption
            label={i18n.APP6_SYMBOL_ICON}
            values={optionsData.icons}
            onChange={this.setIcon}
            onPreviewStart={this.setPreviewIcon}
            codePart={app6.getIcon(code)}
            onPreviewEnd={this.onPreviewEnd}
          />
          <SymbolOption
            label={i18n.APP6_SYMBOL_MODIFIER2}
            values={optionsData.modifiers2}
            onChange={this.setModifier2}
            onPreviewStart={this.setPreviewModifier2}
            codePart={app6.getModifier2(code)}
            onPreviewEnd={this.onPreviewEnd}
          />
          <SymbolOption
            label={i18n.APP6_SYMBOL_AMPLIFIER_LAND_EQUIPMENT}
            values={amplifiers2}
            onChange={this.setAmplifier}
            onPreviewStart={this.setPreviewAmplifier}
            codePart={app6.getAmplifier(code)}
            onPreviewEnd={this.onPreviewEnd}
          />
        </div>
        <div className="symbol-generator-code">
          <input value={previewCode || code} onChange={this.onCodeInputChange}/>
        </div>
        <div className="symbol-generator-flags">
          <SymbolFlag
            label={i18n.FEINT_DUMMY}
            onChange={this.setDummy}
            onPreviewStart={this.setPreviewDummy}
            checked={app6.isDummy(code)}
            onPreviewEnd={this.onPreviewEnd}
          />
          <SymbolFlag
            label={i18n.TASK_FORCE}
            onChange={this.setTaskForce}
            onPreviewStart={this.setPreviewTaskForce}
            checked={app6.isTaskForce(code)}
            onPreviewEnd={this.onPreviewEnd}
          />
          <SymbolFlag
            label={i18n.HEADQUARTERS}
            onChange={this.setHQ}
            onPreviewStart={this.setPreviewHQ}
            checked={app6.isHQ(code)}
            onPreviewEnd={this.onPreviewEnd}
          />
        </div>
        <div className="symbol-generator-buttons">
          <button onClick={this.onOkHandler}>Гаразд</button>
          <button onClick={this.onCancelHandler}>Скасувати</button>
        </div>
      </div>
    )
  }
}

SymbolGeneratorComponent.propTypes = {
  code: PropTypes.object,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
}
