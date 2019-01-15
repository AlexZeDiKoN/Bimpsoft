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

export default class PrintInner extends React.PureComponent {
  static propTypes = {
    printStatus: PropTypes.bool,
    printScale: PropTypes.number,
    map: PropTypes.object,
  }

  constructor () {
    super()
    this.state = {
      currentGrid: null,
      selectedLayers: layerGroup(),
      currentMarkers: null,
    }
  }

  createGrid = () => {
    const { map, printScale } = this.props
    const { currentGrid, selectedLayers, currentMarkers } = this.state
    const coordinatesMatrix = generateCoordinateMatrix(map, printScale)
    if (!currentGrid) {
      const newGrid = createGridGroup(coordinatesMatrix, selectedLayers)
      const newMarkers = createMarkersGroup(coordinatesMatrix, printScale)
      newGrid.addTo(map)
      newMarkers.addTo(map)
      selectedLayers.addTo(map)
      this.setState(({ currentGrid: newGrid }))
      this.setState(({ currentMarkers: newMarkers }))
      return
    }
    updateGrid(coordinatesMatrix, printScale, currentGrid, selectedLayers)
    updateMarkers(coordinatesMatrix, printScale, currentMarkers)
  }

  initCoordinateMapGrid = () => {
    this.createGrid()
    this.props.map.on('move', throttle(this.createGrid, 200))
  }

  removeCoordinateMapGrid = () => {
    const { map } = this.props
    const { currentGrid, selectedLayers, currentMarkers } = this.state
    map.off('move')
    if (currentGrid && selectedLayers) {
      currentGrid.removeFrom(map)
      selectedLayers.removeFrom(map)
      currentMarkers.removeFrom(map)
      this.setState(({
        currentGrid: null,
        currentMarkers: null,
      }))
      GRID_DATA.selectedZone = null
      selectedLayers.eachLayer((layer) => removeLayerFromSelectedLayers(layer, selectedLayers))
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
