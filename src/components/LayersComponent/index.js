import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { IntervalControl } from '../common'
import i18n from '../../i18n'
import LayersControlsComponent from './LayersControlsComponent'
import LayersListComponent from './LayersListComponent'

export default class LayersComponent extends React.Component {
  render () {
    const {
      wrapper: Wrapper = React.Fragment,
      timelineFrom,
      timelineTo,
      onChangeTimeLineFrom,
      onChangeTimeLineTo,
      visible,
      onChangeVisibility,
      backOpacity,
      onChangeBackOpacity,
      hiddenOpacity,
      onChangeHiddenOpacity,
      onCloseAllMaps,
      maps,
      selectedLayerId,
      onSelectLayer,
      onChangeMapColor,
      onChangeMapVisibility,
      onCloseMap,
      onChangeLayerVisibility,
      onChangeLayerColor,
    } = this.props
    return (
      <Wrapper title={i18n.LAYERS}>
        <div className="layers-component">
          <IntervalControl
            from={timelineFrom}
            to={timelineTo}
            onChangeFrom={onChangeTimeLineFrom}
            onChangeTo={onChangeTimeLineTo}
          />
          <LayersControlsComponent
            visible={visible}
            onChangeVisibility={onChangeVisibility}
            backOpacity={backOpacity}
            onChangeBackOpacity={onChangeBackOpacity}
            hiddenOpacity={hiddenOpacity}
            onChangeHiddenOpacity={onChangeHiddenOpacity}
            onCloseAllMaps={onCloseAllMaps}
          />
          <LayersListComponent
            timelineFrom={timelineFrom}
            timelineTo={timelineTo}
            maps={maps}
            selectedLayerId={selectedLayerId}
            onSelectLayer={onSelectLayer}
            onChangeMapColor={onChangeMapColor}
            onChangeMapVisibility={onChangeMapVisibility}
            onCloseMap={onCloseMap}
            onChangeLayerVisibility={onChangeLayerVisibility}
            onChangeLayerColor={onChangeLayerColor}
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
