import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import './style.css'
import FocusTrap from 'focus-trap-react'
import { shortcuts } from '../../../constants'
import { HotKeysContainer, HotKey } from '../../common/HotKeys'
import i18n from '../../../i18n'

const {
  form: { default: Form, FormButtonCancel, FormButtonOk, FormItem, textItem, header, body },
  common: { notClickableArea },
} = components

export default class DeleteMapForm extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  }

  render () {
    const { name, onOk, onCancel } = this.props
    return (
      <div className="confirm-close-map">
        {notClickableArea()}
        <FocusTrap className="confirm-close-map-overflow">
          <HotKeysContainer>
            {header(i18n.CLOSE_MAP)}
            {body(
              <Form>
                {textItem(i18n.MAP_WITH_NAME(name))}
                <FormItem>
                  <FormButtonOk onClick={onOk} />
                  <HotKey selector={shortcuts.ESC} onKey={onCancel} />
                  <FormButtonCancel onClick={onCancel} />
                </FormItem>
              </Form>
            )}
          </HotKeysContainer>
        </FocusTrap>
      </div>
    )
  }
}
