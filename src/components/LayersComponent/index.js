import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { IntervalControl } from '../common'
import i18n from '../../i18n'
import LayersControlsComponent from './LayersControlsComponent'
import LayersListComponent from './LayersListComponent'

export default class LayersComponent extends React.Component {
  render () {
    const { wrapper: Wrapper = React.Fragment } = this.props
    return (
      <Wrapper title={i18n.LAYERS}>
        <div className="layers-component">
          <IntervalControl
            from={this.props.timelineFrom}
            to={this.props.timelineTo}
            onChangeFrom={this.props.onChangeTimeLineFrom}
            onChangeTo={this.props.onChangeTimeLineTo}
          />
          <LayersControlsComponent
            visible={this.props.visible}
            onChangeVisibility={this.props.onChangeVisibility}
            backOpacity={this.props.backOpacity}
            onChangeBackOpacity={this.props.onChangeBackOpacity}
            hiddenOpacity={this.props.hiddenOpacity}
            onChangeHiddenOpacity={this.props.onChangeHiddenOpacity}
            onCloseAllMaps={this.props.onCloseAllMaps}
          />
          <LayersListComponent
            timelineFrom={this.props.timelineFrom}
            timelineTo={this.props.timelineTo}
            maps={this.props.maps}
            selectedLayerId={this.props.selectedLayerId}
            onSelectLayer={this.props.onSelectLayer}
            onChangeMapColor={this.props.onChangeMapColor}
            onChangeMapVisibility={this.props.onChangeMapVisibility}
            onCloseMap={this.props.onCloseMap}
            onChangeLayerVisibility={this.props.onChangeLayerVisibility}
            onChangeLayerColor={this.props.onChangeLayerColor}
          />
        </div>
      </Wrapper>
    )
  }
}

LayersComponent.propTypes = {
  wrapper: PropTypes.any,
  selectedLayerId: PropTypes.any,
  maps: PropTypes.array,
  onSelectLayer: PropTypes.func,
  onChangeFrom: PropTypes.func,
  onChangeTo: PropTypes.func,
  onChangeMapColor: PropTypes.func,
  onChangeMapVisibility: PropTypes.func,
  onChangeLayerVisibility: PropTypes.func,
  onChangeLayerColor: PropTypes.func,
  onCloseMap: PropTypes.func,
  timelineFrom: PropTypes.any,
  timelineTo: PropTypes.any,
  onChangeTimeLineFrom: PropTypes.func,
  onChangeTimeLineTo: PropTypes.func,
  visible: PropTypes.bool,
  onChangeVisibility: PropTypes.func,
  backOpacity: PropTypes.number,
  onChangeBackOpacity: PropTypes.func,
  hiddenOpacity: PropTypes.number,
  onChangeHiddenOpacity: PropTypes.func,
  onCloseAllMaps: PropTypes.func,
}
