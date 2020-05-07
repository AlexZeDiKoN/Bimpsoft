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
    unit: PropTypes.string,
    code: PropTypes.string,
    notClickable: PropTypes.bool,
    onApply: PropTypes.func,
    onCancel: PropTypes.func,
  }

  render () {
    const { code, unit, onApply, onCancel, notClickable = true } = this.props
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
                  <div className="confirm-text">{i18n.ERROR_MESSAGE_2} {unit}</div>
                  <br/>
                  <div className="confirm-text">{i18n.QUESTION_1}</div>
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
