import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import './style.css'
import FocusTrap from 'react-focus-lock'
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
  }

  render () {
    const { code, unitText, onApply, onCancel, notClickable = true, errorCode = errorSymbol.code } = this.props
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
                    {(errorCode & errorSymbol.duplication) ? i18n.ERROR_MESSAGE_1 : i18n.ERROR_MESSAGE_3} {code}
                  </div>
                  <div className="confirm-text">{i18n.ERROR_MESSAGE_2} {unitText}</div>
                  {(errorCode & errorSymbol.code) ? <div className="confirm-text">{i18n.ERROR_MESSAGE_4}</div> : <></>}
                  <br/>
                  <div className="confirm-text">
                    {(errorCode & errorSymbol.duplication) ? i18n.QUESTION_1 : i18n.QUESTION_2}
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
