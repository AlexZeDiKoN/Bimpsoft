import React from 'react'
import PropTypes from 'prop-types'
import { SymbolEditorComponentStateless } from '@DZVIN/MilSymbolEditor'
import { SUBORDINATION_LEVEL_PATH } from '../WithSubordinationLevel'
import { COORDINATE_PATH } from '../CoordinatesMixin'
import placeSearch from '../../../../server/places'

import './style.css'

const configs = SymbolEditorComponentStateless.configs

const readOnly = { readonly: true }
const hidden = { hidden: true }

const elementsConfigs = {
  [configs.ADD_TO_TEMPLATE]: hidden, // TODO: тимчасово приховуємо команду "Додати до шаблонів"
  [configs.NAME]: hidden, // TODO: тимчасово приховуємо команду "Додати до шаблонів"
  [configs.commonIdentifier]: readOnly,
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

const WithMilSymbol = (Component) => class WithMilSymbolComponent extends Component {
  static propTypes = {
    orgStructures: PropTypes.shape({
      roots: PropTypes.array,
      byIds: PropTypes.object,
    }),
    elementsConfigs: PropTypes.object,
    ovtData: PropTypes.object,
  }

  codeChangeHandler = (code, subordinationLevel) => this.setResult((result) =>
    result.setIn(CODE_PATH, code).setIn(SUBORDINATION_LEVEL_PATH, subordinationLevel),
  )

  unitChangeHandler = (unit) => this.setResult((result) => {
    const { orgStructures: { byIds} } = this.props
    const { symbolData, natoLevelID, app6Code } = byIds[unit] || { symbolData: {}, natoLevelID: 0, app6Code: '10000000000000000000' }
    const uniqueDesignation = symbolData && (symbolData.uniqueDesignation || null)
    const higherFormation = symbolData && (symbolData.higherFormation || null)
    return result.setIn(UNIT_PATH, unit)
    .setIn(CODE_PATH, app6Code)
    .setIn(SUBORDINATION_LEVEL_PATH, natoLevelID)
    .updateIn(ATTRIBUTES_PATH, (attributes) => attributes.merge({uniqueDesignation, higherFormation}))
  })

  coordinatesChangeHandler = (coordinate) => this.setResult((result) => result
    .updateIn(COORDINATE_PATH, (coordinates) => coordinates.set(0, coordinate))
    .set('point', coordinate),
  )

  attributesChangeHandler = (newAttributes) => this.setResult((result) =>
    result.updateIn(ATTRIBUTES_PATH, (attributes) => attributes.merge(newAttributes)),
  )

  handlerUnitInfo = (unitId) => {
    if (!unitId) { return }
    const { itemType } = this.props.orgStructures.byIds[unitId]
    window.explorerBridge.showUnitInfo(itemType, unitId)
  }

  renderMilSymbol () {
    const result = this.getResult()
    const code = result.getIn(CODE_PATH)
    const coordinatesArray = result.getIn(COORDINATE_PATH).toJS()
    const coordinates = coordinatesArray[0]
    const unit = result.getIn(UNIT_PATH)
    const attributes = result.getIn(ATTRIBUTES_PATH).toJS()
    const subordinationLevel = result.getIn(SUBORDINATION_LEVEL_PATH)
    const { orgStructures, ovtData } = this.props
    const elementsConfigs = this.isCanEdit() ? elementsConfigsEditable : elementsConfigsReadOnly
    return (
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
      />
    )
  }
}

export default WithMilSymbol
