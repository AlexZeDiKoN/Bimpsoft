import React from 'react'
import PropTypes from 'prop-types'
import { SymbolEditorComponent } from '@DZVIN/MilSymbolEditor'

export default class SymbolForm extends React.Component {
  static propTypes = {
    coordinatesArray: PropTypes.arrayOf(PropTypes.object),
  }

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
