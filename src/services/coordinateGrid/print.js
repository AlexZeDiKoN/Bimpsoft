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

export default function PrintInner (props) {
  const { map, printScale, printStatus } = props

  const createGrid = () => {
    const coordinatesMatrix = generateCoordinateMatrix(map, printScale)
    if (!GRID_DATA.currentGrid) {
      const Grid = createGridGroup(coordinatesMatrix)
      const Markers = createMarkersGroup(coordinatesMatrix, printScale)
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

  const throttledGridRecalculation = throttle(createGrid, 200)

  const initCoordinateMapGrid = () => {
    // TODO: видалити
    setScale(map, printScale)

    createGrid()
    map.on('move', throttledGridRecalculation)
  }

  const setScale = (map, scale) => {
    if (GRID_DATA.scale !== undefined && GRID_DATA.scale !== scale) {
      removeCoordinateMapGrid(map)
    }
    GRID_DATA.scale = scale
  }

  const removeCoordinateMapGrid = () => {
    map.off('move')
    if (GRID_DATA.currentGrid && GRID_DATA.selectedLayers) {
      GRID_DATA.currentGrid.removeFrom(map)
      GRID_DATA.selectedLayers.removeFrom(map)
      GRID_DATA.currentMarkers.removeFrom(map)
      GRID_DATA.currentGrid = GRID_DATA.currentMarkers = GRID_DATA.selectedZone = null
      GRID_DATA.selectedLayers.eachLayer(removeLayerFromSelectedLayers)
    }
  }

  return (
    <Fragment>
      {printStatus ? initCoordinateMapGrid() : removeCoordinateMapGrid()}
    </Fragment>
  )
}

PrintInner.propTypes = {
  printStatus: PropTypes.bool,
  printScale: PropTypes.number,
  map: PropTypes.object,
}
