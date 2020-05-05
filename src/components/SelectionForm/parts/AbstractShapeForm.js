import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import React from 'react'
import './style.css'
import SelectionTypes from '../../../constants/SelectionTypes'
import SaveMilSymbolForm from '../forms/MilSymbolForm/SaveMilSymbolForm'

const {
  default: Form,
  FormItem,
  buttonApply,
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
  orgStructures: PropTypes.object,
  getSameObjects: PropTypes.func,
}

export default class AbstractShapeForm extends React.Component {
  static propTypes = propTypes

  state = {
    showSaveForm: false,
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

  onOk = () => {
    const { type } = this.props.data
    if (type === SelectionTypes.POINT) {
      const { code, unit, layer, id } = this.props.data
      // перевірка коду знака, підрозділу на дублювання
      const symbols = this.props.getSameObjects(layer, unit, code, SelectionTypes.POINT)
      const ident = symbols.filter((symbol, index) => (Number(index) !== Number(id)))
      if (ident && ident.size > 0) {
        this.setState({ showSaveForm: true })
        const { onSaveError } = this.props
        onSaveError()
      }
    }
    const { onOk } = this.props
    onOk()
  }

  onApplyOk = () => {
    this.setState({ showSaveForm: false })
    const { onOk } = this.props
    onOk()
  }

  onApplyCancel = () => {
    this.setState({ showSaveForm: false })
  }

  errorSaveForm = () => {
    const { unit, code } = this.props.data
    const { orgStructures } = this.props
    const unitText = orgStructures.byIds && orgStructures.byIds[unit]
      ? orgStructures.byIds[unit].fullName : ''
    return <SaveMilSymbolForm
      unit={unitText}
      code={code}
      onApply={this.onApplyOk}
      onCancel={this.onApplyCancel}
    />
  }

  render () {
    const canEdit = this.isCanEdit()
    const { onClose } = this.props
    const showSaveForm = false
    return (
      showSaveForm ? this.errorSaveForm()
        : <Form className="shape-form">
          { this.renderContent() }
          <FormItem>
            {buttonClose(onClose)}
            {canEdit && buttonApply(() => this.onOk())}
          </FormItem>
        </Form>
    )
  }
}
