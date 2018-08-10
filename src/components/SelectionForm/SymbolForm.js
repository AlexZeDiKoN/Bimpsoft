import React from 'react'
import { SymbolEditorComponent } from '@DZVIN/MilSymbolEditor'

export default class SymbolForm extends React.Component {
  render () {
    const { coordinatesArray: [ coordinates ], ...rest } = this.props
    return (
      <SymbolEditorComponent
        elementsConfigs={ {
          NAME: { hidden: true },
        }}
        {...{ coordinates, ...rest }}
      />
    )
  }
}
