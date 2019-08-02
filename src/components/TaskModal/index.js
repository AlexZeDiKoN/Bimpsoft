import React from 'react'
import PropTypes from 'prop-types'
import FocusTrap from 'react-focus-lock'
import { TaskComponentStatefull } from '@DZVIN/components'
import i18n from '../../i18n'

import ModalContainer from '../common/ModalContainer'

export default class TaskModal extends React.Component {
  static propTypes = {
    contacts: PropTypes.any,
    contactsLocal: PropTypes.any,
    priorities: PropTypes.any,
    value: PropTypes.any,
    onClose: PropTypes.func,
    onSave: PropTypes.func,
    onSend: PropTypes.func,
    wrapper: PropTypes.oneOf([ ModalContainer ]),
  }

  render () {
    if (!this.props.value) {
      return null
    }

    const {
      wrapper: Wrapper,
      value,
      contacts,
      contactsLocal,
      priorities,
      onClose,
      onSave,
      onSend,
    } = this.props
    return (
      <Wrapper
        title={i18n.CREATE_TASK}
        onClose={onClose}
      >
        <FocusTrap>
          <TaskComponentStatefull
            value={value}
            contacts={contacts}
            contactsLocal={contactsLocal}
            priorities={priorities}
            onSave={onSave}
            onSend={onSend}
            onCancel={onClose}
          />
        </FocusTrap>
      </Wrapper>
    )
  }
}
