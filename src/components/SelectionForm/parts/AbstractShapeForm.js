import PropTypes from 'prop-types'
import { components } from '@C4/CommonComponents'
import React from 'react'
import './style.css'
import { Set } from 'immutable'
import { PROPERTY_PATH as PATH } from '../../../constants/propertyPath'
import entityKind from '../../WebMap/entityKind'
import { directionAmps } from '../../../constants/symbols'
import { objectArray, objectIsObject, objectObject } from '../../../utils/whatIsIt'

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
      hatch: 'none',
      intermediateAmplifierType: 'none',
      directionIntermediateAmplifier: directionAmps.ACROSS_LINE,
      shownIntermediateAmplifiers: Set(),
      shownNodalPointAmplifiers: Set(),
      nodalPointIcon: 'none',
      direction: '',
      ...amp,
    }
    for (const key of Object.keys(amp)) {
      const objectType = Object.prototype.toString.call(amp[key])
      if (objectType === objectObject) {
        // удаляем объекты (вложенные свойства)
        delete newAmp[key]
      } else if (objectType === objectArray) {
        newAmp[key] = Set(amp[key])
      }
    }
    this.setResult((result) => {
      if (type === entityKind.SOPHISTICATED) {
        // TODO проверить список совместимых линий (был до выбора знака)
        // TODO если необходимо, перегенерация опорных точек
      }
      // обновляем свойства знака
      result = result.setIn(PATH.CODE, code)
        .updateIn(PATH.ATTRIBUTES, (attributes) => attributes.merge(newAmp))
      // переустанавливаем заданные вложенные свойства
      for (const key of Object.keys(amp)) {
        if (objectIsObject(amp[key])) {
          result = result.updateIn([ ...PATH.ATTRIBUTES, key ], (attributes) => {
            return attributes?.merge ? attributes.merge(amp[key]) : attributes
          })
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
