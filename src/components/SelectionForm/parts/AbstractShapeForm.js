import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import React from 'react'
import './style.css'

const {
  default: Form,
  FormItem,
  FormButtonOk,
  FormButtonCancel,
} = components.form

export default class AbstractShapeForm extends React.Component {
  static propTypes = {
    type: PropTypes.any,
    style: PropTypes.any,
    canEdit: PropTypes.bool,
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    onError: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.state = {
      style: props.style,
      type: props.type,
      errors: [],
    }
  }

  fillResult (result) {
    result.style = this.state.style
    result.type = this.state.type
  }

  okHandler = () => {
    const errors = this.getErrors()
    this.setState({ errors })
    if (errors.length) {
      this.props.onError(errors)
    } else {
      const result = {}
      this.fillResult(result)
      this.props.onChange(result)
    }
  }

  cancelHandler = this.props.onClose

  renderContent () {
    throw new Error('renderContent() is not implemented')
  }

  getErrors () {
    return []
  }

  isCanEdit () {
    return this.props.canEdit
  }

  render () {
    const canEdit = this.isCanEdit()
    return (
      <Form className="shape-form">
        {this.renderContent()}
        <FormItem>
          {canEdit && (<FormButtonCancel onClick={this.cancelHandler}/>)}
          <FormButtonOk onClick={canEdit ? this.okHandler : this.cancelHandler}/>
        </FormItem>
      </Form>
    )
  }
}
