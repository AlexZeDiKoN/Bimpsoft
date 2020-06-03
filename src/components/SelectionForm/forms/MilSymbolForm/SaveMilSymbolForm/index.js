import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import './style.css'
import FocusTrap from 'react-focus-lock'
import { shortcuts } from '../../../../../constants'
import { HotKeysContainer, HotKey } from '../../../../common/HotKeys'
import i18n from '../../../../../i18n'

const { default: Form, buttonNo, buttonYes, FormItem } = components.form

export default class SaveMilSymbolForm extends React.Component {
  static propTypes = {
    unitText: PropTypes.string,
    unit: PropTypes.number,
    code: PropTypes.string,
    notClickable: PropTypes.bool,
    onApply: PropTypes.func,
    onCancel: PropTypes.func,
  }

  render () {
    const { code, unit, unitText, onApply, onCancel, notClickable = true } = this.props
    const errorSelectUnit = unit == null // підрозділ не обрано
    const errorSelectCode = code.length < 20 // помилка в коді знаку
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
                  <div className="confirm-text">{i18n.ERROR_MESSAGE_1} {code}</div>
                  {errorSelectUnit ? <div className="confirm-text">{i18n.ERROR_MESSAGE_3}</div> : <></>}
                  {errorSelectCode ? <div className="confirm-text">{i18n.ERROR_MESSAGE_4}</div> : <></>}
                  {!errorSelectUnit && !errorSelectCode
                    ? <div className="confirm-text">{i18n.ERROR_MESSAGE_2} {unitText}</div>
                    : <></>
                  }
                  <br/>
                  <div className="confirm-text">
                    {!errorSelectUnit && !errorSelectCode ? i18n.QUESTION_1 : i18n.QUESTION_2}
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
