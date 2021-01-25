import React from 'react'
import PropTypes from 'prop-types'
import { SymbolEditorComponentStateless } from '@C4/MilSymbolEditor'
import { HotKeysContainer, HotKey } from '@C4/CommonComponents'
import { SUBORDINATION_LEVEL_PATH } from '../WithSubordinationLevel'
import { COORDINATE_PATH } from '../CoordinatesMixin'
import placeSearch from '../../../../server/places'

import './style.css'
import { MAX_LENGTH_TEXT } from '../../../../constants/InputText'
import { REDO, UNDO } from '../../../../constants/shortcuts'
import entityKind from '../../../WebMap/entityKind'
import SelectionTacticalSymbol from '../SelectionTacticalSymbol'

const LIST_WIDTH = 600 // максимальна ширина списку для вибору "Військового формування" (px)
const configs = SymbolEditorComponentStateless.configs

const readOnly = { readonly: true }
const hidden = { hidden: true }

const elementsConfigs = {
  [configs.ADD_TO_TEMPLATE]: hidden, // TODO: тимчасово приховуємо команду "Додати до шаблонів"
  [configs.NAME]: hidden, // TODO: тимчасово приховуємо команду "Додати до шаблонів"
  // [configs.commonIdentifier]: readOnly, // включаємо для ручного вводу
}

const elementsConfigsEditable = {
  ...elementsConfigs,
  // TODO
}

const elementsConfigsReadOnly = {
  ...elementsConfigs,
  [configs.BUTTON_OK]: readOnly,
  [configs.BUTTON_CANCEL]: hidden,
  ...Object.values(configs).reduce((acc, key) => ({
    ...acc,
    [key]: {
      ...elementsConfigs[key],
      ...readOnly,
    },
  }), {}),
}

const CODE_PATH = [ 'code' ]
const UNIT_PATH = [ 'unit' ]
const ATTRIBUTES_PATH = [ 'attributes' ]

export const propTypes = {
  orgStructures: PropTypes.shape({
    roots: PropTypes.array,
    byIds: PropTypes.object,
  }),
  elementsConfigs: PropTypes.object,
  ovtData: PropTypes.object,
  ovtSubKind: PropTypes.instanceOf(Map),
  ovtKind: PropTypes.instanceOf(Map),
  coordinatesType: PropTypes.string,
  isFilterMode: PropTypes.bool,
}

const WithMilSymbol = (Component) => class WithMilSymbolComponent extends Component {
  static propTypes = propTypes

  undoRecord = []

  recordIndex = null

  undoHandler = () => this.setResult(() => {
    this.recordIndex = Math.max(0, this.recordIndex - 1)
    return this.undoRecord[this.recordIndex]
  })

  redoHandler = () => this.setResult(() => {
    this.recordIndex = Math.min(this.recordIndex + 1, this.undoRecord.length - 1)
    return this.undoRecord[this.recordIndex]
  })

  setUndoRecord = (data) => {
    this.undoRecord.push(data)
    this.recordIndex = this.undoRecord.length
  }

  codeChangeHandler = (code, subordinationLevel) => this.setResult((result) => {
    this.setUndoRecord(result)
    if (code.length > 20 || !code.match(/^[0-9]+$/)) {
      return result
    }
    return result.setIn(CODE_PATH, code).setIn(SUBORDINATION_LEVEL_PATH, subordinationLevel)
  })

  unitChangeHandler = (unit) => this.setResult((result) => {
    this.setUndoRecord(result)
    const { orgStructures: { byIds } } = this.props
    const {
      symbolData,
      natoLevelID,
      app6Code,
    } = byIds[unit] ?? { symbolData: {}, natoLevelID: 0, app6Code: '10000000000000000000' }
    const uniqueDesignation = symbolData?.uniqueDesignation ?? null
    const higherFormation = symbolData?.higherFormation ?? null
    return result.setIn(UNIT_PATH, unit)
      .setIn(CODE_PATH, app6Code)
      .setIn(SUBORDINATION_LEVEL_PATH, natoLevelID)
      .updateIn(ATTRIBUTES_PATH, (attributes) => attributes.merge({ uniqueDesignation, higherFormation }))
  })

  coordinatesChangeHandler = (coordinate) => this.setResult((result) => {
    this.setUndoRecord(result)
    return result
      .updateIn(COORDINATE_PATH, (coordinates) => coordinates.set(0, coordinate))
      .set('point', coordinate)
  })

  attributesChangeHandler = (newAttributes) => this.setResult((result) => {
    this.setUndoRecord(result)
    const { quantity, speed } = newAttributes
    if (quantity !== undefined) {
      newAttributes.quantity = Math.abs(parseInt(String(quantity).slice(0, 10)) || 0)
    }
    if (speed !== undefined) {
      newAttributes.speed = Math.abs(parseFloat(String(speed).slice(0, 10)) || 0)
    }
    return result.updateIn(ATTRIBUTES_PATH, (attributes) => attributes.merge(newAttributes))
  })

  handlerUnitInfo = (unitId) => {
    if (!unitId) {
      return
    }
    const { itemType } = this.props.orgStructures.byIds[unitId]
    window.explorerBridge.showUnitInfo(itemType, unitId)
  }

  onChangeSymbol = (data) => {
    if (!data) {
      return
    }
    const { code, amp = {} } = JSON.parse(data)
    this.setResult((result) => {
      this.setUndoRecord(result)
      if (code.length > 20 || !code.match(/^[0-9]+$/)) {
        return result
      }
      return result.setIn(CODE_PATH, code).updateIn(ATTRIBUTES_PATH, (attributes) => attributes.merge(amp))
    })
  }

  renderMilSymbol () {
    const result = this.getResult()
    const code = result.getIn(CODE_PATH)
    const coordinatesArray = result.getIn(COORDINATE_PATH).toJS()
    const coordinates = coordinatesArray[0]
    const unit = result.getIn(UNIT_PATH)
    const attributes = result.getIn(ATTRIBUTES_PATH).toJS()
    const subordinationLevel = result.getIn(SUBORDINATION_LEVEL_PATH)
    const { orgStructures, ovtData, coordinatesType, ovtSubKind, ovtKind, isFilterMode } = this.props
    const elementsConfigs = this.isCanEdit() ? elementsConfigsEditable : elementsConfigsReadOnly
    return (
      <HotKeysContainer>
        <HotKey selector={UNDO} onKey={this.undoHandler}/>
        <HotKey selector={REDO} onKey={this.redoHandler}/>
        <SelectionTacticalSymbol
          code={code}
          type={entityKind.POINT}
          attributes={attributes}
          onChange={this.onChangeSymbol}
        />
        <SymbolEditorComponentStateless
          code={code}
          coordinates={coordinates}
          orgStructureId={unit}
          amplifiers={attributes}
          subordinationLevel={subordinationLevel}
          orgStructures={orgStructures}
          elementsConfigs={elementsConfigs}
          onCodeAndLevelChange={this.codeChangeHandler}
          onAmplifiersChange={this.attributesChangeHandler}
          // onNameChange={this.nameChangeHandler}
          onCoordinatesChange={this.coordinatesChangeHandler}
          onOrgStructureChange={this.unitChangeHandler}
          onUnitInfo={this.handlerUnitInfo}
          onSearch={placeSearch}
          ovtData={ovtData}
          maxInputLength={MAX_LENGTH_TEXT.TEXT_INPUT}
          preferredType={coordinatesType}
          listWidth={LIST_WIDTH}
          isFilterMode={isFilterMode}
          ovtKindData={ovtKind}
          ovtSubKindData={ovtSubKind}
        />
      </HotKeysContainer>
    )
  }
}

export default WithMilSymbol
