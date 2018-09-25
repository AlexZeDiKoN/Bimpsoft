/* global L */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Shortcuts } from 'react-shortcuts'
import { notification } from 'antd'
import 'leaflet/dist/leaflet.css'
import 'leaflet.pm/dist/leaflet.pm.css'
import './Tactical.css'
import { Map, TileLayer, Control, DomEvent, control } from 'leaflet'
import { Symbol } from '@DZVIN/milsymbol'
import { forward } from 'mgrs'
import { fromLatLon } from 'utm'
import proj4 from 'proj4'
import SubordinationLevel from '../../constants/SubordinationLevel'
import i18n from '../../i18n'
import {
  ADD_POINT, ADD_SEGMENT, ADD_AREA, ADD_CURVE, ADD_POLYGON, ADD_POLYLINE, ADD_CIRCLE, ADD_RECTANGLE, ADD_SQUARE,
  ADD_TEXT,
  // TODO: пибрати це після тестування
  SELECT_PRINT_AREA,
} from '../../constants/shortcuts'
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
import { colors } from '../../constants'
import { generateTextSymbolSvg } from '../../utils'
import WebmapApi from '../../server/api.webmap'
import entityKind from './entityKind'
import {
  initMapEvents, createTacticalSign, getGeometry, calcMiddlePoint, activateLayer, clearActiveLayer, updateLayerIcons,
  createSearchMarker, setLayerSelected,
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
  scales: [ 5000, 10000, 25000, 50000, 100000, 200000, 500000, 1000000, 2500000, 5000000 ],
  splitScale: true,
  ratioCustomItemText: '1: інший...',
  customScaleTitle: 'Задайте свій масштаб і натисніть Enter',
}

const isLayerInBounds = (layer, bounds) => bounds.contains(L.latLngBounds(getGeometry(layer).geometry))

// TODO: прибрати це після тестування
let tempPrintFlag = false
const tmp = `<svg
  width="480" height="480"
  line-point-1="24,240"
  line-point-2="456,240"
>
  <path
    fill="none"
    stroke="red" stroke-width="3" stroke-linecap="square"
    d="M8,240
       a16,16 0 0,1 16,-16
       h80
       l15,-23 15,23 -15,23 -15,-23
       m30,0 h106
       v-65 l-4,6 4,-15 4,15 -4,-6 v35
       l-20,0 40,0 -20,0 v15
       l-20,0 40,0 -20,0 v15
       h106
       l15,-23 15,23 -15,23 -15,-23
       m30,0 h80
       a16,16 0 0,1 16,16" 
  />
</svg>`
// TODO: end

const colorOf = (affiliation) => {
  switch (affiliation) {
    // TODO
    default:
      return 'black'
  }
}

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

function geomPointEquals (point, data) {
  if (!point || !data) {
    return false
  }
  const lng = point.get('lng')
  const lat = point.get('lat')
  return lng !== null && lat !== null &&
    +lat.toFixed(6) === data.lat.toFixed(6) && +lng.toFixed(6) === data.lng.toFixed(6)
}

function geomPointListEquals (list, data) {
  if (list.size !== data.length) {
    return false
  }
  for (let i = 0; i < data.length; i++) {
    if (!geomPointEquals(list.get(i), data[i])) {
      return false
    }
  }
  return true
}

function tacticalSignEquals (object, data) {
  return +object.get('id') === +data.id &&
    +object.get('type') === +data.type &&
    geomPointEquals(object.get('point'), data.point) &&
    geomPointListEquals(object.get('geometry'), data.geometry)
  // TODO інші властивості
}

const filterSet = (data) => {
  const result = {}
  data.forEach((k, v) => {
    if (k !== '') {
      result[v] = k
    }
  })
  return result
}

const filterObj = (data) => {
  for (const key of Object.keys(data)) {
    if (data[key] === '') {
      delete data[key]
    }
  }
  return Object.keys(data).length ? data : null
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
    searchResult: PropTypes.shape({
      text: PropTypes.string,
      point: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }),
    }),
    objects: PropTypes.object,
    showMiniMap: PropTypes.bool,
    pointSizes: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    }),
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
      data: PropTypes.shape({
        type: PropTypes.any,
        orgStructureId: PropTypes.number,
      }),
    }),
    // Redux actions
    addObject: PropTypes.func,
    deleteObject: PropTypes.func,
    editObject: PropTypes.func,
    updateObject: PropTypes.func,
    updateObjectGeometry: PropTypes.func,
    onSelection: PropTypes.func,
    onSelectedList: PropTypes.func,
    setNewShapeCoordinates: PropTypes.func,
    showCreateForm: PropTypes.func,
    hideForm: PropTypes.func,
    onMove: PropTypes.func,
    onDropUnit: PropTypes.func,
    stopMeasuring: PropTypes.func,
    isGridActive: PropTypes.bool.isRequired,
    orgStructureSelectedId: PropTypes.number,
  }

  async componentDidMount () {
    const { sources } = this.props
    try {
      this.backVersion = await WebmapApi.getVersion()
    } catch (err) {
      this.backVersion = '-?'
      notification.error({ message: i18n.ERROR, description: err.message })
    }
    this.setMapView()
    this.setMapSource(sources)
    this.initObjects()
  }

  shouldComponentUpdate (nextProps) {
    // Objects
    if (nextProps.objects !== this.props.objects) {
      this.updateObjects(nextProps.objects)
    }
    // showMiniMap
    if (nextProps.showMiniMap !== this.props.showMiniMap) {
      this.updateMinimap(nextProps.showMiniMap)
    }
    // isGridActive
    if (nextProps.isGridActive !== this.props.isGridActive) {
      toggleMapGrid(this.map, nextProps.isGridActive)
    }
    // sources
    if (nextProps.sources !== this.props.sources) {
      this.setMapSource(nextProps.sources)
    }
    // level, layersById, hiddenOpacity, layer
    if (
      nextProps.level !== this.props.level ||
      nextProps.layersById !== this.props.layersById ||
      nextProps.hiddenOpacity !== this.props.hiddenOpacity ||
      nextProps.layer !== this.props.layer
    ) {
      this.updateShowLayers(nextProps.level, nextProps.layersById, nextProps.hiddenOpacity, nextProps.layer)
    }
    // edit
    if (nextProps.edit !== this.props.edit ||
      nextProps.selection.newShape.type !== this.props.selection.newShape.type
    ) {
      this.setMapCursor(nextProps.edit, nextProps.selection.newShape.type)
      this.startCreatePoly(nextProps.edit, nextProps.selection.newShape.type)
      if (nextProps.selection.newShape.type) {
        clearActiveLayer(this.map, true)
      } else {
        const activeLayer = this.map.pm.activeLayer
        if (activeLayer) {
          clearActiveLayer(this.map, true)
          activateLayer(activeLayer, nextProps.edit)
        }
      }
    }
    // close 'create' form
    if (nextProps.selection.showForm === null && this.props.selection.showForm === 'create') {
      const { newShape } = nextProps.selection
      switch (newShape.type) {
        case entityKind.POINT:
          this.createPointSign(newShape)
          break
        case entityKind.TEXT:
          this.createTextSign(newShape)
          break
        default:
          break
      }
    }
    // close 'edit' form
    if (nextProps.selection.showForm === null && this.props.selection.showForm === 'edit') {
      const { data } = nextProps.selection
      switch (data.type) {
        case entityKind.POINT:
          this.updatePointSign(data)
          break
        case entityKind.TEXT:
          this.updateText(data)
          break
        default:
          this.updateFigure(data)
      }
    }
    // searchResult
    if (this.map && nextProps.searchResult && nextProps.searchResult !== this.props.searchResult) {
      if (this.searchMarker) {
        this.searchMarker.removeFrom(this.map)
      }
      let { point, text } = nextProps.searchResult
      let coordinates = this.showCoordinates(point)
      if (Array.isArray(coordinates)) {
        coordinates = coordinates.reduce((res, item) => `${res}<br/>${item}`, '')
      }
      if (coordinates !== text) {
        text = `<strong>${text}</strong><br/><br/>${coordinates}`
      }
      this.map.panTo(point, { animate: false })
      setTimeout(() => {
        this.searchMarker = createSearchMarker(point, text)
        this.searchMarker.addTo(this.map)
        setTimeout(() => this.searchMarker.bindPopup(text).openPopup(), 1000)
      }, 500)
    }
    // showAmplifiers
    if (nextProps.showAmplifiers !== this.props.showAmplifiers) {
      this.updateShowAmplifiers(nextProps.showAmplifiers)
    }
    // isMeasureOn
    if (nextProps.isMeasureOn !== this.props.isMeasureOn) {
      if (nextProps.isMeasureOn !== this.map.measureControl._measuring) {
        this.map.measureControl._toggleMeasure()
      }
    }
    // selection
    if (
      nextProps.selection.data === this.props.selection.data &&
      nextProps.orgStructureSelectedId !== this.props.orgStructureSelectedId
    ) {
      const layer = this.findLayerByUnitId(nextProps.orgStructureSelectedId, nextProps.layer)
      if (layer) {
        activateLayer(layer, nextProps.edit)
        this.map.panTo(getGeometry(layer).point)
      } else {
        clearActiveLayer(this.map)
      }
    }
    // coordinatesType
    if (nextProps.coordinatesType !== this.props.coordinatesType) {
      this.indicateMode = type2mode(nextProps.coordinatesType)
    }
    // backOpacity
    if (nextProps.backOpacity !== this.props.backOpacity && this.map && this.map._container) {
      const tilePane = this.map.getPane('tilePane')
      if (tilePane) {
        tilePane.style.opacity = nextProps.backOpacity / 100
      }
    }
    // pointSizes
    if (nextProps.pointSizes !== this.props.pointSizes && this.map && this.map._container) {
      this.updatePointSizes()
    }
    return false
  }

  componentWillUnmount () {
    this.map.remove()
  }

  updateMinimap (showMiniMap) {
    if (showMiniMap) {
      this.mini.addTo(this.map)
    } else {
      this.mini.remove()
    }
  }

  indicateMode = indicateModes.WGS

  sources = []

  toggleIndicateMode = () => {
    this.indicateMode = (this.indicateMode + 1) % indicateModes.count
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
    initMapEvents(this.map, this.clickInterhandler)
    this.map.attributionControl.setPrefix(`f:v${version} b:v${this.backVersion}`)
    this.map.on('deletelayer', this.deleteObject)
    this.map.on('activelayer', this.activeLayerHandler)
    this.map.on('selectlayer', this.selectLayerHandler)
    this.map.on('editlayer', this.editObject)
    this.map.on('zoomend', this.updatePointSizes)
    this.map.on('moveend', this.moveHandler)
    this.map.on('pm:drawend', this.props.hideForm)
    this.map.on('pm:create', this.createNewShape)
    this.map.on('pm:drawstart', this.startDrawShape)
    this.map.on('escape', this.onEscape)
    this.map.on('stop_measuring', this.onStopMeasuring)
    this.map.on('boxselectend', this.onBoxSelect)
    this.map.doubleClickZoom.disable()
  }

  calcPointSize = (zoom) => {
    const { min, max } = this.props.pointSizes
    const result = zoom <= MIN_ZOOM
      ? min
      : zoom >= MAX_ZOOM
        ? max
        : (1 / (2 - (zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM) * 1.5) - 0.5) / 1.5 * (max - min) + min
    return Math.round(result)
  }

  onBoxSelect = ({ boxSelectBounds }) => setTimeout(() => {
    const { onSelectedList, layer: activeLayerId, layersById } = this.props
    const selectedIds = []
    this.map.eachLayer((layer) => {
      if (layer.options.tsType) {
        const isInBounds = isLayerInBounds(layer, boxSelectBounds)
        const isOnActiveLayer = layer.object && (+layer.object.layer === activeLayerId)
        const isActiveLayerVisible = layersById[activeLayerId] && layersById[activeLayerId].visible
        const isSelected = isInBounds && isOnActiveLayer && isActiveLayerVisible
        setLayerSelected(layer, isSelected)
        if (isSelected) {
          selectedIds.push(layer.id)
        }
      }
    })
    onSelectedList(selectedIds)
  })

  selectLayerHandler = async ({ layer, select }) => {
    const selectedIds = []
    this.map.eachLayer((layer) => {
      if (layer.options.tsType) {
        if (layer._selected) {
          selectedIds.push(layer.id)
        }
      }
    })
    this.props.onSelectedList(selectedIds)
  }

  onEscape = () => {
    if (this.searchMarker) {
      this.searchMarker.removeFrom(this.map)
      delete this.searchMarker
    }
  }

  onStopMeasuring = () => {
    this.props.stopMeasuring()
  }

  moveHandler = () => {
    const { lat, lng } = this.map.getCenter()
    this.props.onMove({ lat, lng })
  }

  updateShowLayer = (levelEdge, layersById, hiddenOpacity, selectedLayerId, item) => {
    if (item.id && item.object) {
      const { layer, level } = item.object
      const itemLevel = Math.max(level, SubordinationLevel.TEAM_CREW)
      const hidden = itemLevel < levelEdge || !layer || !layersById[layer] || !layersById[layer].visible
      const opacity = Number(selectedLayerId) === Number(layer) ? 1 : (hiddenOpacity / 100)

      item.setOpacity && item.setOpacity(opacity)
      item.setHidden && item.setHidden(hidden)
      const color = layer && layersById[layer] ? layersById[layer].color : null
      item.setShadowColor && item.setShadowColor(color)
      if (hidden && this.map.pm.activeLayer === item) {
        clearActiveLayer(this.map)
      }
    }
  }

  updateShowLayers = (levelEdge, layersById, hiddenOpacity, selectedLayerId) => {
    if (this.map) {
      if (this.map.pm.activeLayer && Number(this.map.pm.activeLayer.object.layer) !== Number(selectedLayerId)) {
        clearActiveLayer(this.map)
      }
      this.map.eachLayer((item) => this.updateShowLayer(levelEdge, layersById, hiddenOpacity, selectedLayerId, item))
    }
  }

  updatePointSizes = () => {
    this.map.eachLayer((layer) => {
      if (layer.id && layer.options && layer.options.tsType === entityKind.POINT) {
        const { code, attributes } = layer.object
        const symbol = new Symbol(code,
          { size: this.calcPointSize(this.map.getZoom()), ...(this.props.showAmplifiers ? filterSet(attributes) : {}) })
        updateLayerIcons(layer, symbol.asSVG(), symbol.getAnchor())
      }
    })
  }

  updateShowAmplifiers = (showAmplifiers) => {
    this.map.eachLayer((layer) => {
      if (layer.id && layer.options && layer.options.tsType === entityKind.POINT) {
        const { code, attributes } = layer.object
        const symbol = new Symbol(code,
          { size: this.calcPointSize(this.map.getZoom()), ...(showAmplifiers ? filterSet(attributes) : {}) })
        updateLayerIcons(layer, symbol.asSVG(), symbol.getAnchor())
      }
    })
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
      let activeLayerId = null
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
              if (this.map.pm.activeLayer === layer) {
                activeLayerId = layer.id
                layer.pm.disable()
                delete layer._map.pm.activeLayer
              }
              layer.remove()
            }
          }
        }
      })
      objects.forEach((object, key) => {
        if (!notChangedIds.has(key)) {
          this.addObject(object)
          if (activeLayerId === key) {
            this.activateCreated(key)
          }
        }
      })
    }
  }

  addObject = (object) => {
    // console.log('addObject', object.toJS())
    const { id, type, code = '', point, geometry, affiliation, attributes } = object
    let anchor
    let template
    let points = geometry.toJS()
    let color = colorOf(affiliation)
    if (+type === entityKind.POINT) {
      const options = {
        size: this.calcPointSize(this.map.getZoom()),
        ...(this.props.showAmplifiers ? filterSet(attributes) : {}),
      }
      const symbol = new Symbol(code, options)
      template = symbol.asSVG()
      points = [ point ]
      anchor = symbol.getAnchor()
    } else if (+type === entityKind.TEXT) {
      // console.log(attributes)
      template = generateTextSymbolSvg(attributes)
      points = [ point ]
      anchor = { x: 0, y: 0 }
    } else if (+type === entityKind.SEGMENT) {
      template = attributes.template
      color = attributes.color
    }
    const layer = createTacticalSign(id, object, +type, points, template, color, this.map, anchor)
    if (layer) {
      layer.id = id
      layer.object = object
      layer.on('click', this.clickOnLayer)
      layer.on('dblclick', this.dblClickOnLayer)
      layer.addTo(this.map)
      const { level, layersById, hiddenOpacity, layer: selectedLayerId } = this.props
      this.updateShowLayer(level, layersById, hiddenOpacity, selectedLayerId, layer)
      const { color = null, fill = null, lineType = null } = attributes

      if (color !== null && color !== '') {
        layer.setColor && layer.setColor(colors.values.hasOwnProperty(color) ? colors.values[color] : color)
      }
      if (fill !== null && fill !== '') {
        layer.setFill && layer.setFill(colors.values.hasOwnProperty(fill) ? colors.values[fill] : fill)
      }
      if (lineType !== null && lineType !== '') {
        layer.setLineType && layer.setLineType(lineType)
      }
    }
  }

  clickOnLayer = (event) => {
    const { target } = event
    const targetLayer = target.object && target.object.layer
    if (Number(targetLayer) === this.props.layer) {
      activateLayer(target, this.props.edit, event.originalEvent.ctrlKey)
      L.DomEvent.stopPropagation(event)
      event.target._map._container.focus()
    }
  }

  dblClickOnLayer = (event) => {
    if (event.target._map.pm.activeLayer === event.target) {
      event.target._map.fire('editlayer', event.target)
    }
    L.DomEvent.stopPropagation(event)
  }

  deleteObject = (layer) => {
    layer.pm.disable()
    delete layer._map.pm.activeLayer
    this.props.deleteObject(layer.id)
  }

  activeLayerHandler = async ({ oldLayer, newLayer }) => {
    this.props.onSelection(newLayer || null)
    if (oldLayer) {
      const data = this.getLayerData(oldLayer)
      const object = oldLayer.object
      if (!tacticalSignEquals(object, data)) {
        this.props.updateObjectGeometry(data)
      }
    }
    this.props.onSelectedList(newLayer ? [ newLayer.id ] : [])
  }

  editObject = (layer) => {
    // console.log('edit object', layer)
    this.props.onSelection(layer)
    this.props.editObject()
  }

  getLayerData = (layer) => {
    const { id, options: { tsType: type } } = layer
    return { id, type, ...getGeometry(layer) }
  }

  clickInterhandler = (event) => {
    const { latlng } = event
    const { edit, selection: { newShape: { type } }, setNewShapeCoordinates, showCreateForm } = this.props
    if (edit) {
      switch (type) {
        case entityKind.TEXT:
        case entityKind.POINT:
          setNewShapeCoordinates(latlng)
          showCreateForm()
          break
        default:
          break
      }
    }
  }

  createPointSign = async (data) => {
    // console.log('createPointSign', data)
    const { addObject } = this.props
    const { code, amplifiers, orgStructureId, subordinationLevel, coordinates: p } = data
    if (!p) {
      return
    }
    const point = { lat: p.lat, lng: p.lng }
    const created = await addObject({
      type: entityKind.POINT,
      code,
      attributes: filterObj(amplifiers),
      point,
      level: subordinationLevel || 0,
      unit: orgStructureId || null,
      layer: this.props.layer,
      affiliation: +code.slice(3, 4) || 0,
      geometry: [ point ],
    })
    this.activateCreated(created)
    // TODO: скинути дані в сторі
  }

  createTextSign = async (data) => {
    // console.log('createTextSign', data)
    const { addObject } = this.props
    const { amplifiers, subordinationLevel, coordinatesArray } = data
    const p = coordinatesArray[0]
    if (!p) {
      return
    }
    const point = { lat: p.lat, lng: p.lng }
    const created = await addObject({
      type: entityKind.TEXT,
      attributes: filterObj(amplifiers),
      point,
      level: subordinationLevel || 0,
      unit: null,
      layer: this.props.layer,
      affiliation: 0,
      geometry: [ point ],
    })
    this.activateCreated(created)
  }

  findLayerById = (id) => {
    for (const lkey of Object.keys(this.map._layers)) {
      const layer = this.map._layers[lkey]
      if (+layer.id === +id) {
        return layer
      }
    }
  }

  findLayerByUnitId = (id, layerId) => {
    for (const lkey of Object.keys(this.map._layers)) {
      const layer = this.map._layers[lkey]
      if (layer.object && layer.object.unit === id && Number(layer.object.layer) === layerId) {
        return layer
      }
    }
  }

  updatePointSign = async (data) => {
    // console.log('updatePointSign', data)
    const { id, code, coordinates, orgStructureId, amplifiers, subordinationLevel, ...rest } = data
    const point = { lng: +coordinates.lng, lat: +coordinates.lat }
    const layer = this.findLayerById(id)
    if (layer) {
      layer.pm.disable()
      delete layer._map.pm.activeLayer
    }
    await this.props.updateObject({
      id,
      code,
      point,
      attributes: filterObj(amplifiers),
      layer: layer.object.layer,
      geometry: [ point ],
      ...rest,
      level: subordinationLevel || 0,
      unit: orgStructureId || null,
      affiliation: +code.slice(3, 4) || 0,
    })
    this.activateCreated(id)
    // TODO: скинути дані в сторі
  }

  updateFigure = async (data) => {
    const { id, amplifiers, coordinates: _, coordinatesArray, subordinationLevel, ...rest } = data
    if (!id) {
      return
    }
    const points = coordinatesArray.map(({ lng, lat }) => ({ lng: parseFloat(lng), lat: parseFloat(lat) }))
    const layer = this.findLayerById(id)
    if (layer) {
      layer.pm.disable()
      delete layer._map.pm.activeLayer
    }
    await this.props.updateObject({
      id,
      point: points[0],
      layer: layer.object.layer,
      geometry: points,
      attributes: filterObj(amplifiers),
      ...rest,
      level: subordinationLevel || 0,
    })
    this.activateCreated(id)
    // TODO: скинути дані в сторі
  }

  updateText = async (data) => {
    // console.log('updateText', data)
    const { id, amplifiers, subordinationLevel, coordinatesArray, ...rest } = data
    const points = coordinatesArray.map(({ lng, lat }) => ({ lng: parseFloat(lng), lat: parseFloat(lat) }))
    const layer = this.findLayerById(id)
    if (layer) {
      layer.pm.disable()
      delete layer._map.pm.activeLayer
    }
    await this.props.updateObject({
      id,
      point: points[0],
      level: subordinationLevel || 0,
      layer: layer.object.layer,
      geometry: points,
      attributes: filterObj(amplifiers),
      ...rest,
    })
    this.activateCreated(id)
    // TODO: скинути дані в сторі
  }

  // TODO: пибрати це після тестування
  handleShortcuts = async (action) => {
    const { addObject } = this.props
    const bounds = this.map.getBounds()
    const center = bounds.getCenter()
    const width = bounds.getEast() - bounds.getWest()
    const height = bounds.getNorth() - bounds.getSouth()
    let created
    switch (action) {
      case ADD_POINT:
        console.info('ADD_POINT')
        break
      case ADD_SEGMENT: {
        console.info('ADD_SEGMENT')
        const geometry = [
          { lat: center.lat, lng: center.lng - width / 10 },
          { lat: center.lat, lng: center.lng + width / 10 },
        ]
        created = await addObject({
          type: entityKind.SEGMENT,
          point: calcMiddlePoint(geometry),
          geometry,
          attributes: {
            template: tmp,
            color: 'red',
          },
        })
        break
      }
      case ADD_AREA: {
        console.info('ADD_AREA')
        const geometry = [
          { lat: center.lat - height / 10, lng: center.lng },
          { lat: center.lat + height / 10, lng: center.lng - width / 10 },
          { lat: center.lat + height / 10, lng: center.lng + width / 10 },
        ]
        created = await addObject({
          type: entityKind.AREA,
          point: calcMiddlePoint(geometry),
          geometry,
        })
        break
      }
      case ADD_CURVE: {
        console.info('ADD_CURVE')
        const geometry = [
          { lat: center.lat, lng: center.lng - width / 10 },
          { lat: center.lat, lng: center.lng + width / 10 },
        ]
        created = await addObject({
          type: entityKind.CURVE,
          point: calcMiddlePoint(geometry),
          geometry,
        })
        break
      }
      case ADD_POLYGON: {
        console.info('ADD_POLYGON')
        const geometry = [
          { lat: center.lat - height / 10, lng: center.lng },
          { lat: center.lat + height / 10, lng: center.lng - width / 10 },
          { lat: center.lat + height / 10, lng: center.lng + width / 10 },
        ]
        created = await addObject({
          type: entityKind.POLYGON,
          point: calcMiddlePoint(geometry),
          geometry,
        })
        break
      }
      case ADD_POLYLINE: {
        console.info('ADD_POLYLINE')
        const geometry = [
          { lat: center.lat, lng: center.lng - width / 10 },
          { lat: center.lat, lng: center.lng + width / 10 },
        ]
        created = await addObject({
          type: entityKind.POLYLINE,
          point: calcMiddlePoint(geometry),
          geometry,
        })
        break
      }
      case ADD_CIRCLE: {
        console.info('ADD_CIRCLE')
        const geometry = [
          { lat: center.lat, lng: center.lng },
          { lat: center.lat, lng: center.lng + width / 10 },
        ]
        created = await addObject({
          type: entityKind.CIRCLE,
          point: calcMiddlePoint(geometry),
          geometry,
        })
        break
      }
      case ADD_RECTANGLE: {
        console.info('ADD_RECTANGLE')
        const geometry = [
          { lat: center.lat - width / 15, lng: center.lng - width / 10 },
          { lat: center.lat + width / 15, lng: center.lng + width / 10 },
        ]
        created = await addObject({
          type: entityKind.RECTANGLE,
          point: calcMiddlePoint(geometry),
          geometry,
        })
        break
      }
      case ADD_SQUARE: {
        console.info('ADD_SQUARE')
        const geometry = [
          { lat: center.lat - width / 10, lng: center.lng - width / 10 },
          { lat: center.lat + width / 10, lng: center.lng + width / 10 },
        ]
        created = await addObject({
          type: entityKind.SQUARE,
          point: calcMiddlePoint(geometry),
          geometry,
        })
        break
      }
      case ADD_TEXT:
        console.info('ADD_TEXT')
        break
      case SELECT_PRINT_AREA:
        tempPrintFlag = !tempPrintFlag
        toggleMapGrid(this.map, tempPrintFlag)
        break
      default:
        console.error(`Unknown action: ${action}`)
    }
    this.activateCreated(created)
  }

  startCreatePoly = (edit, type) => {
    if (this.map && edit) {
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
        default:
          break
      }
    }
  }

  startDrawShape = (e) => {
    e.workingLayer.options.tsType = this.createPolyType
    // console.log('startDrawShape', e.workingLayer.options)
  }

  createNewShape = async (e) => {
    const { addObject } = this.props
    e.layer.options.tsType = this.createPolyType
    // console.log('createNewShape', e.layer.options)
    e.layer.removeFrom(this.map)
    this.activateCreated(await addObject({
      type: this.createPolyType,
      layer: this.props.layer,
      ...getGeometry(e.layer),
    }))
  }

  activateCreated = (created) => {
    if (created) {
      const layer = this.findLayerById(created)
      if (layer) {
        activateLayer(layer, this.props.edit)
        this.map.panTo(getGeometry(layer).point)
      }
      this.props.onSelection(layer || null)
    } else {
      this.props.onSelection(null)
    }
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

  render () {
    return (
      <Shortcuts
        name='WebMap'
        handler={this.handleShortcuts}
        stopPropagation={false}
      >
        <div
          onDragOver={this.dragOverHandler}
          onDrop={this.dropHandler}
          ref={(container) => (this.container = container)}
          style={{ height: '100%' }}
        />
      </Shortcuts>
    )
  }
}
