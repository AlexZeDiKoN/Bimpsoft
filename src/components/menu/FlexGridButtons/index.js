import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import IconButton from '../IconButton'
import i18n from '../../../i18n'
import MenuDivider from '../MenuDivider'
import { shortcuts } from '../../../constants'
import { HotKey } from '../../common/HotKeys'

const iconNames = components.icons.names

export default class SelectionButtons extends React.Component {
  static propTypes = {
    isEditMode: PropTypes.bool,
    visible: PropTypes.bool,
    showFlexGridOptions: PropTypes.func,
    hideFlexGrid: PropTypes.func,
    calcFlexGridUnits: PropTypes.func,
  }

  render () {
    const {
      isEditMode,
      visible,
      showFlexGridOptions,
      hideFlexGrid,
      calcFlexGridUnits,
    } = this.props

    if (!isEditMode) {
      return null
    }

    const dropHandler = visible ? hideFlexGrid : showFlexGridOptions
    const calcHandler = visible ? calcFlexGridUnits : null
    const dropIcon = visible
      ? iconNames.MENU_OPERATING_AREA_ACTIVE
      : iconNames.MENU_OPERATING_AREA_DEFAULT
    const calcIcon = visible
      ? iconNames.MENU_CALCULATION_DEFAULT
      : iconNames.MENU_CALCULATION_DISABLE
    const calcIconHover = visible
      ? iconNames.MENU_CALCULATION_HOVER
      : iconNames.MENU_CALCULATION_DISABLE

    return (
      <>
        <MenuDivider />
        <HotKey selector={shortcuts.DROP_FLEX_GRID} onKey={dropHandler} />
        <IconButton
          title={`${i18n.FLEX_GRID} (${i18n.FLEX_GRID_SHORTCUT})`}
          icon={dropIcon}
          hoverIcon={iconNames.MENU_OPERATING_AREA_HOVER}
          onClick={dropHandler}
        />
        <IconButton
          title={i18n.SEND_TO_ICT}
          icon={calcIcon}
          hoverIcon={calcIconHover}
          onClick={calcHandler}
        />
      </>
    )
  }
}
