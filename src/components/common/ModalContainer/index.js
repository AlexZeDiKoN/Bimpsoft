import React from 'react'
import { components } from '@DZVIN/CommonComponents'
import './style.css'

const { common: { MovablePanel } } = components

const ModalContainer = (props) => (
  <div className="modal-container">
    <MovablePanel {...props} />
  </div>
)
export default ModalContainer
