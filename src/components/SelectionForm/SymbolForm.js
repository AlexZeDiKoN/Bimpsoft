import React from 'react'
import PropTypes from 'prop-types'
import { SymbolEditorComponent } from '@DZVIN/MilSymbolEditor'

export default class SymbolForm extends React.Component {
  static propTypes = {
    coordinatesArray: PropTypes.any,
    orgStructures: PropTypes.object,
    onChange: PropTypes.func,
  }

  render () {
    const { coordinatesArray: [ coordinates ], orgStructures, onChange, ...rest } = this.props
    return (
      <SymbolEditorComponent
        {...{ ...rest, coordinates, orgStructures, onChange }}
        elementsConfigs={ {
          ADD_TO_TEMPLATE: { hidden: true }, // TODO: тимчасово (до 25.08) приховуємо команду "Додати до шаблонів"
          NAME: { hidden: true },
          CODE: { readonly: true },
        }}

      />
    )
  }
}
