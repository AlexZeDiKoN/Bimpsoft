import React from 'react'
import PropTypes from 'prop-types'
import { SymbolEditorComponent } from '@DZVIN/MilSymbolEditor'

export default class SymbolForm extends React.Component {
  static propTypes = {
    coordinatesArray: PropTypes.any,
    orgStructures: PropTypes.object,
  }

  render () {
    const { coordinatesArray: [ coordinates ], orgStructures, ...rest } = this.props
    // TODO: тимчасово (до 25.08) приховуємо команду "Додати до шаблонів"
    rest.elementsConfigs = { ADD_TO_TEMPLATE: { hidden: true } }
    return (
      <SymbolEditorComponent
        orgStructures={orgStructures}
        elementsConfigs={ {
          NAME: { hidden: true },
        }}
        {...{ coordinates, ...rest }}
      />
    )
  }
}
