import React from 'react'
import PropTypes from 'prop-types'
import { SymbolEditorComponent, model } from '@DZVIN/MilSymbolEditor'

const { APP6Code: { setIdentity2, setSymbol, setStatus } } = model
const defaultApp6Code = setStatus(setSymbol(setIdentity2('10000000000000000000', '3'), '10'), '0')
const elementsConfigs = {
  ADD_TO_TEMPLATE: { hidden: true }, // TODO: тимчасово (до 25.08) приховуємо команду "Додати до шаблонів"
  NAME: { hidden: true },
  CODE: { readonly: true },
}

export default class SymbolForm extends React.Component {
  static propTypes = {
    coordinatesArray: PropTypes.any,
    orgStructures: PropTypes.object,
    onChange: PropTypes.func,
  }

  render () {
    const { coordinatesArray: [ coordinates ], orgStructures, code = null, onChange, ...rest } = this.props
    const editorProps = {
      ...rest,
      coordinates,
      code: code === null ? defaultApp6Code : code,
      orgStructures,
      onChange,
      elementsConfigs,
    }
    return (
      <SymbolEditorComponent {...editorProps} />
    )
  }
}
