import React from 'react'
import PropTypes from 'prop-types'
import { IconNames } from '@C4/CommonComponents'
import i18n from '../../i18n'
import ContextMenu, { ContextMenuItem } from '../menu/ContextMenu'
import SelectionTypes from '../../constants/SelectionTypes'

export default class LinesList extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func,
    shapeType: PropTypes.number,
  }

  clickHandler = (shapeType) => {
    this.props.onSelect(shapeType)
  }

  getItemProps = (type) => ({
    value: type,
    checked: this.props.shapeType === type,
    onClick: this.clickHandler,
  })

  render () {
    return (
      <ContextMenu>
        <ContextMenuItem
          text={i18n.SHAPE_POLYLINE}
          icon={IconNames.MAP_HEADER_ICON_BROKEN_LINE}
          {...this.getItemProps(SelectionTypes.POLYLINE)}
        />
        <ContextMenuItem
          text={i18n.SHAPE_CURVE}
          icon={IconNames.MAP_HEADER_ICON_CURVE}
          {...this.getItemProps(SelectionTypes.CURVE)}
        />
        <ContextMenuItem
          text={i18n.SHAPE_POLYGON}
          icon={IconNames.MAP_HEADER_ICON_POLYGON}
          {...this.getItemProps(SelectionTypes.POLYGON)}
        />
        <ContextMenuItem
          text={i18n.SHAPE_AREA}
          icon={IconNames.MAP_HEADER_ICON_RANGE}
          {...this.getItemProps(SelectionTypes.AREA)}
        />
        <ContextMenuItem
          text={i18n.SHAPE_RECTANGLE}
          icon={IconNames.MAP_HEADER_ICON_SQUARE}
          {...this.getItemProps(SelectionTypes.RECTANGLE)}
        />
        <ContextMenuItem
          text={i18n.SHAPE_SQUARE}
          icon={IconNames.MAP_HEADER_ICON_SQUARE}
          {...this.getItemProps(SelectionTypes.SQUARE)}
        />
        <ContextMenuItem
          text={i18n.SHAPE_CIRCLE}
          icon={IconNames.MAP_HEADER_ICON_OVAL}
          {...this.getItemProps(SelectionTypes.CIRCLE)}
        />
      </ContextMenu>
    )
  }
}
