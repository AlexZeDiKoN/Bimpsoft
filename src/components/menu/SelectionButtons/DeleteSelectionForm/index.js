import React from 'react'
import PropTypes from 'prop-types'
import { components, ModalContainer, MovablePanel } from '@C4/CommonComponents'
import './style.css'
import FocusTrap from 'react-focus-lock'
import ReactDOM from 'react-dom'
import { Tooltip } from 'antd'
import { shortcuts } from '../../../../constants'
import { HotKeysContainer, HotKey } from '../../../common/HotKeys'
import i18n from '../../../../i18n'
import { MOUSE_ENTER_DELAY } from '../../../../constants/tooltip'

const { default: Form, buttonNo, buttonYes, FormItem } = components.form

export default class DeleteSelectionForm extends React.Component {
  static propTypes = {
    layerName: PropTypes.string,
    list: PropTypes.array,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  render () {
    const { list, layerName, onOk, onCancel } = this.props
    return (
      ReactDOM.createPortal(
        <ModalContainer>
          <MovablePanel title={i18n.REMOVING_SIGNS} maxWidth={500} bounds='div.app-body'>
            <FocusTrap className="confirm-delete-overflow">
              <HotKeysContainer>
                <Form className="confirm-delete">
                  <FormItem>
                    <div className="confirm-icon-warning">!</div>
                    <div className="confirm-modal-window">
                      <div className="confirm-text">{i18n.LAYER}:
                        <Tooltip title={layerName} mouseEnterDelay={MOUSE_ENTER_DELAY}>{layerName}</Tooltip>
                      </div>
                      <div className="confirm-text">{i18n.NUM_SELECTED_SIGNS(list.length)}</div>
                    </div>
                  </FormItem>
                  <FormItem>
                    <HotKey selector={shortcuts.ENTER} onKey={onOk} />
                    {buttonYes(onOk)}
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
