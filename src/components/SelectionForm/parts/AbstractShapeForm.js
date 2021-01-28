import PropTypes from 'prop-types'
import { components } from '@C4/CommonComponents'
import React from 'react'
import './style.css'
import { PROPERTY_PATH as PATH } from '../../../constants/propertyPath'
import entityKind from '../../WebMap/entityKind'
import { directionAmps } from '../../../constants/symbols'

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
  disableSaveButton: PropTypes.bool,
  onEnableSaveButton: PropTypes.func,
}

export default class AbstractShapeForm extends React.Component {
  static propTypes = propTypes

  componentDidMount () {
    this.props.onEnableSaveButton()
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
    const { onCheckSave, onEnableSaveButton } = this.props
    const check = onCheckSave()
    if (check && check.finally) {
      check.finally(onEnableSaveButton) // После проверки включаем кнопку "Сохранить"
    }
  }

  onChangeTacticalSymbol = (data) => {
    if (!data) {
      return
    }
    const { code, isSvg, amp = {} } = JSON.parse(data)
    if (!code) {
      return
    }
    const type = isSvg ? amp.type : entityKind.POINT
    if (type === entityKind.POINT) {
      // для точечного знака упрощенное перестроение
      this.setResult((result) => {
        this.setUndoRecord(result)
        if (code.length > 20 || !code.match(/^[0-9]+$/)) {
          return result
        }
        return result.setIn(PATH.CODE, code)
          .updateIn(PATH.ATTRIBUTES, (attributes) => attributes.merge(amp))
      })
      return
    }
    // обработка амплификаторов
    const newAmp = {
      lineType: 'solid',
      directionIntermediateAmplifier: directionAmps.ACROSS_LINE,
      ...amp,
    }
    console.log('amp', newAmp)
    for (const key of Object.keys(newAmp)) {
      const objectType = Object.prototype.toString.call(newAmp[key])
      if (objectType === '[object Object]' || objectType === '[object Array]') {
        // удаляем объекты (вложенные свойства)
        console.log(`delete ${key}`, newAmp[key])
        delete newAmp[key]
      }
    }
    this.setResult((result) => {
      if (type === entityKind.SOPHISTICATED) {
        // проверить список совместимых линий (был до выбора знака)
        // если необходимо, перегенерация опорных точе
      }
      console.log(`symbol`, result.attributes)
      // обновляем свойства знака
      result = result.setIn(PATH.CODE, code)
        .updateIn(PATH.ATTRIBUTES, (attributes) => attributes.merge(newAmp))
      console.log('merge', result.attributes)
      // переустанавливаем заданные вложенные свойства
      for (const key of Object.keys(amp)) {
        console.log(`update ${key}`, amp[key])
        if (Object.prototype.toString.call(amp[key]) === '[object Object]') {
          result = result.updateIn([ ...PATH.ATTRIBUTES, key ], (attributes) => attributes.merge(amp[key]))
        }
      }
      return result
    })
  }

  render () {
    const canEdit = this.isCanEdit()
    const { onClose, disableSaveButton } = this.props
    return (
      <Form className="shape-form">
        { this.renderContent() }
        <div className='footer-container'>
          {buttonClose(onClose)}
          {canEdit && (<ButtonApply onClick={this.saveEditElement} disabled={disableSaveButton}/>)}
        </div>
      </Form>
    )
  }
}
