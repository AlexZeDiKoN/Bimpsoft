import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@C4/CommonComponents'
import './style.css'
import FocusTrap from 'react-focus-lock'
import { shortcuts } from '../../../constants'
import { HotKeysContainer, HotKey } from '../../common/HotKeys'
import i18n from '../../../i18n'

const {
  form: { default: Form, buttonNo, buttonYes, FormItem, textItem, header, body },
  common: { notClickableArea },
} = components

export default class DeleteMapsForm extends React.Component {
  static propTypes = {
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  render () {
    const { onOk, onCancel } = this.props
    return (
      <div className="confirm-close-maps">
        {notClickableArea('')}
        <FocusTrap className="confirm-close-maps-overflow">
          <HotKeysContainer>
            {header(i18n.CLOSE_MAPS)}
            {body(
              <Form>
                {textItem(i18n.CLOSE_MAPS_CONFIRM)}
                <FormItem>
                  {buttonYes(onOk)}
                  <HotKey selector={shortcuts.ESC} onKey={onCancel} />
                  {buttonNo(onCancel)}
                </FormItem>
              </Form>,
            )}
          </HotKeysContainer>
        </FocusTrap>
      </div>
    )
  }
}
