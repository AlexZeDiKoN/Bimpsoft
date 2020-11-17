import React from 'react'
import PropTypes from 'prop-types'
import { components, MovablePanel, ModalContainer } from '@C4/CommonComponents'
import './style.css'
import FocusTrap from 'react-focus-lock'
import ReactDOM from 'react-dom'
import { shortcuts } from '../../../../../constants'
import { HotKeysContainer, HotKey } from '../../../../common/HotKeys'
import i18n from '../../../../../i18n'
import { errorSymbol } from '../../../../../store/actions/selection'

const { default: Form, buttonNo, buttonYes, FormItem } = components.form
const MAX_OUT_MESSAGE = 50 // максимальное колличество выводимых на форму сообщений

function declOfNum (number, titles) {
  const cases = [ 2, 0, 1, 1, 1, 2 ]
  return titles[ (number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5] ]
}

export default class SaveMilSymbolForm extends React.Component {
  static propTypes = {
    notClickable: PropTypes.bool,
    onApply: PropTypes.func,
    onCancel: PropTypes.func,
    errorCode: PropTypes.number,
    doubleObjects: PropTypes.array,
  }

  render () {
    const {
      onApply,
      onCancel,
      errorCode = errorSymbol.code,
      doubleObjects,
    } = this.props
    let errorMessage = errorCode & errorSymbol.duplication ? i18n.ERROR_MESSAGE_1 : i18n.ERROR_MESSAGE_3
    let doubles = (doubleObjects && Array.isArray(doubleObjects)) ? doubleObjects : [ { code: '', unit: '' } ]
    let question = (errorCode & errorSymbol.duplication) ? i18n.QUESTION_1_0 : i18n.QUESTION_2
    let etcMessage = ''

    if (errorCode & errorSymbol.duplication) {
      if (doubleObjects && Array.isArray(doubleObjects)) {
        if (doubleObjects.length > 1) {
          errorMessage = `${i18n.ERROR_MESSAGE_00}${doubleObjects.length}
            ${declOfNum(doubleObjects.length, i18n.ERROR_MESSAGES_SYMBOL)}`
          // формирование списка выводимых объектов на форму предупреждеия
          if (doubleObjects.length <= MAX_OUT_MESSAGE) {
            doubles = doubleObjects.map((obj) => { return { code: obj.code, unit: obj.unit ?? '' } })
          } else { // выводим только по первым MAX_OUT_MESSAGE дублируемым объекам
            doubles = doubleObjects.slice(0, MAX_OUT_MESSAGE).map((obj) => {
              return { code: obj.code, unit: obj.unit ?? '' }
            })
            etcMessage = `${i18n.AND_MORE} ${doubleObjects.length - MAX_OUT_MESSAGE} ${declOfNum(doubleObjects.length - MAX_OUT_MESSAGE, i18n.SYMBOL_S)}`
          }
          question = i18n.QUESTION_1_1
        } else {
          errorMessage = i18n.ERROR_MESSAGE_1
        }
      }
    }
    return (
      ReactDOM.createPortal(
        <ModalContainer>
          <MovablePanel title={i18n.ERROR_CODE_SIGNS} bounds='div.app-body'>
            <FocusTrap className="confirm-save-overflow">
              <HotKeysContainer>
                <Form className="confirm-save">
                  <FormItem>
                    <div className="confirm-icon-warning">!</div>
                    <div className="confirm-modal-window">
                      <div className="confirm-text">
                        {errorMessage}
                      </div>
                      <div className="confirm-message">
                        {
                          doubles.map((double, index) =>
                            <div className="confirm-text" key={index}>
                              {double.code}
                              <br/>
                              {i18n.ERROR_MESSAGE_2}{double.unit}
                              <br/>
                            </div>,
                          )
                        }
                        {
                          etcMessage && <div className="confirm-text-etc">{etcMessage}</div>
                        }
                        {
                          (errorCode & errorSymbol.code)
                            ? <div className="confirm-text">{i18n.ERROR_MESSAGE_4}</div>
                            : <></>
                        }
                        <br/>
                      </div>
                      <div className="confirm-text">
                        {question}
                      </div>
                    </div>
                  </FormItem>
                  <FormItem>
                    {buttonYes(onApply)}
                    <HotKey selector={shortcuts.ESC} onKey={onCancel} />
                    {buttonNo(onCancel)}
                  </FormItem>
                </Form>
              </HotKeysContainer>
            </FocusTrap>
          </MovablePanel>
        </ModalContainer>,
        document.getElementById('main'),
      )
    )
  }
}
