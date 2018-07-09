import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import memoizeOne from 'memoize-one'
import i18n from '../../i18n'
import * as app6 from '../../model/APP6Code'
import SymbolOption from '../SymbolOption'
import app6Data from '../../model/app6Data'

const MIL_SYMBOL_LAND_UNIT = '10'
const MIL_SYMBOL_LAND_EQUIPMENT = '15'

export default class ModifiersForm extends React.Component {
  constructor (props) {
    super(props)

    this.setIdentity2 = this.setCodePartHOF(app6.setIdentity2)
    this.setSymbol = this.setCodePartHOF(app6.setSymbol)
    this.setStatus = this.setCodePartHOF(app6.setStatus)
    this.setAmplifier = this.setCodePartHOF(app6.setAmplifier)
    this.setModifier1 = this.setCodePartHOF(app6.setModifier1)
    this.setIcon = this.setCodePartHOF(app6.setIcon)
    this.setModifier2 = this.setCodePartHOF(app6.setModifier2)

    this.setPreviewIdentity2 = this.setPreviewCodePartHOF(app6.setIdentity2)
    this.setPreviewSymbol = this.setPreviewCodePartHOF(app6.setSymbol)
    this.setPreviewStatus = this.setPreviewCodePartHOF(app6.setStatus)
    this.setPreviewAmplifier = this.setPreviewCodePartHOF(app6.setAmplifier)
    this.setPreviewModifier1 = this.setPreviewCodePartHOF(app6.setModifier1)
    this.setPreviewIcon = this.setPreviewCodePartHOF(app6.setIcon)
    this.setPreviewModifier2 = this.setPreviewCodePartHOF(app6.setModifier2)
  }

  setCodePartHOF = (app6Reducer) => (key) => {
    this.props.onChange(app6Reducer(this.props.code, key))
  }

  setPreviewCodePartHOF = (app6Reducer) => (key) => {
    this.props.onPreviewStart(app6Reducer(this.props.code, key))
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

  render () {
    const { code, onPreviewEnd } = this.props
    const optionsData = this.getOptionsDataByCode(code, app6Data)

    let amplifiers1 = {}
    let amplifiers2 = {}

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
      <div className="modifiers-form">
        <SymbolOption
          label={i18n.APP6_SYMBOL_IDENTITY}
          values={optionsData.identities}
          onChange={this.setIdentity2}
          onPreviewStart={this.setPreviewIdentity2}
          codePart={app6.getIdentity2(code)}
          onPreviewEnd={onPreviewEnd}
        />
        <SymbolOption
          label={i18n.APP6_SYMBOL_SET}
          values={optionsData.symbols}
          onChange={this.setSymbol}
          onPreviewStart={this.setPreviewSymbol}
          codePart={app6.getSymbol(code)}
          onPreviewEnd={onPreviewEnd}
        />
        <SymbolOption
          label={i18n.APP6_SYMBOL_STATUS}
          values={optionsData.statuses}
          onChange={this.setStatus}
          onPreviewStart={this.setPreviewStatus}
          codePart={app6.getStatus(code)}
          onPreviewEnd={onPreviewEnd}
        />
        <SymbolOption
          label={i18n.APP6_SYMBOL_AMPLIFIER_LAND_UNIT}
          values={amplifiers1}
          onChange={this.setAmplifier}
          onPreviewStart={this.setPreviewAmplifier}
          codePart={app6.getAmplifier(code)}
          onPreviewEnd={onPreviewEnd}
        />
        <SymbolOption
          label={i18n.APP6_SYMBOL_MODIFIER1}
          values={optionsData.modifiers1}
          onChange={this.setModifier1}
          onPreviewStart={this.setPreviewModifier1}
          codePart={app6.getModifier1(code)}
          onPreviewEnd={onPreviewEnd}
        />
        <SymbolOption
          label={i18n.APP6_SYMBOL_ICON}
          values={optionsData.icons}
          onChange={this.setIcon}
          onPreviewStart={this.setPreviewIcon}
          codePart={app6.getIcon(code)}
          onPreviewEnd={onPreviewEnd}
        />
        <SymbolOption
          label={i18n.APP6_SYMBOL_MODIFIER2}
          values={optionsData.modifiers2}
          onChange={this.setModifier2}
          onPreviewStart={this.setPreviewModifier2}
          codePart={app6.getModifier2(code)}
          onPreviewEnd={onPreviewEnd}
        />
        <SymbolOption
          label={i18n.APP6_SYMBOL_AMPLIFIER_LAND_EQUIPMENT}
          values={amplifiers2}
          onChange={this.setAmplifier}
          onPreviewStart={this.setPreviewAmplifier}
          codePart={app6.getAmplifier(code)}
          onPreviewEnd={onPreviewEnd}
        />
      </div>

    )
  }
}

ModifiersForm.propTypes = {
  code: PropTypes.string,
  onChange: PropTypes.func,
  onPreviewStart: PropTypes.func,
  onPreviewEnd: PropTypes.func,
}

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
