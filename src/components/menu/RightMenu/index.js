import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import { ButtonTypes, ColorTypes, IButton, IconNames } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import PrintFilesContainer from '../../../containers/PrintFiles'

import './style.css'

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
        <Tooltip title={i18n.SETTINGS} placement='bottomRight'>
          <IButton
            icon={IconNames.MENU_SETTING}
            active={isSettingsShow}
            onClick={onClickSettings}
            type={ButtonTypes.WITH_BG}
            colorType={ColorTypes.BLACK_DARK_GREEN}
            disabled={is3DMapMode}
          />
        </Tooltip>
      </div>
    )
  }
}
