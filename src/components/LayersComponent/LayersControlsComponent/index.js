import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { IconNames } from '@C4/CommonComponents'
import { OpacityControl } from '../../common'
import i18n from '../../../i18n'
import DeleteMapsForm from './DeleteMapsForm'

export default class LayersControlsComponent extends React.Component {
  render () {
    const { showCloseForm, okCloseHandler, cancelCloseHandler, backOpacity = 100, hiddenOpacity = 100 } = this.props
    return (
      <div className="layers-controls-component">
        {showCloseForm && (<DeleteMapsForm onCancel={cancelCloseHandler} onOk={okCloseHandler} />)}
        <OpacityControl
          title={i18n.LAYERS_BASEMAP_OPACITY}
          className="layers-controls-control"
          icon={IconNames.OPEN_MAP}
          opacity={backOpacity}
          onChange={this.props.onChangeBackOpacity}
        />
        <OpacityControl
          title={i18n.LAYERS_INACTIVE_OPACITY}
          className="layers-controls-control"
          icon={IconNames.TRANSPARENCY}
          opacity={hiddenOpacity}
          onChange={this.props.onChangeHiddenOpacity}
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
  showCloseForm: PropTypes.bool,
  okCloseHandler: PropTypes.func,
  cancelCloseHandler: PropTypes.func,
}
