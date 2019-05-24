import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { components } from '@DZVIN/CommonComponents'
import { VisibilityButton, OpacityControl } from '../../common'
import i18n from '../../../i18n'
import DeleteMapsForm from './DeleteMapsForm'
const { names: iconNames, IconButton } = components.icons

export default class LayersControlsComponent extends React.Component {
  state = { showCloseForm: false }

  closeHandler = () => this.setState({ showCloseForm: true })

  cancelCloseHandler = () => this.setState({ showCloseForm: false })

  okCloseHandler = () => this.setState({ showCloseForm: false }, this.props.onCloseAllMaps)

  render () {
    return (
      <div className="layers-controls-component">
        {this.state.showCloseForm && (<DeleteMapsForm onCancel={this.cancelCloseHandler} onOk={this.okCloseHandler} />)}
        <VisibilityButton
          title={i18n.MAPS_VISIBILITY}
          className="layers-controls-control"
          visible={this.props.visible}
          onChange={this.props.onChangeVisibility}
        />
        <OpacityControl
          title={i18n.LAYERS_BASEMAP_OPACITY}
          className="layers-controls-control"
          icon={iconNames.MAP_RIGHT_BAR_LAST_LAYER_DEFAULT}
          opacity={this.props.backOpacity}
          onChange={this.props.onChangeBackOpacity}
        />
        <OpacityControl
          title={i18n.LAYERS_INACTIVE_OPACITY}
          className="layers-controls-control"
          icon={iconNames.MAP_RIGHT_BAR_FIRST_LAYER_DEFAULT}
          opacity={this.props.hiddenOpacity}
          onChange={this.props.onChangeHiddenOpacity}
        />
        <IconButton
          placement={'topRight'}
          title={i18n.LAYERS_CLOSE_ALL_MAPS}
          className="layers-controls-control"
          icon={iconNames.CLOSE_ROUND_ACTIVE}
          onClick={this.closeHandler}
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
