import React from 'react'
import PropTypes from 'prop-types'
import { SymbolEditorComponent, model } from '@DZVIN/MilSymbolEditor'
import './style.css'

const { APP6Code: { setIdentity2, setSymbol, setStatus } } = model
const defaultApp6Code = setStatus(setSymbol(setIdentity2('10000000000000000000', '3'), '10'), '0')
const elementsConfigsEditable = {
  ADD_TO_TEMPLATE: { hidden: true }, // TODO: тимчасово (до 25.08) приховуємо команду "Додати до шаблонів"
  NAME: { hidden: true },
}

const elementsConfigsReadOnly = {}
Object.values(SymbolEditorComponent.configs).forEach((key) => {
  elementsConfigsReadOnly[key] = { readonly: true }
})
elementsConfigsReadOnly[SymbolEditorComponent.configs.NAME].hidden = true
elementsConfigsReadOnly[SymbolEditorComponent.configs.ADD_TO_TEMPLATE].hidden = true
elementsConfigsReadOnly[SymbolEditorComponent.configs.BUTTON_OK].readonly = false
elementsConfigsReadOnly[SymbolEditorComponent.configs.BUTTON_CANCEL].hidden = true

export default class SymbolForm extends React.Component {
  static propTypes = {
    coordinatesArray: PropTypes.any,
    orgStructures: PropTypes.object,
    canEdit: PropTypes.bool,
    onChange: PropTypes.func,
  }

  render () {
    const { coordinatesArray: [ coordinates ], orgStructures, code = null, onChange, canEdit, ...rest } = this.props

    const editorProps = {
      ...rest,
      coordinates,
      code: code === null ? defaultApp6Code : code,
      orgStructures,
      onChange,
      elementsConfigs: canEdit ? elementsConfigsEditable : elementsConfigsReadOnly,
    }
    return (
      <SymbolEditorComponent {...editorProps} />
    )
  }
}
