import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import IconButton from '../IconButton'
import './style.css'
import i18n from '../../../i18n'

const iconNames = components.icons.names

export default class RightMenu extends React.Component {
  static propTypes = {
    isSettingsShow: PropTypes.bool,
    isSidebarShow: PropTypes.bool,
    onClickSettings: PropTypes.func,
    onClickSidebar: PropTypes.func,
  }

  render () {
    const { isSettingsShow, isSidebarShow, onClickSettings, onClickSidebar } = this.props
    return (
      <div className='left-menu'>
        <Input.Search placeholder={ i18n.SEARCH } style={{ width: 200 }}/>
        <IconButton
          text={i18n.TOGGLE_SIDEBAR}
          icon={isSidebarShow ? iconNames.LEFT_MENU_ACTIVE : iconNames.LEFT_MENU_DEFAULT}
          hoverIcon={iconNames.LEFT_MENU_HOVER}
          onClick={onClickSidebar}
        />
        <IconButton
          text={i18n.SETTINGS}
          icon={isSettingsShow ? iconNames.SETTING_ACTIVE : iconNames.SETTING_DEFAULT}
          hoverIcon={iconNames.SETTING_HOVER}
          onClick={onClickSettings}
        />
      </div>
    )
  }
}
