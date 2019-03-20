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
      ? iconNames.UNGROUPING_GRAPHIC_PRIMITIVES_ACTIVE
      : iconNames.UNGROUPING_GRAPHIC_PRIMITIVES_DEFAULT
    const calcIcon = visible
      ? iconNames.NONE_ICON_DEFAULT
      : iconNames.NONE_ICON_DISABLE
    const calcIconHover = visible
      ? iconNames.NONE_ICON_HOVER
      : iconNames.NONE_ICON_DISABLE

    return (
      <>
        <MenuDivider />
        <HotKey selector={shortcuts.DROP_FLEX_GRID} onKey={dropHandler} />
        <IconButton
          title={`${i18n.FLEX_GRID} (${i18n.FLEX_GRID_SHORTCUT})`}
          icon={dropIcon}
          hoverIcon={iconNames.UNGROUPING_GRAPHIC_PRIMITIVES_HOVER}
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
