import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import moment from 'moment'
import { components } from '@DZVIN/CommonComponents'
import { VisibilityButton } from '../../common'
import { DATE_TIME_FORMAT } from '../../../constants/formats'
import ColorPicker from '../../common/ColorPicker'

const { icons: { IconHovered, names: iconNames } } = components

const getLockIcon = (isDark, locked) =>
  isDark
    ? (locked ? iconNames.DARK_LOCK_ACTIVE : iconNames.DARK_UNLOCK_ACTIVE)
    : (locked ? iconNames.LOCK_ACTIVE : iconNames.UNLOCK_ACTIVE)

const getLockIconHover = (isDark, locked) =>
  isDark
    ? (locked ? iconNames.DARK_LOCK_HOVER : iconNames.DARK_UNLOCK_HOVER)
    : (locked ? iconNames.LOCK_HOVER : iconNames.UNLOCK_HOVER)

export default class LayerItemComponent extends React.Component {
  selectHandler = () => {
    const { onSelect, data: { layerId } } = this.props
    onSelect && onSelect(layerId)
  }

  changeVisibilityHandler = (isVisible) => {
    const { onChangeVisibility, data: { layerId } } = this.props
    onChangeVisibility && onChangeVisibility(layerId, isVisible)
  }

  changeColorHandler = (color) => {
    const { onChangeColor, data: { layerId } } = this.props
    onChangeColor && onChangeColor(layerId, color)
  }

  render () {
    const {
      isSelected,
      data: { visible, name, locked, color, dateFor = null },
    } = this.props
    const dateString = dateFor !== null ? moment(dateFor).format(DATE_TIME_FORMAT) : ''
    return (
      <div
        className={'layer-item-сomponent ' + (isSelected ? 'layer-item-сomponent-selected' : '')}
        onClick={this.selectHandler}
      >
        <VisibilityButton
          visible={visible}
          isDark={isSelected}
          className="layer-item-сomponent-control"
          onChange={this.changeVisibilityHandler}
        />
        <IconHovered
          className="layer-item-сomponent-control"
          icon={getLockIcon(isSelected, locked)}
          hoverIcon={getLockIconHover(isSelected, locked)}
        />
        <div className="layer-item-сomponent-title">
          <div className="layer-name">{name}</div>
          <div className="layer-date">{dateString}</div>
        </div>
        <ColorPicker className="map-item-сomponent-control" color={color} onChange={this.changeColorHandler}/>
        <IconHovered
          className="layer-item-сomponent-control"
        />
      </div>
    )
  }
}

LayerItemComponent.propTypes = {
  isSelected: PropTypes.bool,
  data: PropTypes.object,
  onSelect: PropTypes.func,
  onChangeVisibility: PropTypes.func,
  onChangeColor: PropTypes.func,
}
