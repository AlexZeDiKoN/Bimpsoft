import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { concat, throttle } from 'lodash'
import { layerGroup, rectangle } from 'leaflet'
import { generateCoordinateMatrix } from './children/coordinateMatrix'
import { createMarkersGroup, updateMarkers } from './children/markers'
import { isAreaOnScreen, removeLayerFromSelectedLayers } from './helpers'
import { selectLayer } from './children/selectLayer'
import './coordinateGrid.css'

import { INIT_GRID_OPTIONS, LAT, LNG } from './constants'

export default class PrintInner extends React.Component {
  static propTypes = {
    printStatus: PropTypes.bool,
    printScale: PropTypes.number,
    map: PropTypes.object,
    setSelectedZone: PropTypes.func,
    selectedZone: PropTypes.object,
  }

  constructor () {
    super()
    this.state = {
      currentGrid: null,
      selectedLayers: layerGroup(),
      currentMarkers: null,
    }
  }

  // Ініціалізація гріда
  initCoordinateMapGrid = () => {
    this.createGrid()
    this.props.map.on('move', throttle(this.createGrid, 200))
  }

  // Створення нового гріда, або оновлення існуючого
  createGrid = () => {
    const { map, printScale } = this.props
    const { currentGrid, selectedLayers, currentMarkers } = this.state
    const coordinatesMatrix = generateCoordinateMatrix(map, printScale)
    if (!currentGrid) {
      const newGrid = this.createGridGroup(coordinatesMatrix)
      const newMarkers = createMarkersGroup(coordinatesMatrix, printScale)
      newGrid.addTo(map)
      newMarkers.addTo(map)
      selectedLayers.addTo(map)
      this.setState(({ currentGrid: newGrid }))
      this.setState(({ currentMarkers: newMarkers }))
      return
    }
    this.updateGrid(coordinatesMatrix)
    updateMarkers(coordinatesMatrix, printScale, currentMarkers)
  }

  // Створення групи елементів гріда
  createGridGroup = (coordinatesMatrix) => {
    const { selectedLayers } = this.state
    const rectangles = concat(...coordinatesMatrix)
      .map((coordinates) => this.createGridRectangle(coordinates))
    const currentGrid = layerGroup(rectangles)
    rectangles.map((rectangle) => rectangle
      .on('click', (e) => selectLayer(
        e,
        currentGrid,
        selectedLayers,
        this.props.selectedZone,
        this.props.setSelectedZone,
      )))
    return currentGrid
  }

  createGridRectangle = (coordinates) => rectangle(coordinates, INIT_GRID_OPTIONS)

  // Оновлення елементів гріда
  updateGrid = (coordinatesMatrix) => {
    const { printScale } = this.props
    const { currentGrid, selectedLayers } = this.state
    // Видаляємо участки які виходять за межі екрану
    currentGrid.getLayers().forEach((layer) => {
      const { _northEast } = layer.getBounds()
      !isAreaOnScreen(_northEast, printScale) && layer.removeFrom(currentGrid)
    })
    // Додаємо нові
    const layers = [ ...currentGrid.getLayers(), ...selectedLayers.getLayers() ]
    concat(...coordinatesMatrix).forEach((coordinate) => {
      if (!this.isLayerExist(coordinate, layers)) {
        const newLayer = this.createGridRectangle(coordinate)
        newLayer.on('click', (e) => selectLayer(
          e,
          currentGrid,
          selectedLayers,
          this.props.selectedZone,
          this.props.setSelectedZone,
        ))
        currentGrid.addLayer(newLayer)
      }
    })
  }

  isLayerExist = (coordinate, layers) =>
    layers.some((layer) => {
      const { _northEast: { lat, lng } } = layer.getBounds()
      const isLatExist = lat.toFixed(6) === coordinate[1][LAT].toFixed(6)
      const isLngExist = lng.toFixed(6) === coordinate[1][LNG].toFixed(6)
      return isLatExist && isLngExist
    })

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
      selectedLayers.eachLayer((layer) => removeLayerFromSelectedLayers(layer, selectedLayers))
    }
  }

  render () {
    return (
      <Fragment>
        {this.props.printStatus ? this.initCoordinateMapGrid() : this.removeCoordinateMapGrid()}
      </Fragment>
    )
  }
}
