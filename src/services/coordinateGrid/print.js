import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { throttle } from 'lodash'
import { layerGroup } from 'leaflet'
import { generateCoordinateMatrix } from './children/coordinateMatrix'
import { createGridGroup, updateGrid } from './children/grid'
import { createMarkersGroup, updateMarkers } from './children/markers'
import { removeLayerFromSelectedLayers } from './helpers'
import './coordinateGrid.css'

import { GRID_DATA } from './constants'
GRID_DATA.selectedLayers = layerGroup()

export default class PrintInner extends React.PureComponent {
  static propTypes = {
    printStatus: PropTypes.bool,
    printScale: PropTypes.number,
    map: PropTypes.object,
  }

  // main Grid function
  createGrid = () => {
    const { map } = this.props
    const coordinatesMatrix = generateCoordinateMatrix(map)
    if (!GRID_DATA.currentGrid) {
      const Grid = createGridGroup(coordinatesMatrix)
      const Markers = createMarkersGroup(coordinatesMatrix)
      Grid.addTo(map)
      Markers.addTo(map)
      GRID_DATA.selectedLayers.addTo(map)
      GRID_DATA.currentGrid = Grid
      GRID_DATA.currentMarkers = Markers
      return
    }
    updateGrid(coordinatesMatrix)
    updateMarkers(coordinatesMatrix)
  }

  throttledGridRecalculation = throttle(this.createGrid, 200)

  initCoordinateMapGrid = () => {
    // TODO: видалити
    const { map, printScale } = this.props
    this.setScale(map, printScale)

    this.createGrid()
    map.on('move', this.throttledGridRecalculation)
  }

  setScale = (map, scale) => {
    if (GRID_DATA.scale !== undefined && GRID_DATA.scale !== scale) {
      this.removeCoordinateMapGrid(map)
    }
    GRID_DATA.scale = scale
  }

  removeCoordinateMapGrid = () => {
    const { map } = this.props
    map.off('move', this.throttledGridRecalculation)
    if (GRID_DATA.currentGrid && GRID_DATA.selectedLayers) {
      GRID_DATA.currentGrid.removeFrom(map)
      GRID_DATA.selectedLayers.removeFrom(map)
      GRID_DATA.currentMarkers.removeFrom(map)
      GRID_DATA.currentGrid = GRID_DATA.currentMarkers = GRID_DATA.selectedZone = null
      GRID_DATA.selectedLayers.eachLayer(removeLayerFromSelectedLayers)
    }
  }

  render () {
    const { printStatus } = this.props
    return (
      <Fragment>
        {printStatus ? this.initCoordinateMapGrid() : this.removeCoordinateMapGrid()}
      </Fragment>
    )
  }
}
