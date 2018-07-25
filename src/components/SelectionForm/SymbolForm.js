import React from 'react'
import { SymbolEditorComponent } from '@DZVIN/MilSymbolEditor'

export default class SymbolForm extends React.Component {
  render () {
    return (
      <SymbolEditorComponent
        elementsConfigs={ {
          NAME: { hidden: true },
        }}
        {...this.props}
      />
    )
  }
}
