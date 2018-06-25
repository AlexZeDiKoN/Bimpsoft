import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { Icon } from 'antd'
import VisibilityButton from '../../common/VisibilityButton'
import OpacityControl from '../../common/OpacityControl'

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
          icon="global"
          opacity={this.props.backOpacity}
          onChange={this.props.onChangeBackOpacity}
        />
        <OpacityControl
          className="layers-сontrols-control"
          icon="appstore"
          opacity={this.props.hiddenOpacity}
          onChange={this.props.onChangeHiddenOpacity}
        />
        <Icon
          className="layers-сontrols-control"
          type="close-circle-o"
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
