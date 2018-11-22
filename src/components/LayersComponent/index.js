import React from 'react'
import PropTypes from 'prop-types'
import memoizeOne from 'memoize-one'
import './style.css'
import { components } from '@DZVIN/CommonComponents'
import { IntervalControl } from '../common'
import i18n from '../../i18n'
import LayersControlsComponent from './LayersControlsComponent'
import MapItemComponent from './MapItemComponent'
import LayerItemComponent from './LayerItemComponent'

const { common: { TreeComponent: { TreeComponentUncontrolled } } } = components

const ItemTemplate = (props) =>
  props.data.id[0] === 'm' ? <MapItemComponent {...props} /> : <LayerItemComponent {...props}/>

ItemTemplate.propTypes = {
  data: PropTypes.object,
}

export default class LayersComponent extends React.Component {
  getCommonData = memoizeOne((selectedLayerId) => {
    const {
      onSelectLayer,
      onChangeMapColor,
      onChangeMapVisibility,
      onCloseMap,
      onChangeLayerVisibility,
      onChangeLayerColor,
    } = this.props

    return {
      selectedLayerId,
      onSelectLayer,
      onChangeMapColor,
      onChangeMapVisibility,
      onCloseMap,
      onChangeLayerVisibility,
      onChangeLayerColor,
    }
  })

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
      byIds,
      roots,
      selectedLayerId,
      onExpand,
      expandedIds,
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
          <TreeComponentUncontrolled
            byIds={byIds}
            roots={roots}
            commonData={this.getCommonData(selectedLayerId)}
            itemTemplate={ItemTemplate}
            expandedKeys={expandedIds}
            onExpand={onExpand}
          />
        </div>
      </Wrapper>
    )
  }
}

LayersComponent.propTypes = {
  wrapper: PropTypes.any,
  selectedLayerId: PropTypes.any,
  byIds: PropTypes.object,
  roots: PropTypes.array,
  onSelectLayer: PropTypes.func,
  onChangeFrom: PropTypes.func,
  expandedIds: PropTypes.object.isRequired,
  onExpand: PropTypes.func,
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
