import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import PrintFilesContainer from '../../../containers/PrintFiles'

import './style.css'

const { icons: { names: iconNames, IconButton } } = components

export default class RightMenu extends React.Component {
  static propTypes = {
    isSettingsShow: PropTypes.bool,
    isSidebarShow: PropTypes.bool,
    is3DMapMode: PropTypes.bool,
    onClickSettings: PropTypes.func,
    onClickSidebar: PropTypes.func,
    onClick3D: PropTypes.func,
    onSelectSearchOption: PropTypes.func,
    printFiles: PropTypes.object,
  }

  render () {
    const {
      isSettingsShow, onClickSettings, printFiles, is3DMapMode,
    } = this.props
    return (
      <div className='left-menu'>
        {Object.keys(printFiles).length !== 0 && (
          <PrintFilesContainer/>
        )}
        <IconButton
          placement={'bottomRight'}
          title={i18n.SETTINGS}
          icon={iconNames.SETTING_DEFAULT}
          checked={isSettingsShow}
          onClick={onClickSettings}
          disabled={is3DMapMode}
        />
      </div>
    )
  }
}
