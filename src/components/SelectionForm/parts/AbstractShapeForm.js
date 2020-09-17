import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import React from 'react'
import './style.css'

const {
  default: Form,
  ButtonApply,
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
  onSaveError: PropTypes.func,
  onCheckSave: PropTypes.func,
  orgStructures: PropTypes.object,
}

export default class AbstractShapeForm extends React.Component {
  static propTypes = propTypes

  constructor (props) {
    super(props)
    this.state = {
      saveButtonBlock: false,
    }
  }

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

  enableSaveButton = (enable = true) => {
    this.setState({ saveButtonBlock: !enable })
  }

  saveEditElement = () => {
    const { onCheckSave } = this.props
    this.setState(
      { saveButtonBlock: true },
      () => {
        const check = onCheckSave()
        check?.finally && check.finally(this.enableSaveButton)
      },
    )
  }

  render () {
    const canEdit = this.isCanEdit()
    const { saveButtonBlock } = this.state
    const { onClose } = this.props
    return (
      <Form className="shape-form">
        { this.renderContent() }
        <div className='footer-container'>
          {buttonClose(onClose)}
          {canEdit && (<ButtonApply onClick={this.saveEditElement} disabled={saveButtonBlock}/>)}
        </div>
      </Form>
    )
  }
}
