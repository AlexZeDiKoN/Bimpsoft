import React from 'react'
import PropTypes from 'prop-types'
import FocusTrap from 'react-focus-lock'
import { TaskComponentStatefull } from '@DZVIN/components'
import i18n from '../../i18n'

import ModalContainer from '../common/ModalContainer'

const STYLE = { width: '1000px' }

export default class TaskModal extends React.Component {
  static propTypes = {
    tasks: PropTypes.array,
    executorUnitID: PropTypes.number,
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
      tasks,
      executorUnitID,
      onClose,
      onSave,
      onSend,
    } = this.props
    return (
      <Wrapper
        title={i18n.CREATE_TASK}
        onClose={onClose}
        className="not-clickable-area"
      >
        <FocusTrap>
          <div tabIndex={0} style={STYLE}>
            <TaskComponentStatefull
              value={value}
              tasks={tasks}
              executorUnitID={executorUnitID}
              contacts={contacts}
              contactsLocal={contactsLocal}
              priorities={priorities}
              onSave={onSave}
              onSend={onSend}
              onCancel={onClose}
            />
          </div>
        </FocusTrap>
      </Wrapper>
    )
  }
}
