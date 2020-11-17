import React from 'react'
import PropTypes from 'prop-types'
import { MovablePanel } from '@C4/CommonComponents'
import { SymbolEditorComponent } from '@C4/MilSymbolEditor'
import i18n from '../i18n'

export default class TemplateForm extends React.Component {
  changeHandler = (data) => {
    const { templateForm = null } = this.props
    this.props.onChange({ ...data, id: templateForm ? templateForm.id : null })
  }

  cancelHandler = () => {
    this.props.onCancel()
  }

  render () {
    const { wrapper: Wrapper, templateForm = null } = this.props
    if (templateForm === null) {
      return null
    }
    return (
      <Wrapper
        title={i18n.MIL_TEMPLATE}
        onClose={this.cancelHandler}
        defaultPosition={{ x: window.screen.width * 0.5, y: window.screen.height * 0.05 }}
      >
        <SymbolEditorComponent
          elementsConfigs={ {
            ORG_STRUCTURE: { hidden: true },
            LOCATION: { hidden: true },
            AMPLIFIERS: { hidden: true },
            CREDIBILITY: { hidden: true },
            ADD_TO_TEMPLATE: { hidden: true },
          }}
          {...templateForm}
          onClose={this.cancelHandler}
          onChange={this.changeHandler}
        />
      </Wrapper>
    )
  }
}
TemplateForm.propTypes = {
  templateForm: PropTypes.object,
  onChange: PropTypes.func,
  onCancel: PropTypes.func,
  wrapper: PropTypes.oneOf([ MovablePanel ]),
}
