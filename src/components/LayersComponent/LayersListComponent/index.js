import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import './style.css'
import MapItemComponent from '../MapItemComponent'
import LayerItemComponent from '../LayerItemComponent'

export default class LayersListComponent extends React.Component {
  render () {
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
              {map.items && map.items.map((layerData) => (
                <LayerItemComponent
                  isSelected = {this.props.selectedLayerId === layerData.layerId}
                  key={layerData.layerId}
                  onSelect={
                    this.props.onSelectLayer && (() => this.props.onSelectLayer(layerData.layerId))
                  }
                  onChangeColor={
                    this.props.onChangeLayerColor &&
                      ((color) => {
                        this.props.onChangeLayerColor(layerData.layerId, color)
                      })
                  }
                  onChangeVisibility={
                    this.props.onChangeLayerVisibility &&
                      ((isVisible) => this.props.onChangeLayerVisibility(layerData.layerId, isVisible))
                  }
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
  onSelectLayer: PropTypes.func,
  onChangeVisibility: PropTypes.func,
  onChangeMapVisibility: PropTypes.func,
  onChangeLayerVisibility: PropTypes.func,
  onCloseMap: PropTypes.func,
  onChangeLayerColor: PropTypes.func,
}
