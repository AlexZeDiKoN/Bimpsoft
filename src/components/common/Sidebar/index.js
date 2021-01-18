import React from 'react'
import PropTypes from 'prop-types'
import { InputButton } from '../index'
import './style.css'

export const SidebarWrap = ({ children, title, rightButtons, onChangeSearch }) => {
  return <div className="sidebar--content-wrap">
    <div className="sidebar--content-header">
      <InputButton
        onChange={onChangeSearch}
        title={title}
      />
      {rightButtons}
    </div>
    {children}
  </div>
}

SidebarWrap.displayName = 'SidebarWrap'
SidebarWrap.propTypes = {
  children: PropTypes.oneOfType([ PropTypes.node, PropTypes.array ]),
  rightButtons: PropTypes.oneOfType([ PropTypes.node, PropTypes.array ]),
  title: PropTypes.oneOfType([ PropTypes.node, PropTypes.string ]),
  onChangeSearch: PropTypes.func,
}
