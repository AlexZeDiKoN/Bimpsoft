import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { Icon } from 'antd'
import { VisibilityButton } from '../../common'
import ColorPicker from '../../common/ColorPicker'

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
    const { data: { visible, name, color } } = this.props
    return (
      <div className="map-item-сomponent">
        <VisibilityButton
          className="map-item-сomponent-control"
          visible={visible}
          onChange={this.changeMapVisibilityHandler}
        />
        <span className="map-item-сomponent-title">{name}</span>
        <ColorPicker className="map-item-сomponent-control" color={color} onChange={this.changeColorHandler}/>
        <Icon className="map-item-сomponent-control" type="close-circle-o" onClick={this.closeHandler}/>
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
