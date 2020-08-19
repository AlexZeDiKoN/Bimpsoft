import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import './style.css'
import FocusTrap from 'react-focus-lock'
import { isArray } from 'leaflet/src/core/Util'
import { shortcuts } from '../../../../../constants'
import { HotKeysContainer, HotKey } from '../../../../common/HotKeys'
import i18n from '../../../../../i18n'
import { errorSymbol } from '../../../../../store/actions/selection'

const { default: Form, buttonNo, buttonYes, FormItem } = components.form

export default class SaveMilSymbolForm extends React.Component {
  static propTypes = {
    unitText: PropTypes.string,
    code: PropTypes.string,
    notClickable: PropTypes.bool,
    onApply: PropTypes.func,
    onCancel: PropTypes.func,
    errorCode: PropTypes.number,
    doubleObjects: PropTypes.array,
  }

  render () {
    const {
      code = '',
      unitText = '',
      onApply, onCancel,
      notClickable = true,
      errorCode = errorSymbol.code,
      doubleObjects,
    } = this.props
    let errorMessage = i18n.ERROR_MESSAGE_3
    let doubles = [ { code, unit: unitText } ]
    let isEtc = false
    let question = i18n.QUESTION_1_0

    if (errorCode & errorSymbol.duplication) {
      if (doubleObjects && isArray(doubleObjects)) {
        if (doubleObjects.length > 1) {
          errorMessage = `${i18n.ERROR_MESSAGE_00}${doubleObjects.length}${(doubleObjects.length < 5) ? i18n.ERROR_MESSAGE_01 : i18n.ERROR_MESSAGE_02}`
          if (doubleObjects.length < 5) {
            doubles = doubleObjects.map((obj) => { return { code: obj.code, unit: obj.unit ?? '' } })
          } else {
            doubles = doubleObjects.slice(0, 3).map((obj) => { return { code: obj.code, unit: obj.unit ?? '' } })
            isEtc = true
          }
          question = i18n.QUESTION_1_1
        } else {
          errorMessage = i18n.ERROR_MESSAGE_1
          doubles = [ { code: doubleObjects[0].code, unit: doubleObjects[0].unit } ]
        }
      }
    }
    return (
      <>
        { notClickable ? <div className="not-clickable-area"> </div> : <></> }
        <FocusTrap className="confirm-save-overflow">
          <HotKeysContainer>
            <Form className="confirm-save">
              <FormItem>
                <div className="confirm-icon-warning">!</div>
                <div className="confirm-modal-window">
                  {notClickable ? <div className="confirm-title">{i18n.ERROR_CODE_SIGNS}</div> : <></>}
                  <div className="confirm-text">
                    {errorMessage}
                  </div>
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
                  {isEtc ? <div className="confirm-text" style={ { textAlign: 'center' } }>
                    •
                    <br/>
                    •
                    <br/>
                    •
                  </div> : <></>
                  }
                  {(errorCode & errorSymbol.code) ? <div className="confirm-text">{i18n.ERROR_MESSAGE_4}</div> : <></>}
                  <br/>
                  <div className="confirm-text">
                    {(errorCode & errorSymbol.duplication) ? question : i18n.QUESTION_2}
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
      </>
    )
  }
}
