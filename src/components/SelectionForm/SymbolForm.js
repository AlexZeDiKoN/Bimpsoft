import React from 'react'
import PropTypes from 'prop-types'
import { SymbolEditorComponent } from '@DZVIN/MilSymbolEditor'
import SubordinationLevel from '../../constants/SubordinationLevel'

export default class SymbolForm extends React.Component {
  static propTypes = {
    coordinatesArray: PropTypes.any,
    orgStructures: PropTypes.object,
    onChange: PropTypes.func,
  }

  changeHandler = (values) => {
    console.log('SymbolForm.changeHandler', values)
    const {
      subordinationLevel: subordinationLevelNumber,
      ...rest
    } = values
    const subordinationLevel = SubordinationLevel.list.find(({ number }) => number === subordinationLevelNumber)
    this.props.onChange({ ...rest, subordinationLevel: (subordinationLevel ? subordinationLevel.value : null) })
  }

  render () {
    const { coordinatesArray: [ coordinates ], orgStructures, onChange, ...rest } = this.props
    return (
      <SymbolEditorComponent
        {...{ ...rest, coordinates, orgStructures }}
        onChange={this.changeHandler}
        elementsConfigs={ {
          ADD_TO_TEMPLATE: { hidden: true }, // TODO: тимчасово (до 25.08) приховуємо команду "Додати до шаблонів"
          NAME: { hidden: true },
          CODE: { readonly: true },
        }}

      />
    )
  }
}
