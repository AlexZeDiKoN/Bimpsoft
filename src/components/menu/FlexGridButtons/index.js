import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import MenuDivider from '../MenuDivider'
import { shortcuts } from '../../../constants'
import { HotKey } from '../../common/HotKeys'

const { names: iconNames, IconButton } = components.icons

export default class FlexGridButtons extends React.Component {
  static propTypes = {
    isEditMode: PropTypes.bool,
    visible: PropTypes.bool,
    showFlexGridOptions: PropTypes.func,
    hideFlexGrid: PropTypes.func,
    calcFlexGridUnits: PropTypes.func,
    showDivideDirForm: PropTypes.func,
  }

  render () {
    const {
      isEditMode,
      visible,
      showFlexGridOptions,
      hideFlexGrid,
      calcFlexGridUnits,
      showDivideDirForm,
    } = this.props

    if (!isEditMode) {
      return null
    }

    const dropHandler = visible ? hideFlexGrid : showFlexGridOptions

    // @TODO: кнопка!
    return (
      <>
        <MenuDivider />
        <HotKey selector={shortcuts.DROP_FLEX_GRID} onKey={dropHandler} />
        <IconButton
          title={`${i18n.FLEX_GRID} (${i18n.FLEX_GRID_SHORTCUT})`}
          icon={iconNames.MENU_OPERATING_AREA_DEFAULT}
          checked={visible}
          onClick={dropHandler}
        />
        <IconButton
          title={i18n.SEND_TO_ICT}
          icon={iconNames.MENU_CALCULATION_DEFAULT}
          disabled={!visible}
          onClick={calcFlexGridUnits}
        />
        <IconButton
          title={'SEPARATE DIRECTION'}
          icon={iconNames.FOREGROUND_DEFAULT}
          disabled={!visible}
          onClick={showDivideDirForm}
        />
      </>
    )
  }
}
