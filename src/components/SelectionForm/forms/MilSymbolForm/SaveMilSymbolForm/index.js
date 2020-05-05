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
    onApply: PropTypes.func,
    onCancel: PropTypes.func,
  }

  render () {
    const { code, unit, onApply, onCancel } = this.props
    return (
      <>
        <div className="not-clickable-area"> </div>
        <FocusTrap className="confirm-save-overflow">
          <HotKeysContainer>
            <Form className="confirm-save">
              <FormItem>
                <div className="confirm-icon-warning">!</div>
                <div className="confirm-modal-window">
                  <div className="confirm-title">{i18n.ERROR_CODE_SIGNS}</div>
                  <div className="confirm-text">{i18n.OBJECT} : {unit} ({code}) {i18n.OBJECT_EXIST}</div>
                  <div className="confirm-text">{i18n.CONTINUE_STORAGE}</div>
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
