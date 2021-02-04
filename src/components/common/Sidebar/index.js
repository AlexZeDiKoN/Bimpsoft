import React from 'react'
import PropTypes from 'prop-types'
import { InputButton } from '../index'
import './style.css'
import { shortcuts } from '../../../constants'
import { blockHotKey } from '../HotKeys'

export const SidebarWrap = ({ children, title, rightButtons, onChangeSearch }) => {
  return <div className="sidebar--content-wrap">
    <div
      className="sidebar--content-header"
      onKeyDown={blockHotKey([ shortcuts.DELETE ]) }
    >
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

export const CountBox = ({ count = 0, isHidden = false }) =>
  <div className="sidebar--count-box" hidden={isHidden}>{count}</div>
CountBox.displayName = 'CountBox'
CountBox.propTypes = {
  count: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  isHidden: PropTypes.bool,
}
