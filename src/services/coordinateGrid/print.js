import React from 'react'
import PropTypes from 'prop-types'
import { concat, throttle } from 'lodash'
import { layerGroup, rectangle } from 'leaflet'
import { generateCoordinateMatrix } from './children/coordinateMatrix'
import { createMarkersGroup, updateMarkers } from './children/markers'
import { isAreaOnScreen, removeLayerFromSelectedLayers, setInitCoordinates } from './helpers'
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

  constructor (props) {
    super(props)
    this.currentGrid = null
    this.selectedLayers = layerGroup()
    this.currentMarkers = null
  }

  componentDidMount () {
    const { printStatus } = this.props
    printStatus && this.initCoordinateMapGrid()
  }

  async componentDidUpdate (prevProps, prevState, snapshot) {
    const { printStatus, printScale } = this.props
    if (printStatus !== prevProps.printStatus || printScale !== prevProps.printScale) {
      this.removeCoordinateMapGrid()
      printStatus && this.initCoordinateMapGrid()
    }
  }

  componentWillUnmount () {
    this.removeCoordinateMapGrid()
  }

  // Ініціалізація гріда
  initCoordinateMapGrid () {
    this.createGrid()
    this.props.map.on('move', this.onMoveHandler)
  }

  // Створення нового гріда, або оновлення існуючого
  createGrid () {
    const { map, printScale } = this.props
    const { currentGrid, selectedLayers, currentMarkers } = this
    const coordinatesMatrix = generateCoordinateMatrix(map, printScale)
    if (!currentGrid) {
      const newGrid = this.createGridGroup(coordinatesMatrix)
      const newMarkers = createMarkersGroup(coordinatesMatrix, printScale)
      newGrid.addTo(map)
      newMarkers.addTo(map)
      selectedLayers.addTo(map)
      this.currentGrid = newGrid
      this.currentMarkers = newMarkers
      return
    }
    this.updateGrid(coordinatesMatrix)
    updateMarkers(coordinatesMatrix, printScale, currentMarkers, map)
  }

  onMoveHandler = throttle(this.createGrid.bind(this), 200)

  // Створення групи елементів гріда
  createGridGroup = (coordinatesMatrix) => {
    const { selectedLayers } = this
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
    const { printScale, map } = this.props
    const { currentGrid, selectedLayers } = this
    const screenCoordinates = setInitCoordinates(map.getBounds())
    // Видаляємо участки які виходять за межі екрану
    currentGrid.getLayers().forEach((layer) => {
      const { _northEast } = layer.getBounds()
      !isAreaOnScreen(_northEast, printScale, screenCoordinates) && layer.removeFrom(currentGrid)
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
    const { currentGrid, selectedLayers, currentMarkers } = this
    map.off('move', this.onMoveHandler)
    if (currentGrid && selectedLayers) {
      currentGrid.removeFrom(map)
      selectedLayers.removeFrom(map)
      currentMarkers.removeFrom(map)
      this.currentGrid = null
      this.currentMarkers = null

      selectedLayers.eachLayer((layer) => removeLayerFromSelectedLayers(layer, selectedLayers))
    }
  }

  render () {
    return (
      <>
      </>
    )
  }
}
