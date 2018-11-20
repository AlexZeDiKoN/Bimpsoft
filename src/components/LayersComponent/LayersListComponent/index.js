import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import './style.css'
import MapItemComponent from '../MapItemComponent'
import LayerItemComponent from '../LayerItemComponent'
import { date } from '../../../utils'

const { inDateRange } = date

export default class LayersListComponent extends React.Component {
  render () {
    const {
      timelineFrom,
      timelineTo,
      onChangeMapColor,
      onCloseMap,
      onChangeMapVisibility,
      onSelectLayer,
      onChangeLayerColor,
      onChangeLayerVisibility,
    } = this.props
    return (
      <div className="layers-list-сomponent">
        {this.props.maps && Object.values(this.props.maps).map((map) => (
          <Fragment key={map.mapId}>
            <MapItemComponent
              data={map}
              onClose={onCloseMap}
              onChangeColor={onChangeMapColor}
              onChangeVisibility={onChangeMapVisibility}
            />
            <div className="layers-list-component-children">
              {map.items && map.items.map((layerData) => inDateRange(layerData.dateFor, timelineFrom, timelineTo) && (
                <LayerItemComponent
                  isSelected = {this.props.selectedLayerId === layerData.layerId}
                  key={layerData.layerId}
                  onSelect={onSelectLayer}
                  onChangeColor={onChangeLayerColor}
                  onChangeVisibility={onChangeLayerVisibility}
                  map={map}
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
  onChangeMapColor: PropTypes.func,
  onChangeMapVisibility: PropTypes.func,
  onChangeLayerVisibility: PropTypes.func,
  onCloseMap: PropTypes.func,
  onChangeLayerColor: PropTypes.func,
}
