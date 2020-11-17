import React from 'react'
import PropTypes from 'prop-types'
import { MovablePanel, components } from '@C4/CommonComponents'

import i18n from '../../i18n'
import './style.css'

// TODO перевести на глобальну константу коли буде змержено гілку DZVIN-6560
const SIDEBAR_SIZE_DEFAULT = 320
const POPUP_WINDOW_WIDTH = 300

const { form: { ButtonDelete, ButtonClose } } = components

export default class DeleteMarchModal extends React.Component {
  static propTypes = {
    wrapper: PropTypes.oneOf([ MovablePanel ]),
    onClose: PropTypes.func,
    deleteChild: PropTypes.func,
    deleteSegment: PropTypes.func,
    visible: PropTypes.bool,
    segmentId: PropTypes.number,
    childId: PropTypes.number,
  }

  onDeleteItem = () => {
    const { segmentId, childId, deleteChild, onClose, deleteSegment } = this.props

    if (childId === undefined) {
      deleteSegment(segmentId)
    } else {
      deleteChild(segmentId, childId)
    }

    onClose()
  }

  render () {
    if (!this.props.visible) {
      return null
    }

    const { wrapper: Wrapper, onClose, childId } = this.props

    let title
    let msg
    if (childId === undefined) {
      title = i18n.DELETE_SEGMENT_CONFIRM_TITLE
      msg = i18n.DELETE_SEGMENT_CONFIRM_TEXT
    } else {
      title = i18n.DELETE_POINT_CONFIRM_TITLE
      msg = i18n.DELETE_POINT_CONFIRM_TEXT
    }

    return (
      <div className='delete-modal-container'>
        <Wrapper
          title={title}
          onClose={onClose}
          defaultPosition={{
            x: window.screen.width - SIDEBAR_SIZE_DEFAULT - POPUP_WINDOW_WIDTH * 1.1,
            y: window.screen.height * 0.11,
          }}
        >
          <div className='content' style={{ width: `${POPUP_WINDOW_WIDTH}px` }}>
            <div className='delete-msg'>
              <div>{msg}</div>
            </div>
            <div className='buttons'>
              <ButtonDelete className='button' onClick={this.onDeleteItem} />
              <ButtonClose className='button' onClick={onClose} />
            </div>
          </div>
        </Wrapper>
      </div>
    )
  }
}
