import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../i18n'
import ContextMenu, { ContextMenuItem } from '../menu/ContextMenu'
import SelectionTypes from '../../constants/SelectionTypes'

const { names: icons } = components.icons

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
          icon={icons.BROKEN_LINE_ACTIVE}
          hoverIcon={icons.BROKEN_LINE_HOVER}
          {...this.getItemProps(SelectionTypes.POLYLINE)}
        />
        <ContextMenuItem
          text={i18n.SHAPE_CURVE}
          icon={icons.CURVE_ACTIVE}
          hoverIcon={icons.CURVE_HOVER}
          {...this.getItemProps(SelectionTypes.CURVE)}
        />
        <ContextMenuItem
          text={i18n.SHAPE_POLYGON}
          icon={icons.POLYGON_ACTIVE}
          hoverIcon={icons.POLYGON_HOVER}
          {...this.getItemProps(SelectionTypes.POLYGON)}
        />
        <ContextMenuItem
          text={i18n.SHAPE_AREA}
          icon={icons.RANGE_ACTIVE}
          hoverIcon={icons.RANGE_HOVER}
          {...this.getItemProps(SelectionTypes.AREA)}
        />
        <ContextMenuItem
          text={i18n.SHAPE_RECTANGLE}
          icon={icons.SQUARE_ACTIVE}
          hoverIcon={icons.SQUARE_HOVER}
          {...this.getItemProps(SelectionTypes.RECTANGLE)}
        />
        <ContextMenuItem
          text={i18n.SHAPE_SQUARE}
          icon={icons.SQUARE_ACTIVE}
          hoverIcon={icons.SQUARE_HOVER}
          {...this.getItemProps(SelectionTypes.SQUARE)}
        />
        <ContextMenuItem
          text={i18n.SHAPE_CIRCLE}
          icon={icons.OVAL_ACTIVE}
          hoverIcon={icons.OVAL_HOVER}
          {...this.getItemProps(SelectionTypes.CIRCLE)}
        />
      </ContextMenu>
    )
  }
}
