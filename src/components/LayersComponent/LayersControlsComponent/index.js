import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { components } from '@DZVIN/CommonComponents'
import { VisibilityButton, OpacityControl } from '../../common'

const { icons: { IconHovered, names: iconNames } } = components

export default class LayersControlsComponent extends React.Component {
  render () {
    return (
      <div className="layers-сontrols-сomponent">
        <VisibilityButton
          className="layers-сontrols-control"
          visible={this.props.visible}
          onChange={this.props.onChangeVisibility}
        />
        <OpacityControl
          className="layers-сontrols-control"
          icon={iconNames.MAP_RIGHT_BAR_LAST_LAYER_DEFAULT}
          opacity={this.props.backOpacity}
          onChange={this.props.onChangeBackOpacity}
        />
        <OpacityControl
          className="layers-сontrols-control"
          icon={iconNames.MAP_RIGHT_BAR_FIRST_LAYER_DEFAULT}
          opacity={this.props.hiddenOpacity}
          onChange={this.props.onChangeHiddenOpacity}
        />
        <IconHovered
          className="layers-сontrols-control"
          icon={iconNames.CLOSE_ROUND_ACTIVE}
          hoverIcon={iconNames.CLOSE_ROUND_HOVER}
          onClick={this.props.onCloseAllMaps}
        />
      </div>
    )
  }
}

const dateType = PropTypes.oneOfType([ PropTypes.string, PropTypes.instanceOf(Date) ])

LayersControlsComponent.propTypes = {
  from: dateType,
  to: dateType,
  visible: PropTypes.bool,
  onChangeVisibility: PropTypes.func,
  backOpacity: PropTypes.number,
  onChangeBackOpacity: PropTypes.func,
  hiddenOpacity: PropTypes.number,
  onChangeHiddenOpacity: PropTypes.func,
  onCloseAllMaps: PropTypes.func,
}
