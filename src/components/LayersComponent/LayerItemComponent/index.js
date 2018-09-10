import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { Icon } from 'antd'
import moment from 'moment'
import { VisibilityButton } from '../../common'
import { DATE_TIME_FORMAT } from '../../../constants/formats'
import ColorPicker from '../../common/ColorPicker'

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
      data: { visible, name, locked, color, shared, dateFor = null },
    } = this.props
    const lockedIcon = locked ? 'lock' : 'unlock'
    const sharedIcon = shared ? 'team' : 'user-delete'
    const dateString = dateFor !== null ? moment(dateFor).format(DATE_TIME_FORMAT) : ''
    return (
      <div
        className={'layer-item-сomponent ' + (isSelected ? 'layer-item-сomponent-selected' : '')}
        onClick={this.selectHandler}
      >
        <VisibilityButton
          visible={visible}
          className="layer-item-сomponent-control"
          onChange={this.changeVisibilityHandler}
        />
        <Icon className="map-item-сomponent-control" type={lockedIcon} />
        <div className="layer-item-сomponent-title">
          <div className="layer-name">{name}</div>
          <div className="layer-date">{dateString}</div>
        </div>
        <ColorPicker className="map-item-сomponent-control" color={color} onChange={this.changeColorHandler}/>
        <Icon className="map-item-сomponent-control" type={sharedIcon} />
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
