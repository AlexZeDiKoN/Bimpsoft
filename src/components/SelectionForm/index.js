import React from 'react'
import PropTypes from 'prop-types'
import { SymbolEditorComponent } from '@DZVIN/MilSymbolEditor'
import { components } from '@DZVIN/CommonComponents'
import * as SelectionTypes from '../../constants/SelectionTypes'
import i18n from '../../i18n'

const { common: { MovablePanel } } = components

class SymbolForm extends React.Component {
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

const forms = {
  [SelectionTypes.POINT_SIGN]: {
    title: i18n.MIL_TEMPLATE,
    component: SymbolForm,
  },
}

export default class SelectionForm extends React.Component {

  changeHandler = (data) => {
    const { selectionData } = this.props
    switch (selectionData.type) {
      case SelectionTypes.POINT_SIGN:
        this.props.onChange(data)
        break
      default:
    }
  }

  cancelHandler = () => {
    this.props.onCancel()
  }

  addToTemplateHandler = (data) => {
    this.props.onAddToTemplates(data)
  }

  render () {
    const { selectionData } = this.props
    if (selectionData === null || !forms.hasOwnProperty(selectionData.type)) {
      return null
    }
    const { title, component: Component } = forms[selectionData.type]

    const { wrapper: Wrapper } = this.props
    return (
      <Wrapper title={title} component={ (
        <Component
          {...selectionData}
          onChange={this.changeHandler}
          onClose={this.cancelHandler}
          onAddToTemplates={this.addToTemplateHandler}
        />
      ) } />
    )
  }
}

SelectionForm.propTypes = {
  selectionData: PropTypes.object,
  onChange: PropTypes.func,
  onCancel: PropTypes.func,
  onAddToTemplates: PropTypes.func,
  wrapper: PropTypes.instanceOf(MovablePanel),
}
