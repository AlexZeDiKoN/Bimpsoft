import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Shortcuts } from 'react-shortcuts'
import 'leaflet/dist/leaflet.css'
import 'leaflet.pm/dist/leaflet.pm.css'
import './leaflet.pm.patch.css'
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
  LOAD_TEST_OBJECTS, SELECT_PRINT_AREA,
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
import './bouncemarker'
import {
  entityKind, initMapEvents, createTacticalSign, getGeometry, calcMiddlePoint, activateLayer, clearActiveLayer,
  updateLayerIcons, createSearchMarker,
} from './leaflet.pm.patch'

const mgrsAccuracy = 5 // Точність задання координат у системі MGRS, цифр (значення 5 відповідає точності 1 метр)
const wgsAccuracy = 5 // Точність задання координат у системі WGS-84, десяткових знаків
const pointSizes = { // Розмір точкового тактичного знака НАТО в залежності від масштабу (від і до)
  zoom0: 2,
  zoom20: 64,
}
const hintlineStyle = { // стиль лінії-підказки при створенні лінійних і площинних тактичних знаків
  color: 'red',
  dashArray: [ 5, 5 ],
}

const calcPointSize = (zoom) => zoom <= 0
  ? pointSizes.zoom0
  : zoom >= 20
    ? pointSizes.zoom20
    : Math.round((zoom / 20) * (pointSizes.zoom20 - pointSizes.zoom0) + pointSizes.zoom0)

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
const Wgs84 = (lat, lng) => `\xA0${i18n.LATITUDE}: ${lat.toFixed(wgsAccuracy)}\xA0\xA0\xA0${i18n.LONGITUDE}: ${lng.toFixed(wgsAccuracy)}`
const Wgs84I = (lat, lng) => `\xA0${toGMS(lat, 'N', 'S')}\xA0\xA0\xA0${toGMS(lng, 'E', 'W')}`
const Mgrs = (lat, lng) => `\xA0MGRS:\xA0${forward([ lng, lat ], mgrsAccuracy)}`
const Utm = (lat, lng) => `UTM:\xA0${utmLabel(fromLatLon(lat, lng))}`
const Sc42 = (lat, lng) => `СК-42:\xA0${scLabel(sc42(lng, lat))}`
const Usc2000 = (lat, lng) => `УСК-2000:\xA0${scLabel(usc2000(lng, lat))}`

function geomPointEquals (point, data) {
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
        maxZoom: PropTypes.number,
        tms: PropTypes.bool,
      })
    ),
    visibleLayers: PropTypes.string,
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
    coordinatesType: PropTypes.string,
    showAmplifiers: PropTypes.bool,
    print: PropTypes.bool,
    edit: PropTypes.bool,
    selection: PropTypes.shape({
      showForm: PropTypes.string,
      newShape: PropTypes.shape({
        type: PropTypes.any,
      }),
      data: PropTypes.shape({
        type: PropTypes.any,
        orgStructureId: PropTypes.string,
      }),
    }),
    // Redux actions
    addObject: PropTypes.func,
    deleteObject: PropTypes.func,
    editObject: PropTypes.func,
    updateObject: PropTypes.func,
    updateObjectGeometry: PropTypes.func,
    onSelection: PropTypes.func,
    setNewShapeCoordinates: PropTypes.func,
    showCreateForm: PropTypes.func,
    hideForm: PropTypes.func,
    onMove: PropTypes.func,
    onDropUnit: PropTypes.func,
    // TODO: пибрати це після тестування
    loadTestObjects: PropTypes.func,
    isGridActive: PropTypes.bool.isRequired,
  }

  componentDidMount () {
    this.setMapView()
    this.setMapSource(this.props.sources)
    this.initObjects()
  }

  shouldComponentUpdate (nextProps) {
    if (nextProps.objects !== this.props.objects) {
      this.updateObjects(nextProps.objects)
    }
    if (nextProps.showMiniMap !== this.props.showMiniMap) {
      this.updateMinimap(nextProps.showMiniMap)
    }
    if (nextProps.isGridActive !== this.props.isGridActive) {
      toggleMapGrid(this.map, nextProps.isGridActive)
    }
    if (nextProps.sources !== this.props.sources) {
      this.setMapSource(nextProps.sources)
    }
    if (nextProps.level !== this.props.level || nextProps.visibleLayers !== this.props.visibleLayers) {
      this.updateShowLayers(nextProps.level, nextProps.visibleLayers)
    }
    if (nextProps.edit !== this.props.edit ||
      nextProps.selection.newShape.type !== this.props.selection.newShape.type
    ) {
      this.setMapCursor(nextProps.edit, nextProps.selection.newShape.type)
      this.startCreatePoly(nextProps.edit, nextProps.selection.newShape.type)
    }
    if (nextProps.selection.showForm === null && this.props.selection.showForm === 'create' &&
      nextProps.selection.newShape.type === entityKind.POINT
    ) {
      this.createPointSign(nextProps.selection.newShape)
    }
    if (nextProps.selection.showForm === null && this.props.selection.showForm === 'edit') {
      const { data } = nextProps.selection
      switch (data.type) {
        case entityKind.POINT:
          this.updatePointSign(data)
          break
        case entityKind.CIRCLE:
          this.updateCircle(data)
          break
        default:
          break
      }
    }
    if (this.map && nextProps.searchResult && nextProps.searchResult !== this.props.searchResult) {
      if (this.searchMarker) {
        this.searchMarker.removeFrom(this.map)
      }
      const { point, text } = nextProps.searchResult
      this.map.panTo(point, { animate: false })
      setTimeout(() => {
        this.searchMarker = createSearchMarker(point, text)
        this.searchMarker.addTo(this.map)
        setTimeout(() => this.searchMarker.bindPopup(text).openPopup(), 1000)
      }, 500)
    }
    if (nextProps.showAmplifiers !== this.props.showAmplifiers) {
      this.updateShowAmplifiers(nextProps.showAmplifiers)
    }
    if (nextProps.selection.data !== this.props.selection.data) {
      if (nextProps.selection.data === null) {
        clearActiveLayer(this.map, true)
      } else {
        const unitId = nextProps.selection.data.orgStructureId
        if (unitId) {
          const layer = this.findLayerByUnitId(unitId)
          if (layer) {
            activateLayer(layer)
            this.map.panTo(getGeometry(layer).point)
          }
        }
      }
    }
    if (nextProps.coordinatesType !== this.props.coordinatesType) {
      this.indicateMode = type2mode(nextProps.coordinatesType)
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
    DomEvent.addListener(this.coordinates._container, 'click', () => {
      this.toggleIndicateMode()
      this.coordinates._update({ latlng: this.coordinates._currentPos })
    }, this.coordinates)
    this.map.setView(this.props.center, this.props.zoom)
    initMapEvents(this.map, this.clickInterhandler)
    this.map.attributionControl.setPrefix(`v${version}`)
    this.map.on('deletelayer', this.deleteObject)
    this.map.on('activelayer', this.updateObject)
    this.map.on('editlayer', this.editObject)
    this.map.on('zoomend', this.updatePointSizes)
    this.map.on('moveend', this.moveHandler)
    this.map.on('pm:drawend', this.props.hideForm)
    this.map.on('pm:create', this.createNewShape)
    this.map.on('pm:drawstart', this.startDrawShape)
    this.map.on('escape', this.onEscape)
  }

  onEscape = () => {
    if (this.searchMarker) {
      this.searchMarker.removeFrom(this.map)
      delete this.searchMarker
    }
  }

  moveHandler = () => {
    const { lat, lng } = this.map.getCenter()
    this.props.onMove({ lat, lng })
  }

  updateShowLayers = (levelEdge, visibleLayers) => {
    if (this.map) {
      const layers = visibleLayers.split(',')
      this.map.eachLayer((item) => {
        if (item.id && item.object) {
          const { layer, level } = item.object
          const itemLevel = Math.max(level, SubordinationLevel.TEAM_CREW)
          const invisible = itemLevel < levelEdge || !layer || !layers.includes(layer)
          item.getElement().style.display = invisible ? 'none' : ''
        }
      })
    }
  }

  updatePointSizes = () => {
    this.map.eachLayer((layer) => {
      if (layer.id && layer.options && layer.options.tsType === entityKind.POINT) {
        const { code, attributes } = layer.object
        const symbol = new Symbol(code,
          { size: calcPointSize(this.map.getZoom()), ...(this.props.showAmplifiers ? filterSet(attributes) : {}) })
        updateLayerIcons(layer, symbol.asSVG(), symbol.getAnchor())
      }
    })
  }

  updateShowAmplifiers = (showAmplifiers) => {
    this.map.eachLayer((layer) => {
      if (layer.id && layer.options && layer.options.tsType === entityKind.POINT) {
        const { code, attributes } = layer.object
        const symbol = new Symbol(code,
          { size: calcPointSize(this.map.getZoom()), ...(showAmplifiers ? filterSet(attributes) : {}) })
        updateLayerIcons(layer, symbol.asSVG(), symbol.getAnchor())
      }
    })
  }

  showCoordinates = ({ lng, lat }) => {
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
        const sourceLayer = new TileLayer(source, rest)
        sourceLayer.addTo(this.map)
        this.sources.push(sourceLayer)
        if (!this.mini) {
          this.miniSource = new TileLayer(source, { ...rest, minZoom: 0, maxZoom: 15 })
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
      const ids = []
      this.map.eachLayer((layer) => {
        if (layer.id) {
          const object = objects.get(layer.id)
          if (!object || layer.object !== object) {
            if (object && object.equals(layer.object)) {
              // console.log(`Leave unchanged object #${layer.id}`)
              layer.object = object
            } else {
              // console.log(`Remove object #${layer.id}`)
              layer.remove()
            }
          } else {
            ids.push(layer.id)
          }
        }
      })
      objects.forEach((object, key) => {
        // console.info(key, object.toJS())
        if (!ids.includes(key)) {
          // console.log(`Create object #${key}`)
          this.addObject(object)
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
        size: calcPointSize(this.map.getZoom()),
        ...(this.props.showAmplifiers ? filterSet(attributes) : {}),
      }
      const symbol = new Symbol(code, options)
      template = symbol.asSVG()
      points = [ point ]
      anchor = symbol.getAnchor()
    } else if (+type === entityKind.SEGMENT) {
      template = attributes.template
      color = attributes.color
    }
    createTacticalSign(id, object, +type, points, template, color, this.map, anchor)
  }

  deleteObject = (layer) => {
    layer.pm.disable()
    delete layer._map.pm.activeLayer
    this.props.deleteObject(layer.id)
  }

  updateObject = async ({ oldLayer, newLayer }) => {
    this.props.onSelection(newLayer || null)
    if (oldLayer) {
      const data = this.getLayerData(oldLayer)
      const object = oldLayer.object
      if (!tacticalSignEquals(object, data)) {
        this.props.updateObjectGeometry(data)
      }
    }
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

  findLayerById = (id) => {
    for (const lkey of Object.keys(this.map._layers)) {
      const layer = this.map._layers[lkey]
      if (+layer.id === +id) {
        return layer
      }
    }
  }

  findLayerByUnitId = (id) => {
    for (const lkey of Object.keys(this.map._layers)) {
      const layer = this.map._layers[lkey]
      if (layer.object && layer.object.unit === id) {
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

  updateCircle = async (data) => {
    const { id, coordinates, coordinatesArray, ...rest } = data
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
      ...rest,
    })
    this.activateCreated(id)
    // TODO: скинути дані в сторі
  }

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
      // TODO: пибрати це після тестування
      case SELECT_PRINT_AREA:
        tempPrintFlag = !tempPrintFlag
        toggleMapGrid(this.map, tempPrintFlag)
        break
      case LOAD_TEST_OBJECTS: {
        console.info('LOAD_TEST_OBJECTS')
        this.props.loadTestObjects()
        break
      }
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
        activateLayer(layer)
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
