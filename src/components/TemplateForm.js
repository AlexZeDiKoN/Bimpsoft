import React from 'react'
import PropTypes from 'prop-types'
import { SymbolEditorComponent } from '@DZVIN/MilSymbolEditor'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../i18n'

const { common: { MovablePanel } } = components

export default class TemplateForm extends React.Component {
  changeHandler = (data) => {
    this.props.onChange(data)
  }

  cancelHandler = () => {
    this.props.onCancel()
  }

  render () {
    const { wrapper: Wrapper, selectedTemplate = null } = this.props
    if (selectedTemplate === null) {
      return null
    }
    return (
      <Wrapper
        title={i18n.MIL_TEMPLATE}
        component={(
          <SymbolEditorComponent
            elementsConfigs={ {
              ORG_STRUCTURE: { hidden: true },
              LOCATION: { hidden: true },
              AMPLIFIERS: { hidden: true },
              CREDIBILITY: { hidden: true },
              ADD_TO_TEMPLATE: { hidden: true },
            }}
            {...selectedTemplate}
            onClose={this.cancelHandler}
            onChange={this.changeHandler}
          />
        )}
      />
    )
  }
}
TemplateForm.propTypes = {
  selectedTemplate: PropTypes.object,
  onChange: PropTypes.func,
  onCancel: PropTypes.func,
  wrapper: PropTypes.instanceOf(MovablePanel),
}
