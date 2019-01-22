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
  }

  render () {
    const {
      isEditMode,
      visible,
      showFlexGridOptions,
      hideFlexGrid,
    } = this.props

    if (!isEditMode) {
      return null
    }

    const handler = visible ? hideFlexGrid : showFlexGridOptions
    const icon = visible
      ? iconNames.UNGROUPING_GRAPHIC_PRIMITIVES_ACTIVE
      : iconNames.UNGROUPING_GRAPHIC_PRIMITIVES_DEFAULT

    return (
      <>
        <MenuDivider />
        <HotKey selector={shortcuts.DROP_FLEX_GRID} onKey={handler} />
        <IconButton
          title={`${i18n.FLEX_GRID} (${i18n.FLEX_GRID_SHORTCUT})`}
          icon={icon}
          hoverIcon={iconNames.UNGROUPING_GRAPHIC_PRIMITIVES_HOVER}
          onClick={handler}
        />
      </>
    )
  }
}
