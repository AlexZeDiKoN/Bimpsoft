import React from 'react'
import PropTypes from 'prop-types'
import { SymbolEditorComponentStateless } from '@DZVIN/MilSymbolEditor'
import './style.css'
import { SUBORDINATION_LEVEL_PATH } from '../WithSubordinationLevel'
import { COORDINATE_PATH } from '../CoordinatesMixin'

const elementsConfigsEditable = {
  ADD_TO_TEMPLATE: { hidden: true }, // TODO: тимчасово (до 25.08) приховуємо команду "Додати до шаблонів"
  NAME: { hidden: true },
}

const elementsConfigsReadOnly = {}
{
  const configs = SymbolEditorComponentStateless.configs
  Object.values(configs).forEach((key) => {
    elementsConfigsReadOnly[key] = { readonly: true }
  })
  elementsConfigsReadOnly[configs.NAME].hidden = true
  elementsConfigsReadOnly[configs.ADD_TO_TEMPLATE].hidden = true
  elementsConfigsReadOnly[configs.BUTTON_OK].readonly = false
  elementsConfigsReadOnly[configs.BUTTON_CANCEL].hidden = true
}

const CODE_PATH = [ 'code' ]
const UNIT_PATH = [ 'unit' ]
const ATTRIBUTES_PATH = [ 'attributes' ]

const WithMilSymbol = (Component) => class WithMilSymbolComponent extends Component {
  propTypes = {
    orgStructures: PropTypes.shape({
      roots: PropTypes.array,
      byIds: PropTypes.object,
    }),
    elementsConfigs: PropTypes.object,
  }

  codeChangeHandler = (code, subordinationLevel) => this.setResult((result) =>
    result.setIn(CODE_PATH, code).setIn(SUBORDINATION_LEVEL_PATH, subordinationLevel)
  )

  unitChangeHandler = (unit) => this.setResult((result) => result.setIn(UNIT_PATH, unit))

  coordinatesChangeHandler = (coordinate) => this.setResult((result) =>
    result.updateIn(COORDINATE_PATH, (coordinates) => coordinates.set(0, coordinate))
      .set('point', coordinate)
  )

  attributesChangeHandler = (newAttributes) => this.setResult((result) =>
    result.updateIn(ATTRIBUTES_PATH, (attributes) => attributes.merge(newAttributes))
  )

  renderMilSymbol () {
    const result = this.getResult()
    const code = result.getIn(CODE_PATH)
    const coordinatesArray = result.getIn(COORDINATE_PATH)
    const coordinates = coordinatesArray.get(0)
    const unit = result.getIn(UNIT_PATH)
    const attributes = result.getIn(ATTRIBUTES_PATH).toJS()
    const subordinationLevel = result.getIn(SUBORDINATION_LEVEL_PATH)
    const { orgStructures } = this.props
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
        onNameChange={this.nameChangeHandler}
        onCoordinatesChange={this.coordinatesChangeHandler}
        onOrgStructureChange={this.unitChangeHandler}
      />
    )
  }
}

export default WithMilSymbol
