import React from 'react'
import { Button, ModalContainer, MovablePanel, TextItem } from '@C4/CommonComponents'
import PropTypes from 'prop-types'
import { body } from '@C4/CommonComponents/build/components/form'
import i18n from '../../../../i18n'

export const WarningForm = (props) => {
  const {
    message,
    question,
    children,
    onYes,
    onNo,
    onCancel,
    onProceed,
    ...otherProps
  } = props
  return (
    <ModalContainer>
      <MovablePanel
        {...otherProps}
      >
        <div style={{ textAlign: 'center' }}>
          <TextItem>
            {message}
          </TextItem>
          <TextItem>
            {question}
          </TextItem>
          {children ? body(children) : ''}
          {onYes ? <Button onClick={ onYes } text={i18n.YES}/> : ''}
          {onNo ? <Button onClick={ onNo } text={i18n.NO}/> : ''}
          {onCancel ? <Button onClick={ onCancel } text={i18n.CANCEL_BTN_TITLE}/> : ''}
          {onProceed ? <Button onClick={ onProceed } text={i18n.PROCEED_BTN_TITLE}/> : ''}
        </div>
      </MovablePanel>
    </ModalContainer>
  )
}

WarningForm.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  question: PropTypes.string,
  className: PropTypes.string,
  minWidth: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  minHeight: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  maxHeight: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  maxWidth: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  children: PropTypes.object,
  disableDragging: PropTypes.bool,
  onYes: PropTypes.func,
  onNo: PropTypes.func,
  onCancel: PropTypes.func,
  onClose: PropTypes.func,
  onProceed: PropTypes.func,
  resizeEnable: PropTypes.object,
  defaultPosition: PropTypes.object,
  bounds: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string ]),
}

export default WarningForm
