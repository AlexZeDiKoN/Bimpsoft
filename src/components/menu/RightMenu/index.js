import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import { ButtonTypes, ColorTypes, IButton, IconNames } from '@C4/CommonComponents'
import i18n from '../../../i18n'
import PrintFilesContainer from '../../../containers/PrintFiles'

import './style.css'
import { MOUSE_ENTER_DELAY } from '../../../constants/tooltip'

export default class RightMenu extends React.Component {
  static propTypes = {
    isSettingsShow: PropTypes.bool,
    is3DMapMode: PropTypes.bool,
    onClickSettings: PropTypes.func,
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
        <Tooltip title={i18n.SETTINGS} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='bottomRight'>
          <IButton
            icon={IconNames.MENU_SETTING}
            active={isSettingsShow}
            onClick={onClickSettings}
            type={ButtonTypes.WITH_BG}
            colorType={ColorTypes.MAP_HEADER_GREEN}
            disabled={is3DMapMode}
          />
        </Tooltip>
      </div>
    )
  }
}
