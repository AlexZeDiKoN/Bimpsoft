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

const elementsConfigsEditable = {
  ADD_TO_TEMPLATE: hidden, // TODO: тимчасово (до 25.08) приховуємо команду "Додати до шаблонів"
  NAME: hidden,
  [configs.commonIdentifier]: readOnly,
}

const elementsConfigsReadOnly = {
  [configs.NAME]: hidden,
  [configs.ADD_TO_TEMPLATE]: hidden,
  [configs.BUTTON_OK]: readOnly,
  [configs.BUTTON_CANCEL]: hidden,
  [configs.commonIdentifier]: readOnly,
  ...Object.values(configs).reduce((acc, key) => {
    acc[key] = readOnly
    return acc
  }, {}),
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
    result.setIn(CODE_PATH, code).setIn(SUBORDINATION_LEVEL_PATH, subordinationLevel)
  )

  unitChangeHandler = (unit) => this.setResult((result) => result.setIn(UNIT_PATH, unit))

  coordinatesChangeHandler = (coordinate) => this.setResult((result) => result
    .updateIn(COORDINATE_PATH, (coordinates) => coordinates.set(0, coordinate))
    .set('point', coordinate)
  )

  attributesChangeHandler = (newAttributes) => this.setResult((result) =>
    result.updateIn(ATTRIBUTES_PATH, (attributes) => attributes.merge(newAttributes))
  )

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
        onUnitInfo={window.explorerBridge.showUnitInfo}
        onSearch={placeSearch}
        ovtData={ovtData}
      />
    )
  }
}

export default WithMilSymbol
