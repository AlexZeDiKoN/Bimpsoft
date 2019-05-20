import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import React from 'react'
import './style.css'

const {
  default: Form,
  FormItem,
  buttonSave,
  buttonCancel,
  buttonClose,
} = components.form

export const propTypes = {
  data: PropTypes.object,
  preview: PropTypes.object,
  canEdit: PropTypes.bool,
  onOk: PropTypes.func,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  onError: PropTypes.func,
  orgStructures: PropTypes.object,
}

export default class AbstractShapeForm extends React.Component {
  static propTypes = propTypes

  setResult (resultFunc) {
    const data = resultFunc(this.props.data)
    if (data && this.props.data !== data) {
      this.props.onChange(data)
    }
  }

  getResult () {
    return this.props.data
  }

  getOrgStructures () {
    return this.props.orgStructures
  }

  renderContent () {
    throw new Error('renderContent() is not implemented')
  }

  isCanEdit () {
    return this.props.canEdit
  }

  render () {
    const canEdit = this.isCanEdit()
    const { onClose, onOk } = this.props
    return (
      <Form className="shape-form">
        {this.renderContent()}
        <FormItem>
          {canEdit && buttonCancel(onClose)}
          {canEdit && buttonSave(onOk)}
          {!canEdit && buttonClose(onClose)}
        </FormItem>
      </Form>
    )
  }
}
