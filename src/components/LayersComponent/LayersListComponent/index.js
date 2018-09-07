import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import './style.css'
import MapItemComponent from '../MapItemComponent'
import LayerItemComponent from '../LayerItemComponent'

export default class LayersListComponent extends React.Component {
  render () {
    const {
      timelineFrom,
      timelineTo,
      onSelectLayer,
      onChangeLayerColor,
      onChangeLayerVisibility,
    } = this.props
    const inDataRange = ({ dateFor }) => (
      (timelineFrom ? moment(dateFor).isAfter(timelineFrom) : true) &&
      (timelineTo ? moment(dateFor).isBefore(timelineTo) : true)
    )
    return (
      <div className="layers-list-сomponent">
        {this.props.maps && Object.values(this.props.maps).map((map) => (
          <Fragment key={map.mapId}>
            <MapItemComponent
              data={map}
              onClose={
                this.props.onCloseMap && (() => this.props.onCloseMap(map.mapId))
              }
              onChangeVisibility={
                this.props.onChangeMapVisibility &&
                  ((isVisible) => this.props.onChangeMapVisibility(map.mapId, isVisible))
              }
            />
            <div className="layers-list-component-children">
              {map.items && map.items.map((layerData) => inDataRange(layerData) && (
                <LayerItemComponent
                  isSelected = {this.props.selectedLayerId === layerData.layerId}
                  key={layerData.layerId}
                  onSelect={onSelectLayer}
                  onChangeColor={onChangeLayerColor}
                  onChangeVisibility={onChangeLayerVisibility}
                  data={layerData}
                />
              ))}
            </div>
          </Fragment>
        ))}
      </div>
    )
  }
}

LayersListComponent.propTypes = {
  selectedLayerId: PropTypes.any,
  maps: PropTypes.array,
  timelineFrom: PropTypes.any,
  timelineTo: PropTypes.any,
  onSelectLayer: PropTypes.func,
  onChangeVisibility: PropTypes.func,
  onChangeMapVisibility: PropTypes.func,
  onChangeLayerVisibility: PropTypes.func,
  onCloseMap: PropTypes.func,
  onChangeLayerColor: PropTypes.func,
}
