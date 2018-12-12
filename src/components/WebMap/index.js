/* global L */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 'leaflet/dist/leaflet.css'
import 'leaflet.pm/dist/leaflet.pm.css'
import './Tactical.css'
import { Map, TileLayer, Control, DomEvent, control } from 'leaflet'
import { forward } from 'mgrs'
import { fromLatLon } from 'utm'
import proj4 from 'proj4'
import * as debounce from 'debounce'
import i18n from '../../i18n'
import { toggleMapGrid } from '../../services/coordinateGrid'
import { version } from '../../version'
import 'leaflet.pm'
import 'leaflet-minimap/dist/Control.MiniMap.min.css'
import 'leaflet-minimap'
import 'leaflet-measure-custom/leaflet.measure/leaflet.measure.css'
import 'leaflet-measure-custom/leaflet.measure/leaflet.measure'
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min.css'
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min'
import 'leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.css'
import 'leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.min'
import 'leaflet-switch-scale-control/src/L.Control.SwitchScaleControl.css'
import 'leaflet-switch-scale-control/src/L.Control.SwitchScaleControl'
import { colors, SCALES, SubordinationLevel, paramsNames, shortcuts } from '../../constants'
import { HotKey } from '../common/HotKeys'
import entityKind from './entityKind'
import UpdateQueue from './patch/UpdateQueue'
import {
  createTacticalSign, getGeometry, createSearchMarker, setLayerSelected, isGeometryChanged,
} from './Tactical'

let MIN_ZOOM = 0
let MAX_ZOOM = 20

const mgrsAccuracy = 5 // Точність задання координат у системі MGRS, цифр (значення 5 відповідає точності 1 метр)
const wgsAccuracy = 5 // Точність задання координат у системі WGS-84, десяткових знаків

const hintlineStyle = { // стиль лінії-підказки при створенні лінійних і площинних тактичних знаків
  color: 'red',
  dashArray: [ 5, 5 ],
}

const switchScaleOptions = {
  scales: SCALES,
  splitScale: true,
  ratioCustomItemText: '1: інший...',
  customScaleTitle: 'Задайте свій масштаб і натисніть Enter',
}

const isLayerInBounds = (layer, bounds) => bounds.contains(L.latLngBounds(getGeometry(layer).geometry))

// TODO: прибрати це після тестування
let tempPrintFlag = false
// const tmp = `<svg
//   width="480" height="480"
//   line-point-1="24,240"
//   line-point-2="456,240"
// >
//   <path
//     fill="none"
//     stroke="red" stroke-width="3" stroke-linecap="square"
//     d="M8,240
//        a16,16 0 0,1 16,-16
//        h80
//        l15,-23 15,23 -15,23 -15,-23
//        m30,0 h106
//        v-65 l-4,6 4,-15 4,15 -4,-6 v35
//        l-20,0 40,0 -20,0 v15
//        l-20,0 40,0 -20,0 v15
//        h106
//        l15,-23 15,23 -15,23 -15,-23
//        m30,0 h80
//        a16,16 0 0,1 16,16"
//   />
// </svg>`
// TODO: end

const miniMapOptions = {
  width: 200,
  toggleDisplay: true,
  strings: {
    hideText: i18n.HIDE_MINIMAP,
    showText: i18n.SHOW_MINIMAP,
  },
}

const indicateModes = {
  count: 7,
  WGS: 0,
  WGSI: 1,
  MGRS: 2,
  UTM: 3,
  SC42: 4,
  USC2000: 5,
  ALL: 6,
}

const type2mode = (type) => {
  switch (type) {
    case 'USK-2000':
      return indicateModes.USC2000
    case 'MGRS':
      return indicateModes.MGRS
    default:
      return indicateModes.WGS
  }
}

proj4.defs([
  [ 'EPSG:28407', `+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=7500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs` ],
  [ 'EPSG:28406', `+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=6500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs` ],
  [ 'EPSG:28405', `+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=5500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs` ],
  [ 'EPSG:28404', `+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=4500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs` ],
  [ 'EPSG:5558', `+proj=qsc +ellps=krass +units=m +no_defs` ], // с +proj=geocent работать не хочет, похоже баг или неподдерживамая проекция в proj4, заменил на +proj=qsc, работает, но я не знаю насколько правильные координаты она теперь выдаёт :(
])
const sc42 = (lng, lat) => lng < 27
  ? proj4('EPSG:28404', [ lng, lat ])
  : lng < 33
    ? proj4('EPSG:28405', [ lng, lat ])
    : lng < 39
      ? proj4('EPSG:28406', [ lng, lat ])
      : proj4('EPSG:28407', [ lng, lat ])
const usc2000 = (lng, lat) => proj4('EPSG:5558', [ lng, lat ])

const z = (v) => `0${v}`.slice(-2)
const toGMS = (value, pos, neg) => {
  const sign = value > 0 ? pos : neg
  value = Math.abs(value)
  const g = Math.trunc(value)
  value = (value - g) * 60
  const m = Math.trunc(value)
  const s = Math.round((value - m) * 60)
  return `${sign} ${g}°${z(m)}'${z(s)}"` // eslint-disable-line no-irregular-whitespace
}
const utmLabel = (u) => `${u.zoneLetter}-${u.zoneNum} ${u.easting.toFixed(0)} ${u.northing.toFixed(0)}`
const scLabel = ([ x, y ]) => `${x.toFixed(0)}\xA0${y.toFixed(0)}`
const Wgs84 = (lat, lng) => `${i18n.LATITUDE}: ${lat.toFixed(wgsAccuracy)}\xA0\xA0\xA0${i18n.LONGITUDE}: ${lng.toFixed(wgsAccuracy)}`
const Wgs84I = (lat, lng) => `${toGMS(lat, 'N', 'S')}\xA0\xA0\xA0${toGMS(lng, 'E', 'W')}`
const Mgrs = (lat, lng) => `MGRS:\xA0${forward([ lng, lat ], mgrsAccuracy)}`
const Utm = (lat, lng) => `UTM:\xA0${utmLabel(fromLatLon(lat, lng))}`
const Sc42 = (lat, lng) => `СК-42:\xA0${scLabel(sc42(lng, lat))}`
const Usc2000 = (lat, lng) => `УСК-2000:\xA0${scLabel(usc2000(lng, lat))}`

const setScaleOptions = (layer, params) => {
  if (!layer.object || !layer.object.type) {
    return
  }
  switch (+layer.object.type) {
    case entityKind.POINT:
      layer.setScaleOptions({
        min: Number(params[paramsNames.POINT_SIZE_MIN]),
        max: Number(params[paramsNames.POINT_SIZE_MAX]),
      })
      break
    case entityKind.TEXT:
      layer.setScaleOptions({
        min: Number(params[paramsNames.TEXT_SIZE_MIN]),
        max: Number(params[paramsNames.TEXT_SIZE_MAX]),
      })
      break
    case entityKind.SEGMENT:
    case entityKind.AREA:
    case entityKind.CURVE:
    case entityKind.POLYGON:
    case entityKind.POLYLINE:
    case entityKind.CIRCLE:
    case entityKind.RECTANGLE:
    case entityKind.SQUARE:
      layer.setScaleOptions({
        min: Number(params[paramsNames.LINE_SIZE_MIN]),
        max: Number(params[paramsNames.LINE_SIZE_MAX]),
      })
      break
    default:
  }
}

export default class WebMap extends Component {
  static propTypes = {
    // from Redux store
    center: PropTypes.shape({
      lat: PropTypes.number,
      lng: PropTypes.number,
    }).isRequired,
    zoom: PropTypes.number.isRequired,
    sources: PropTypes.arrayOf(
      PropTypes.shape({
        source: PropTypes.string,
        minZoom: PropTypes.number,
        maxZoom: PropTypes.number,
        tms: PropTypes.bool,
      })
    ),
    layersById: PropTypes.object,
    level: PropTypes.any,
    layer: PropTypes.any,
    marker: PropTypes.shape({
      text: PropTypes.string,
      point: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }),
    }),
    scaleToSelection: PropTypes.bool,
    objects: PropTypes.object,
    showMiniMap: PropTypes.bool,
    params: PropTypes.object,
    coordinatesType: PropTypes.string,
    showAmplifiers: PropTypes.bool,
    isMeasureOn: PropTypes.bool,
    backOpacity: PropTypes.number,
    hiddenOpacity: PropTypes.number,
    print: PropTypes.bool,
    edit: PropTypes.bool,
    selection: PropTypes.shape({
      showForm: PropTypes.string,
      newShape: PropTypes.shape({
        type: PropTypes.any,
      }),
      list: PropTypes.array,
    }),
    isGridActive: PropTypes.bool.isRequired,
    backVersion: PropTypes.string,
    contactId: PropTypes.number,
    lockedObjects: PropTypes.object,
    // Redux actions
    editObject: PropTypes.func,
    updateObjectGeometry: PropTypes.func,
    onChangeLayer: PropTypes.func,
    onSelectedList: PropTypes.func,
    onFinishDrawNewShape: PropTypes.func,
    showCreateForm: PropTypes.func,
    onMove: PropTypes.func,
    onRemoveMarker: PropTypes.func,
    onDropUnit: PropTypes.func,
    onSelectUnit: PropTypes.func,
    stopMeasuring: PropTypes.func,
    requestAppInfo: PropTypes.func,
    tryLockObject: PropTypes.func,
    tryUnlockObject: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.view = {
      center: { lat: 0, lng: 0 },
      zoom: 0,
    }
  }

  async componentDidMount () {
    const { sources, requestAppInfo } = this.props

    await requestAppInfo()
    this.setMapView()
    this.setMapSource(sources)
    this.initObjects()
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (!this.map || !this.map._container) {
      return // Exit if map is not yet initialized
    }

    const {
      objects, showMiniMap, showAmplifiers, isGridActive, sources, level, layersById, hiddenOpacity, layer, edit,
      isMeasureOn, coordinatesType, backOpacity, params, lockedObjects, selection: { newShape },
    } = this.props

    if (objects !== prevProps.objects) {
      this.updateObjects(objects)
    }
    if (showMiniMap !== prevProps.showMiniMap) {
      this.updateMinimap(showMiniMap)
    }
    if (showAmplifiers !== prevProps.showAmplifiers) {
      this.updateShowAmplifiers(showAmplifiers)
    }
    if (isGridActive !== prevProps.isGridActive) {
      toggleMapGrid(this.map, isGridActive)
    }
    if (sources !== prevProps.sources) {
      this.setMapSource(sources)
    }
    if (level !== prevProps.level || layersById !== prevProps.layersById || hiddenOpacity !== prevProps.hiddenOpacity ||
      layer !== prevProps.layer
    ) {
      this.updateShowLayers(level, layersById, hiddenOpacity, layer)
    }
    if (edit !== prevProps.edit || newShape.type !== prevProps.selection.newShape.type) {
      this.adjustEditMode(edit, newShape)
    }

    this.updateMarker(prevProps)

    if (isMeasureOn !== prevProps.isMeasureOn && isMeasureOn !== this.map.measureControl._measuring) {
      this.map.measureControl._toggleMeasure()
    }

    this.updateSelection(prevProps)

    if (coordinatesType !== prevProps.coordinatesType) {
      this.indicateMode = type2mode(coordinatesType)
    }
    if (backOpacity !== prevProps.backOpacity) {
      this.updateBackOpacity(backOpacity)
    }
    if (params !== prevProps.params) {
      this.updateScaleOptions(params)
    }

    this.updateViewport(prevProps)

    if (lockedObjects !== prevProps.lockedObjects) {
      this.updateLockedObjects(lockedObjects)
    }
  }

  componentWillUnmount () {
    this.map.remove()
  }

  indicateMode = indicateModes.WGS

  sources = []

  updateMinimap = (showMiniMap) => showMiniMap ? this.mini.addTo(this.map) : this.mini.remove()

  updateLockedObjects = (lockedObjects) => Object.keys(this.map._layers)
    .filter((key) => this.map._layers[key]._locked)
    .forEach((key) => {
      const layer = this.map._layers[key]
      const isLocked = lockedObjects.get(layer.id)
      !isLocked && layer.setLocked && layer.setLocked(false)
    })

  adjustEditMode = async (edit, { type }) => {
    this.setMapCursor(edit, type)
    this.updateCreatePoly(edit && type)
  }

  toggleIndicateMode = () => {
    this.indicateMode = (this.indicateMode + 1) % indicateModes.count
  }

  updateMarker = (prevProps) => {
    const { marker } = this.props
    if (marker !== prevProps.marker) {
      if (marker) {
        this.searchMarker && this.searchMarker.removeFrom(this.map)
        let { point, text } = marker
        let coordinates = this.showCoordinates(point)
        if (Array.isArray(coordinates)) {
          coordinates = coordinates.reduce((res, item) => `${res}<br/>${item}`, '')
        }
        if (coordinates !== text) {
          text = `<strong>${text}</strong><br/><br/>${coordinates}`
        }
        setTimeout(() => {
          this.searchMarker = createSearchMarker(point, text)
          this.searchMarker.addTo(this.map)
          setTimeout(() => this.searchMarker && this.searchMarker.bindPopup(text).openPopup(), 1000)
        }, 500)
      } else {
        if (this.searchMarker) {
          this.searchMarker.removeFrom(this.map)
          delete this.searchMarker
        }
      }
    }
  }

  updateBackOpacity = (backOpacity) => {
    const tilePane = this.map.getPane('tilePane')
    if (tilePane) {
      tilePane.style.opacity = backOpacity / 100
    }
  }

  updateViewport = (prevProps) => {
    const { center, zoom, scaleToSelection, selection: { list: selectedIds } } = this.props

    if (scaleToSelection !== prevProps.scaleToSelection || selectedIds !== prevProps.selection.list) {
      if (scaleToSelection) {
        const selectedIdsSet = new Set(selectedIds)
        const points = []
        this.map.eachLayer((layer) =>
          layer.options.tsType && selectedIdsSet.has(layer.id) && points.push(...getGeometry(layer).geometry)
        )
        if (points.length > 0) {
          const bounds = L.latLngBounds(points)
          if (bounds.isValid() && !this.map.getBounds().contains(bounds)) {
            const center = bounds.getCenter()
            const zoom = Math.min(this.map.getBoundsZoom(bounds), this.map.getZoom())
            setTimeout(() => this.props.onMove(center, zoom), 0)
          }
        }
      }
    }

    if (center.lat !== this.view.center.lat || center.lng !== this.view.center.lng || zoom !== this.view.zoom) {
      this.view = { center, zoom }
      this.isUpdatingViewport = true
      this.map.setView(this.view.center, this.view.zoom, { animate: false })
      this.isUpdatingViewport = false
    }
  }

  setMapView = () => {
    if (!this.container) {
      return
    }
    this.mini = undefined
    this.map = new Map(this.container, {
      zoomControl: false,
      measureControl: true,
    })
    this.map.removeControl(this.map.measureControl)
    this.map.measureControl._map = this.map
    control.zoom({
      zoomInTitle: i18n.ZOOM_IN,
      zoomOutTitle: i18n.ZOOM_OUT,
    }).addTo(this.map)
    this.scale = control.graphicScale({
      fill: 'hollow',
    })
    this.scale._getDisplayUnit = (meters) => {
      const m = meters < 1000
      const displayUnit = ` ${i18n[m ? 'ABBR_METERS' : 'ABBR_KILOMETERS']}`
      return {
        unit: displayUnit,
        amount: m ? meters : meters / 1000,
      }
    }
    this.scale.addTo(this.map)
    this.coordinates = control.coordinates({
      position: 'topright',
      enableUserInput: false,
      customLabelFcn: this.showCoordinates,
    })
    this.coordinates.addTo(this.map)
    const scale = new L.Control.SwitchScaleControl(switchScaleOptions)
    this.map.addControl(scale)
    scale._container.style.left = '20px'
    DomEvent.addListener(this.coordinates._container, 'click', () => {
      this.toggleIndicateMode()
      this.coordinates._update({ latlng: this.coordinates._currentPos })
    }, this.coordinates)
    this.map.setView(this.props.center, this.props.zoom)
    this.map.attributionControl.setPrefix(`f${version} b${this.props.backVersion}`)
    this.map.on('moveend', this.moveHandler)
    this.map.on('zoomend', this.moveHandler)
    this.map.on('pm:create', this.createNewShape)
    this.map.on('click', this.onMouseClick)
    this.map.on('stop_measuring', this.onStopMeasuring)
    this.map.on('boxselectstart', this.onBoxSelectStart)
    this.map.on('boxselectend', this.onBoxSelectEnd)
    this.map.doubleClickZoom.disable()
    this.updater = new UpdateQueue(this.map)
  }

  onSelectedListChange (newList) {
    const { selection: { list }, onSelectedList, updateObjectGeometry, onSelectUnit } = this.props
    if (newList.length === 0 && list === 0) {
      return
    }

    // save geometry when one selected item lost focus
    if (list.length === 1 && list[0] !== newList[0]) {
      const id = list[0]
      const layer = this.findLayerById(id)
      if (layer) {
        const { point, geometry } = layer.object
        const geometryChanged = isGeometryChanged(layer, point.toJS(), geometry.toArray())
        if (geometryChanged) {
          updateObjectGeometry(id, getGeometry(layer))
        }
      }
    }

    // get unit from new selection
    let selectedUnit = null
    if (newList.length === 1 && list[0] !== newList[0]) {
      const id = newList[0]
      const layer = this.findLayerById(id)
      selectedUnit = (layer && layer.object.unit) || null
    }
    onSelectUnit(selectedUnit)

    onSelectedList(newList)
  }

  onMouseClick = (e) => {
    if (!this.isBoxSelection && !this.draggingObject) {
      this.onSelectedListChange([])
    }
  }

  onBoxSelectStart = () => {
    this.isBoxSelection = true
  }

  onBoxSelectEnd = ({ boxSelectBounds }) => {
    this.isBoxSelection = false
    const { layer: activeLayerId, layersById } = this.props
    const selectedIds = []
    this.map.eachLayer((layer) => {
      if (layer.options.tsType) {
        const isInBounds = isLayerInBounds(layer, boxSelectBounds)
        const isOnActiveLayer = layer.object && (layer.object.layer === activeLayerId)
        const isActiveLayerVisible = layersById.hasOwnProperty(activeLayerId)
        const isSelected = isInBounds && isOnActiveLayer && isActiveLayerVisible
        isSelected && selectedIds.push(layer.id)
      }
    })
    this.onSelectedListChange(selectedIds)
  }

  updateSelection = (prevProps) => {
    const { objects, layer: layerId, edit, selection: { list: selectedIds } } = this.props
    if (
      objects !== prevProps.objects ||
      selectedIds !== prevProps.selection.list ||
      edit !== prevProps.edit ||
      layerId !== prevProps.layer
    ) {
      const selectedIdsSet = new Set(selectedIds)
      const canEditLayer = selectedIds.length === 1 && edit
      this.map.eachLayer((layer) => {
        if (layer.options.tsType) {
          const { id } = layer
          const isSelected = selectedIdsSet.has(id)
          const isActiveLayer = layer.object.layer === layerId
          const isActive = canEditLayer && isSelected && isActiveLayer
          setLayerSelected(layer, isSelected, isActive, isActiveLayer)
        }
      })
    }
  }

  onStopMeasuring = () => {
    this.props.stopMeasuring()
  }

  moveHandler = debounce(() => {
    if (this.isUpdatingViewport) {
      return
    }
    const center = this.map.getCenter()
    const zoom = this.map.getZoom()
    const isZoomChanged = zoom !== this.view.zoom
    this.view = { center, zoom }
    const { onMove } = this.props
    onMove(center, zoom, isZoomChanged)
  }, 500)

  updateShowLayer = (levelEdge, layersById, hiddenOpacity, selectedLayerId, item) => {
    if (item.id && item.object) {
      const { layer, level } = item.object
      const itemLevel = Math.max(level, SubordinationLevel.TEAM_CREW)
      const hidden = itemLevel < levelEdge || !layer || !layersById.hasOwnProperty(layer)
      const isSelectedLayer = selectedLayerId === layer
      const opacity = isSelectedLayer ? 1 : (hiddenOpacity / 100)
      const zIndexOffset = isSelectedLayer ? 1000000000 : 0

      item.setZIndexOffset && item.setZIndexOffset(zIndexOffset)
      item.setOpacity && item.setOpacity(opacity)
      item.setHidden && item.setHidden(hidden)
      const color = layer && layersById[layer] ? layersById[layer].color : null
      item.setShadowColor && item.setShadowColor(color)
    }
  }

  updateShowLayers = (levelEdge, layersById, hiddenOpacity, selectedLayerId) => {
    if (this.map) {
      this.map.eachLayer((item) => this.updateShowLayer(levelEdge, layersById, hiddenOpacity, selectedLayerId, item))
    }
  }

  updateScaleOptions = (params) => {
    if (this.map) {
      this.map.eachLayer((layer) => {
        setScaleOptions(layer, params)
      })
    }
  }

  updateShowAmplifiers = (showAmplifiers) => {
    if (this.map) {
      this.map.eachLayer((layer) => {
        layer.setShowAmplifiers && layer.setShowAmplifiers(showAmplifiers)
      })
    }
  }

  showCoordinates = ({ lng, lat }) => {
    try {
      switch (this.indicateMode) {
        case indicateModes.WGSI:
          return Wgs84I(lat, lng)
        case indicateModes.MGRS:
          return Mgrs(lat, lng)
        case indicateModes.UTM:
          return Utm(lat, lng)
        case indicateModes.SC42:
          return Sc42(lat, lng)
        case indicateModes.USC2000:
          return Usc2000(lat, lng)
        case indicateModes.ALL:
          return [ Wgs84(lat, lng), Wgs84I(lat, lng), Mgrs(lat, lng), Utm(lat, lng), Sc42(lat, lng), Usc2000(lat, lng) ]
            .join('<br/>')
        default: // WGS-84
          return Wgs84(lat, lng)
      }
    } catch (err) {
      console.error(err)
      return '---'
    }
  }

  setMapCursor = (edit, type) => {
    if (this.map) {
      this.map._container.style.cursor = edit && type ? 'crosshair' : ''
    }
  }

  setMapSource = (newSources) => {
    if (this.map) {
      this.sources.forEach((source) => source.removeFrom(this.map))
      this.sources = []
      if (this.mini) {
        this.miniSource.remove()
        this.mini.remove()
        this.mini = null
      }
      newSources.forEach((newSource) => {
        const { source, ...rest } = newSource
        let url = source
        if (url && url[0] === '/') {
          url = `${process.env.REACT_APP_TILES}${url}`
        }
        console.info('REACT_APP_PREFIX: ', process.env.REACT_APP_PREFIX)
        console.info('REACT_APP_TILES: ', process.env.REACT_APP_TILES)
        console.info('Create tile layer: ', url)
        const sourceLayer = new TileLayer(url, rest)
        MIN_ZOOM = rest.minZoom || MIN_ZOOM
        MAX_ZOOM = rest.maxZoom || MAX_ZOOM
        sourceLayer.addTo(this.map)
        this.sources.push(sourceLayer)
        if (!this.mini) {
          this.miniSource = new TileLayer(url, { ...rest, minZoom: 0, maxZoom: 15 })
          this.mini = new Control.MiniMap(this.miniSource, miniMapOptions)
          this.updateMinimap(this.props.showMiniMap)
        }
      })
    }
  }

  initObjects = () => {
    this.updateObjects(this.props.objects)
  }

  updateObjects = (objects) => {
    if (this.map) {
      const notChangedIds = new Set()
      this.map.eachLayer((layer) => {
        if (layer.id) {
          const object = objects.get(layer.id)
          if (object && layer.object === object) {
            notChangedIds.add(layer.id)
          } else {
            if (object && object.equals(layer.object)) {
              layer.object = object
              notChangedIds.add(layer.id)
            } else {
              setLayerSelected(layer, false, false)
              layer.remove()
            }
          }
        }
      })
      objects.forEach((object, key) => {
        if (!notChangedIds.has(key)) {
          this.addObject(object)
        }
      })
    }
  }

  addObject = (object) => {
    const { id, attributes } = object
    const layer = createTacticalSign(object, this.map)
    if (layer) {
      layer.options.lineCap = 'butt'
      layer.options.lineAmpl = attributes.lineAmpl
      layer.options.lineNodes = attributes.lineNodes
      layer.options.lineEnds = {
        left: attributes.left,
        right: attributes.right,
      }

      layer.id = id
      layer.object = object
      layer.on('click', this.clickOnLayer)
      layer.on('dblclick', this.dblClickOnLayer)
      layer.on('pm:markerdragstart', this.onDragstartLayer)
      layer.on('pm:markerdragend', this.onDragendLayer)
      layer.addTo(this.map)
      const { level, layersById, hiddenOpacity, layer: selectedLayerId, params, showAmplifiers } = this.props
      this.updateShowLayer(level, layersById, hiddenOpacity, selectedLayerId, layer)
      const { color = null, fill = null, lineType = null, strokeWidth = null } = attributes

      if (color !== null && color !== '') {
        layer.setColor && layer.setColor(colors.evaluateColor(color))
      }
      if (fill !== null && fill !== '') {
        layer.setFill && layer.setFill(colors.evaluateColor(fill))
      }
      if (lineType !== null && lineType !== '') {
        layer.setLineType && layer.setLineType(lineType)
      }
      if (strokeWidth !== null) {
        layer.setStrokeWidth && layer.setStrokeWidth(strokeWidth)
      }

      setScaleOptions(layer, params)

      layer.setShowAmplifiers && layer.setShowAmplifiers(showAmplifiers)
    }
    return layer
  }

  onDragstartLayer = () => {
    this.draggingObject = true
  }

  onDragendLayer = () => setTimeout(() => {
    this.draggingObject = false
  }, 0)

  clickOnLayer = async (event) => {
    L.DomEvent.stopPropagation(event)
    const { target: { id, object } } = event
    const useOneClickForActivateLayer = this.props.hiddenOpacity === 100
    const targetLayer = object && object.layer
    let doActivate = targetLayer === this.props.layer
    if (!doActivate && useOneClickForActivateLayer && targetLayer) {
      this.props.onChangeLayer(targetLayer)
      doActivate = true
    }
    if (doActivate) {
      this.selectLayer(id, event.originalEvent.ctrlKey)

      event.target._map._container.focus()
    }
  }

  dblClickOnLayer = async (event) => {
    const { target: { id, object } } = event
    const { selection: { list }, editObject } = this.props
    if (list.length === 1 && list[0] === object.id) {
      editObject()
    } else {
      const targetLayer = object && object.layer
      if (targetLayer && targetLayer !== this.props.layer) {
        this.props.onChangeLayer(targetLayer)
        await this.selectLayer(id)
        event.target._map._container.focus()
      }
    }
    L.DomEvent.stopPropagation(event)
  }

  selectLayer = async (id, exclusive) => {
    const { selection: { list } } = this.props
    if (id) {
      if (exclusive) {
        this.onSelectedListChange(list.indexOf(id) === -1 ? [ ...list, id ] : list.filter((itemId) => itemId !== id))
      } else if (list.length !== 1 || list[0] !== id) {
        this.onSelectedListChange([ id ])
      }
    } else {
      this.onSelectedListChange([])
    }
    // newLayer && newLayer.setLocked && newLayer.setLocked(!(await this.props.tryLockObject(newLayer.id)))
  }

  findLayerById = (id) => {
    for (const lkey of Object.keys(this.map._layers)) {
      const layer = this.map._layers[lkey]
      if (Number(layer.id) === Number(id)) {
        return layer
      }
    }
  }

  // // TODO: пибрати це після тестування
  // handleShortcuts = async (action) => {
  //   const { addObject } = this.props
  //   const bounds = this.map.getBounds()
  //   const center = bounds.getCenter()
  //   const width = bounds.getEast() - bounds.getWest()
  //   const height = bounds.getNorth() - bounds.getSouth()
  //   let created
  //   switch (action) {
  //     case ADD_POINT:
  //       console.info('ADD_POINT')
  //       break
  //     case ADD_SEGMENT: {
  //       console.info('ADD_SEGMENT')
  //       const geometry = [
  //         { lat: center.lat, lng: center.lng - width / 10 },
  //         { lat: center.lat, lng: center.lng + width / 10 },
  //       ]
  //       created = await addObject({
  //         type: entityKind.SEGMENT,
  //         point: calcMiddlePoint(geometry),
  //         geometry,
  //         attributes: {
  //           template: tmp,
  //           color: 'red',
  //         },
  //       })
  //       break
  //     }
  //     case ADD_AREA: {
  //       console.info('ADD_AREA')
  //       const geometry = [
  //         { lat: center.lat - height / 10, lng: center.lng },
  //         { lat: center.lat + height / 10, lng: center.lng - width / 10 },
  //         { lat: center.lat + height / 10, lng: center.lng + width / 10 },
  //       ]
  //       created = await addObject({
  //         type: entityKind.AREA,
  //         point: calcMiddlePoint(geometry),
  //         geometry,
  //       })
  //       break
  //     }
  //     case ADD_CURVE: {
  //       console.info('ADD_CURVE')
  //       const geometry = [
  //         { lat: center.lat, lng: center.lng - width / 10 },
  //         { lat: center.lat, lng: center.lng + width / 10 },
  //       ]
  //       created = await addObject({
  //         type: entityKind.CURVE,
  //         point: calcMiddlePoint(geometry),
  //         geometry,
  //       })
  //       break
  //     }
  //     case ADD_POLYGON: {
  //       console.info('ADD_POLYGON')
  //       const geometry = [
  //         { lat: center.lat - height / 10, lng: center.lng },
  //         { lat: center.lat + height / 10, lng: center.lng - width / 10 },
  //         { lat: center.lat + height / 10, lng: center.lng + width / 10 },
  //       ]
  //       created = await addObject({
  //         type: entityKind.POLYGON,
  //         point: calcMiddlePoint(geometry),
  //         geometry,
  //       })
  //       break
  //     }
  //     case ADD_POLYLINE: {
  //       console.info('ADD_POLYLINE')
  //       const geometry = [
  //         { lat: center.lat, lng: center.lng - width / 10 },
  //         { lat: center.lat, lng: center.lng + width / 10 },
  //       ]
  //       created = await addObject({
  //         type: entityKind.POLYLINE,
  //         point: calcMiddlePoint(geometry),
  //         geometry,
  //       })
  //       break
  //     }
  //     case ADD_CIRCLE: {
  //       console.info('ADD_CIRCLE')
  //       const geometry = [
  //         { lat: center.lat, lng: center.lng },
  //         { lat: center.lat, lng: center.lng + width / 10 },
  //       ]
  //       created = await addObject({
  //         type: entityKind.CIRCLE,
  //         point: calcMiddlePoint(geometry),
  //         geometry,
  //       })
  //       break
  //     }
  //     case ADD_RECTANGLE: {
  //       console.info('ADD_RECTANGLE')
  //       const geometry = [
  //         { lat: center.lat - width / 15, lng: center.lng - width / 10 },
  //         { lat: center.lat + width / 15, lng: center.lng + width / 10 },
  //       ]
  //       created = await addObject({
  //         type: entityKind.RECTANGLE,
  //         point: calcMiddlePoint(geometry),
  //         geometry,
  //       })
  //       break
  //     }
  //     case ADD_SQUARE: {
  //       console.info('ADD_SQUARE')
  //       const geometry = [
  //         { lat: center.lat - width / 10, lng: center.lng - width / 10 },
  //         { lat: center.lat + width / 10, lng: center.lng + width / 10 },
  //       ]
  //       created = await addObject({
  //         type: entityKind.SQUARE,
  //         point: calcMiddlePoint(geometry),
  //         geometry,
  //       })
  //       break
  //     }
  //     case ADD_TEXT:
  //       console.info('ADD_TEXT')
  //       break
  //     default:
  //       console.error(`Unknown action: ${action}`)
  //   }
  //   this.activateCreated(created)
  // }

  selectPrintAreaHandler = () => {
    tempPrintFlag = !tempPrintFlag
    toggleMapGrid(this.map, tempPrintFlag)
  }

  updateCreatePoly = (type) => {
    switch (type) {
      case entityKind.POLYLINE:
      case entityKind.CURVE:
        this.createPolyType = type // Не виносити за межі switch!
        this.map.pm.enableDraw('Line', { hintlineStyle })
        break
      case entityKind.POLYGON:
      case entityKind.AREA:
        this.createPolyType = type // Не виносити за межі switch!
        this.map.pm.enableDraw('Poly', { finishOn: 'dblclick', hintlineStyle })
        break
      case entityKind.RECTANGLE:
      case entityKind.SQUARE:
        this.createPolyType = type // Не виносити за межі switch!
        this.map.pm.enableDraw('Rectangle')
        break
      case entityKind.CIRCLE:
        this.createPolyType = type // Не виносити за межі switch!
        this.map.pm.enableDraw('Circle')
        break
      case entityKind.TEXT:
      case entityKind.POINT:
        this.createPolyType = type // Не виносити за межі switch!
        this.map.pm.enableDraw('Poly', { finishOn: 'click' })
        break
      default:
        this.createPolyType = null
        this.map.pm.disableDraw()
        break
    }
  }

  createNewShape = async (e) => {
    const { layer } = e
    layer.options.tsType = this.createPolyType
    layer.removeFrom(this.map)
    const geometry = getGeometry(layer)
    this.props.onFinishDrawNewShape(geometry)
  }

  dragOverHandler = (e) => {
    e.preventDefault()
  }

  dropHandler = (e) => {
    e.preventDefault()
    let data
    try {
      data = JSON.parse(e.dataTransfer.getData('text'))
    } catch (e) {
      return
    }
    if (data.type === 'unit') {
      const point = this.map.mouseEventToLatLng(e)
      const { lat, lng } = point
      this.props.onDropUnit(data.id, { lat, lng })
    }
  }

  escapeHandler = () => {
    if (this.searchMarker) {
      this.props.onRemoveMarker()
    }
  }

  spaceHandler = () => {
    this.onSelectedListChange([])
  }

  render () {
    return (
      <div
        onDragOver={this.dragOverHandler}
        onDrop={this.dropHandler}
        ref={(container) => (this.container = container)}
        style={{ height: '100%' }}
      >
        <HotKey selector={shortcuts.ESC} onKey={this.escapeHandler} />
        <HotKey selector={shortcuts.SPACE} onKey={this.spaceHandler} />
        <HotKey selector={shortcuts.SELECT_PRINT_AREA} onKey={this.selectPrintAreaHandler} />
      </div>
    )
  }
}
