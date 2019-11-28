import React from 'react'
import PropTypes from 'prop-types'
import FocusTrap from 'react-focus-lock'
import { MovablePanel } from '@DZVIN/CommonComponents'
import { TaskComponentStatefull } from '@DZVIN/components'
import i18n from '../../i18n'
import './style.css'

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
    wrapper: PropTypes.oneOf([ MovablePanel ]),
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
      <div className="not-clickable-area">
        <Wrapper
          title={i18n.CREATE_TASK}
          onClose={onClose}
          minWidth={1000}
          minHeight={350}
        >
          <FocusTrap>
            <div tabIndex={0} className='taskModal'>
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
      </div>
    )
  }
}
