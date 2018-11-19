import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { components } from '@DZVIN/CommonComponents'
import { VisibilityButton } from '../../common'
import ColorPicker from '../../common/ColorPicker'
import i18n from '../../../i18n'

const { icons: { IconHovered, names: iconNames } } = components

export default class MapItemComponent extends React.Component {
  changeMapVisibilityHandler = () => {
    const { onChangeVisibility, data: { mapId, visible } } = this.props
    onChangeVisibility && onChangeVisibility(mapId, !visible)
  }

  changeColorHandler = (color) => {
    const { onChangeColor, data: { mapId } } = this.props
    onChangeColor && onChangeColor(mapId, color)
  }

  closeHandler = () => {
    const { onClose, data: { mapId } } = this.props
    onClose && onClose(mapId)
  }

  render () {
    const { data: { visible, name, color, pathTo } } = this.props
    const breadCrumbs = pathTo ? pathTo.map((item) => item.name).join(' / ') : ''
    return (
      <div className="map-item-сomponent">
        <VisibilityButton
          title={i18n.LAYERS_VISIBILITY}
          className="map-item-сomponent-control"
          visible={visible}
          isDark={true}
          onChange={this.changeMapVisibilityHandler}
        />
        <span className="map-item-сomponent-title" title={breadCrumbs}>{name}</span>
        <ColorPicker
          title={i18n.LAYERS_HIGHLIGHT_COLOR}
          className="map-item-сomponent-control"
          color={color}
          onChange={this.changeColorHandler}
        />
        <IconHovered
          title={i18n.LAYERS_CLOSE_CURRENT_MAP}
          className="map-item-сomponent-control"
          icon={iconNames.DARK_CLOSE_ROUND_ACTIVE}
          hoverIcon={iconNames.DARK_CLOSE_ROUND_HOVER}
          onClick={this.closeHandler}
        />
      </div>
    )
  }
}

MapItemComponent.propTypes = {
  data: PropTypes.object,
  onChangeVisibility: PropTypes.func,
  onChangeColor: PropTypes.func,
  onClose: PropTypes.func,
}
