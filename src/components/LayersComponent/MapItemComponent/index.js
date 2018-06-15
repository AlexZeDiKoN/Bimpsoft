import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { Icon } from 'antd'
import VisibilityButton from '../../common/VisibilityButton'

export default class MapItemComponent extends React.Component {
  render () {
    const { onChangeVisibility, onClose, data: { visible, name } } = this.props
    return (
      <div className="map-item-сomponent">
        <VisibilityButton className="map-item-сomponent-control" visible={visible} onChange={onChangeVisibility} />
        <span className="map-item-сomponent-title">{name}</span>
        <Icon className="map-item-сomponent-control" type="close-circle-o" onClick={onClose}/>
      </div>
    )
  }
}

MapItemComponent.propTypes = {
  data: PropTypes.object,
  onChangeVisibility: PropTypes.func,
  onClose: PropTypes.func,
}
