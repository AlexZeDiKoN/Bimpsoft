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
    onChange: PropTypes.func,
    onClose: PropTypes.func,
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
    if (!Object.entries(errors).length) {
      const result = {}
      this.fillResult(result)
      this.props.onChange(result)
    }
  }

  cancelHandler = () => this.props.onClose()

  renderContent () {
    throw new Error('renderContent() is not implemented')
  }

  getErrors () {
    return {}
  }

  render () {
    return (
      <Form className="shape-form">
        <div>{Object.values(this.state.errors).map(error => error.text)}</div>
        {this.renderContent()}
        <FormItem>
          <FormButtonCancel onClick={this.cancelHandler}/>
          <FormButtonOk onClick={this.okHandler}/>
        </FormItem>
      </Form>
    )
  }
}
