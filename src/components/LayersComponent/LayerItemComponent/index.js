import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { Icon } from 'antd'
import moment from 'moment'
import { VisibilityButton, ColorPicker } from '../../common'
import { DATE_TIME_FORMAT } from '../../../constants/formats'

export default class LayerItemComponent extends React.Component {
  render () {
    const {
      onChangeVisibility,
      isSelected,
      data: { visible, name, locked, color, shared, date },
    } = this.props
    const lockedIcon = locked ? 'lock' : 'unlock'
    const sharedIcon = shared ? 'team' : 'user-delete'
    const dateString = moment(date).format(DATE_TIME_FORMAT)
    return (
      <div
        className={'layer-item-сomponent ' + (isSelected ? 'layer-item-сomponent-selected' : '')}
        onClick={this.props.onSelect}
      >
        <VisibilityButton
          visible={visible}
          className="layer-item-сomponent-control"
          onChange={onChangeVisibility}
        />
        <Icon className="map-item-сomponent-control" type={lockedIcon} />
        <div className="layer-item-сomponent-title">
          <div className="layer-name">{name}</div>
          <div className="layer-date">{dateString}</div>
        </div>
        <ColorPicker className="map-item-сomponent-control" color={color} onChange={this.props.onChangeColor}/>
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
