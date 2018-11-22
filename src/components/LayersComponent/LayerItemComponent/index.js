import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import moment from 'moment'
import { components } from '@DZVIN/CommonComponents'
import { VisibilityButton } from '../../common'
import { DATE_TIME_FORMAT } from '../../../constants/formats'
import ColorPicker from '../../common/ColorPicker'
import i18n from '../../../i18n'

const { icons: { Icon, IconHovered, names: iconNames }, common: { TreeComponent } } = components

const getLockIcon = (isDark, locked) =>
  isDark
    ? (locked ? iconNames.DARK_LOCK_ACTIVE : iconNames.DARK_UNLOCK_ACTIVE)
    : (locked ? iconNames.LOCK_ACTIVE : iconNames.UNLOCK_ACTIVE)

export default class LayerItemComponent extends React.Component {
  selectHandler = () => {
    const { onSelectLayer, data: { layerId } } = this.props
    onSelectLayer && onSelectLayer(layerId)
  }

  changeVisibilityHandler = (isVisible) => {
    const { onChangeLayerVisibility, data: { layerId } } = this.props
    onChangeLayerVisibility && onChangeLayerVisibility(layerId, isVisible)
  }

  changeColorHandler = (color) => {
    const { onChangeLayerColor, data: { layerId } } = this.props
    onChangeLayerColor && onChangeLayerColor(layerId, color)
  }

  render () {
    const {
      selectedLayerId,
      data: { visible, name, readOnly, color, dateFor = null, breadCrumbs, layerId },
    } = this.props
    const dateString = dateFor !== null ? moment(dateFor).format(DATE_TIME_FORMAT) : ''
    const isSelected = selectedLayerId === layerId
    return (
      <div
        className={'layer-item-сomponent ' + (isSelected ? 'layer-item-сomponent-selected' : '')}
        onClick={this.selectHandler}
      >
        <VisibilityButton
          title={i18n.LAYERS_VISIBILITY}
          visible={visible}
          isDark={isSelected}
          className="layer-item-сomponent-control"
          onChange={this.changeVisibilityHandler}
        />
        <Icon
          className="layer-item-сomponent-control"
          icon={getLockIcon(isSelected, readOnly)}
        />
        <div className="layer-item-сomponent-title">
          <div className="layer-name" title={breadCrumbs}>{name}</div>
          <div className="layer-date">{dateString}</div>
        </div>
        <ColorPicker
          title={i18n.LAYERS_HIGHLIGHT_COLOR}
          className="map-item-сomponent-control"
          color={color}
          onChange={this.changeColorHandler}
        />
        <IconHovered
          className="layer-item-сomponent-control"
        />
      </div>
    )
  }
}

LayerItemComponent.propTypes = {
  ...TreeComponent.itemPropTypes,
  selectedLayerId: PropTypes.number,
  data: PropTypes.object,
  onSelectLayer: PropTypes.func,
  onChangeLayerVisibility: PropTypes.func,
  onChangeLayerColor: PropTypes.func,
}
