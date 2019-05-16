/* global L */
import React from 'react'
import PropTypes from 'prop-types'
import 'leaflet/dist/leaflet.css'
import 'leaflet.pm/dist/leaflet.pm.css'
import './Tactical.css'
import { Map, TileLayer, Control, DomEvent, control } from 'leaflet'
import * as debounce from 'debounce'
import { utils } from '@DZVIN/CommonComponents'
import FlexGridToolTip from '../../components/FlexGridTooltip'
import i18n from '../../i18n'
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
import { validateObject } from '../../utils/validation'
import { flexGridPropTypes } from '../../store/selectors'
import { settings } from '../../utils/svg/lines'
import {
  BACK_LIGHT_STYLE_LINE,
  BACK_LIGHT_STYLE_POLYGON,
  LINE_STRING,
  MULTI_LINE_STRING,
} from '../../constants/TopoObj'
import SelectionTypes from '../../constants/SelectionTypes'
import { catalogSign } from '../CatalogsComponent/Item'
import entityKind, { entityKindFillable } from './entityKind'
import UpdateQueue from './patch/UpdateQueue'
import {
  createTacticalSign,
  createCatalogIcon,
  getGeometry,
  createSearchMarker,
  setLayerSelected,
  isGeometryChanged,
  geomPointEquals,
  createCoordinateMarker,
  formFlexGridGeometry,
} from './Tactical'
import { MapProvider } from './MapContext'

const { Coordinates: Coord } = utils

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
  CS42: 4,
  UCS2000: 5,
  ALL: 6,
}

const type2mode = (type, oldMode) => {
  switch (type) {
    case Coord.types.CS_42:
      return indicateModes.CS42
    case Coord.types.UCS_2000:
      return indicateModes.UCS2000
    case Coord.types.MGRS:
      return indicateModes.MGRS
    case Coord.types.UTM:
      return indicateModes.UTM
    default:
      return oldMode === indicateModes.WGSI ? indicateModes.WGSI : indicateModes.WGS
  }
}

const mode2type = (mode) => {
  switch (mode) {
    case indicateModes.CS42:
      return Coord.types.CS_42
    case indicateModes.UCS2000:
      return Coord.types.UCS_2000
    case indicateModes.MGRS:
      return Coord.types.MGRS
    case indicateModes.UTM:
      return Coord.types.UTM
    default:
      return Coord.types.WGS_84
  }
}

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

const serializeCoordinate = (mode, lat, lng) => {
  const type = mode2type(mode)
  const serialized = mode === indicateModes.WGSI
    ? `${toGMS(lat, 'N', 'S')}   ${toGMS(lng, 'E', 'W')}`
    : Coord.stringify({ type, lat, lng })
  return `${Coord.names[type]}: ${serialized}`.replace(' ', '\xA0')
}

const setScaleOptions = (layer, params) => {
  if (!layer.object || !layer.object.type) {
    return
  }
  switch (Number(layer.object.type)) {
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

export default class WebMap extends React.PureComponent {
  static propTypes = {
    children: PropTypes.any,
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
    isMarkersOn: PropTypes.bool,
    isTopographicObjectsOn: PropTypes.bool,
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
      preview: PropTypes.object,
      previewCoordinateIndex: PropTypes.any,
    }),
    isGridActive: PropTypes.bool.isRequired,
    backVersion: PropTypes.string,
    contactId: PropTypes.number,
    lockedObjects: PropTypes.object,
    activeObjectId: PropTypes.string,
    printStatus: PropTypes.bool,
    printScale: PropTypes.number,
    flexGridParams: PropTypes.shape({
      directions: PropTypes.number,
      zones: PropTypes.number,
      vertical: PropTypes.bool,
      selectedDirections: PropTypes.array,
    }),
    flexGridVisible: PropTypes.bool,
    flexGridData: flexGridPropTypes,
    activeMapId: PropTypes.any,
    inICTMode: PropTypes.any,
    topographicObjects: PropTypes.object,
    catalogObjects: PropTypes.object,
    catalogs: PropTypes.object,
    // Redux actions
    editObject: PropTypes.func,
    updateObjectGeometry: PropTypes.func,
    onChangeLayer: PropTypes.func,
    onSelectedList: PropTypes.func,
    onFinishDrawNewShape: PropTypes.func,
    onMove: PropTypes.func,
    onRemoveMarker: PropTypes.func,
    onDropUnit: PropTypes.func,
    onSelectUnit: PropTypes.func,
    stopMeasuring: PropTypes.func,
    requestAppInfo: PropTypes.func,
    requestMaSources: PropTypes.func,
    tryLockObject: PropTypes.func,
    tryUnlockObject: PropTypes.func,
    getLockedObjects: PropTypes.func,
    flexGridCreated: PropTypes.func,
    flexGridChanged: PropTypes.func,
    flexGridDeleted: PropTypes.func,
    fixFlexGridInstance: PropTypes.func,
    showDirectionNameForm: PropTypes.func,
    selectDirection: PropTypes.func,
    getTopographicObjects: PropTypes.func,
    toggleTopographicObjModal: PropTypes.func,
    disableDrawUnit: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.view = {
      center: { lat: 0, lng: 0 },
      zoom: 0,
    }
    this.activeLayer = null
  }

  async componentDidMount () {
    const { sources, requestAppInfo, requestMaSources, getLockedObjects } = this.props

    await requestAppInfo()
    this.setMapView()
    this.setMapSource(sources)
    await requestMaSources()
    await getLockedObjects()
    this.initObjects()
    this.initCatalogObjects()
    this.updateScaleOptions()
    window.addEventListener('beforeunload', () => {
      this.onSelectedListChange([])
    })
    window.webMap = this
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (!this.map || !this.map._container) {
      return // Exit if map is not yet initialized
    }

    const {
      objects, showMiniMap, showAmplifiers, sources, level, layersById, hiddenOpacity, layer, edit, coordinatesType,
      isMeasureOn, isMarkersOn, isTopographicObjectsOn, backOpacity, params, lockedObjects, flexGridVisible,
      flexGridData, catalogObjects,
      flexGridParams: { selectedDirections },
      selection: { newShape, preview, previewCoordinateIndex },
      topographicObjects: { selectedItem, features },
    } = this.props

    if (objects !== prevProps.objects || preview !== prevProps.selection.preview) {
      this.updateObjects(objects, preview)
    }
    if (showMiniMap !== prevProps.showMiniMap) {
      this.updateMinimap(showMiniMap)
    }
    if (showAmplifiers !== prevProps.showAmplifiers) {
      this.updateShowAmplifiers(showAmplifiers)
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
    if (
      preview !== prevProps.selection.preview ||
      previewCoordinateIndex !== prevProps.selection.previewCoordinateIndex
    ) {
      this.updateCoordinateIndex(preview, previewCoordinateIndex)
    }
    this.updateMarker(prevProps)
    if (isMeasureOn !== prevProps.isMeasureOn && isMeasureOn !== this.map.measureControl._measuring) {
      this.byReact = true
      this.map.measureControl._toggleMeasure()
      this.byReact = false
    }
    if (isMarkersOn !== prevProps.isMarkersOn) {
      this.updateMarkersOn(isMarkersOn)
    }
    if (isTopographicObjectsOn !== prevProps.isTopographicObjectsOn) {
      this.updateTopographicMarkersOn(isTopographicObjectsOn)
    }
    this.updateSelection(prevProps)
    this.updateActiveObject(prevProps)
    if (coordinatesType !== prevProps.coordinatesType) {
      this.indicateMode = type2mode(coordinatesType, this.indicateMode)
    }
    if (backOpacity !== prevProps.backOpacity) {
      this.updateBackOpacity(backOpacity)
    }
    if (params !== prevProps.params) {
      this.updateScaleOptions()
    }
    this.updateViewport(prevProps)
    if (lockedObjects !== prevProps.lockedObjects) {
      this.updateLockedObjects(lockedObjects)
    }
    if (flexGridData !== prevProps.flexGridData) {
      this.updateFlexGrid(flexGridData)
    }
    if (flexGridVisible !== prevProps.flexGridVisible) {
      this.showFlexGrid(flexGridVisible)
    }
    if (selectedDirections !== prevProps.flexGridParams.selectedDirections) {
      this.highlightDirections(selectedDirections)
    }
    if (
      selectedItem !== prevProps.topographicObjects.selectedItem ||
      features !== prevProps.topographicObjects.features
    ) {
      const { selectedItem, features } = this.props.topographicObjects
      features
        ? this.backLightingTopographicObject(features[selectedItem])
        : this.removeBacklightingTopographicObject()
    }
    if (catalogObjects !== prevProps.catalogObjects) {
      this.updateCatalogObjects(catalogObjects)
    }
    this.crosshairCursor(isMeasureOn || isMarkersOn || isTopographicObjectsOn)
  }

  componentWillUnmount () {
    delete window.webMap
    this.map.remove()
  }

  indicateMode = indicateModes.WGS

  sources = []

  updateMinimap = (showMiniMap) => showMiniMap ? this.mini.addTo(this.map) : this.mini.remove()

  updateLockedObjects = (lockedObjects) => Object.keys(this.map._layers)
    .filter((key) => this.map._layers[ key ]._locked)
    .forEach((key) => {
      const { activeObjectId } = this.props
      const layer = this.map._layers[ key ]
      const isLocked = lockedObjects.get(layer.id)
      if (!isLocked) {
        layer.setLocked && layer.setLocked(false)
        layer.id === activeObjectId && this.onSelectedListChange([])
      }
    })

  toggleIndicateMode = () => {
    this.indicateMode = (this.indicateMode + 1) % indicateModes.count
  }

  updateCoordinateIndex (preview = null, coordinateIndex = null) {
    const point =
      preview !== null &&
      coordinateIndex !== null &&
      preview.geometry.get(coordinateIndex)
    const coordinateIsCorrect = Boolean(point) && Coord.check(point)
    if (coordinateIsCorrect !== Boolean(this.coordinateMarker)) {
      if (coordinateIsCorrect) {
        this.coordinateMarker = createCoordinateMarker(point)
        this.coordinateMarker.addTo(this.map)
      } else {
        this.coordinateMarker.removeFrom(this.map)
        this.coordinateMarker = null
      }
    } else {
      if (coordinateIsCorrect) {
        this.coordinateMarker.setLatLng(point)
      }
    }
  }

  createSearchMarkerText = (point, text) => {
    let coordinates = this.showCoordinates(point)
    if (Array.isArray(coordinates)) {
      coordinates = coordinates.join(`<br/>`)
    }
    if (coordinates !== text) {
      return `<strong>${text}</strong><br/><br/>${coordinates}`
    }
    return ''
  }

  updateMarker = (prevProps) => {
    const { marker, isMarkersOn } = this.props
    if (marker !== prevProps.marker) {
      if (!isMarkersOn) {
        if (marker) {
          this.markers && this.markers.removeFrom(this.map)
          let { point, text } = marker
          text = this.createSearchMarkerText(point, text)
          setTimeout(() => {
            this.markers = createSearchMarker(point, text)
            this.markers.addTo(this.map)
            setTimeout(() => this.markers && this.markers.bindPopup(text).openPopup(), 1000)
          }, 500)
        } else {
          if (this.markers) {
            this.markers.removeFrom(this.map)
            delete this.markers
          }
        }
      } else {
        let { point, text } = marker
        text = this.createSearchMarkerText(point, text)
        setTimeout(() => {
          const searchMarker = createSearchMarker(point, text)
          searchMarker.addTo(this.map)
          this.markers.push(searchMarker)
          setTimeout(() => searchMarker.bindPopup(text).openPopup(), 500)
        }, 1000)
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
          layer.options.tsType && selectedIdsSet.has(layer.id) && points.push(...getGeometry(layer).geometry),
        )
        if (points.length > 0) {
          const bounds = L.latLngBounds(points)
          if (bounds.isValid() && !this.map.getBounds().contains(bounds)) {
            const center = bounds.getCenter()
            const zoom = Math.min(this.map.getBoundsZoom(bounds), this.map.getZoom())
            setTimeout(() => this.props.onMove(center.wrap(), zoom), 0)
          }
        }
      }
    }

    if (!geomPointEquals(center, this.view.center) || zoom !== this.view.zoom) {
      this.view = { center, zoom }
      this.map.setView(this.view.center, this.view.zoom, { animate: false })
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
    this.map.on('pm:drawstart', this.onDrawStart)
    this.map.on('click', this.onMouseClick)
    this.map.on('stop_measuring', this.onStopMeasuring)
    this.map.on('boxselectstart', this.onBoxSelectStart)
    this.map.on('boxselectend', this.onBoxSelectEnd)
    this.map.on('dblclick', this.onDblClick)
    this.map.doubleClickZoom.disable()
    this.updater = new UpdateQueue(this.map)
  }

  enableLookAfterMouseMove = (func) => this.map && func && this.map.on('mousemove', func)

  disableLookAfterMouseMove = (func) => this.map && func && this.map.off('mousemove', func)

  checkSaveObject = () => {
    const { selection: { list }, updateObjectGeometry, tryUnlockObject, flexGridData } = this.props
    const id = list[0]
    const layer = this.findLayerById(id)
    if (layer) {
      let checkPoint = null
      let checkGeometry
      if (layer.object) {
        const { point, geometry } = layer.object
        if (!point || !point.toJS || !geometry || !geometry.toArray) {
          console.warn(`layer.object`, layer.object)
        }
        checkPoint = point && point.toJS && point.toJS()
        checkGeometry = geometry && geometry.toArray && geometry.toArray()
      } else if (layer === this.flexGrid) {
        const { eternals, directionSegments, zoneSegments } = flexGridData
        checkGeometry = [ eternals.toArray(), directionSegments.toArray(), zoneSegments.toArray() ]
      }
      const geometryChanged = isGeometryChanged(layer, checkPoint, checkGeometry)
      if (geometryChanged) {
        return updateObjectGeometry(id, getGeometry(layer))
      } else {
        return tryUnlockObject(id)
      }
    }
  }

  checkSaveEditedObject = async () => {
    const { edit, selection: { list } } = this.props
    if (edit && list.length === 1) {
      const layer = this.findLayerById(list[0])
      if (layer && layer.object) {
        await this.checkSaveObject()
        return layer.object.id
      }
    }
  }

  adjustEditMode = (edit, { type }) => {
    const { selection: { list } } = this.props
    if (!edit && list.length === 1) {
      this.checkSaveObject()
    }
    this.setMapCursor(edit, type)
    this.updateCreatePoly(edit && type)
  }

  onSelectedListChange (newList) {
    const {
      selection: { list },
      onSelectedList, onSelectUnit, edit,
    } = this.props
    if (newList.length === 0 && list === 0) {
      return
    }

    // save geometry when one selected item lost focus
    if (list.length === 1 && list[0] !== newList[0] && edit) {
      this.checkSaveObject()
    }

    // get unit from new selection
    let selectedUnit = null
    if (newList.length === 1 && list[0] !== newList[0]) {
      const id = newList[0]
      const layer = this.findLayerById(id)
      selectedUnit = (layer && layer.object && layer.object.unit) || null
    }
    onSelectUnit(selectedUnit)

    onSelectedList(newList)
  }

  updateMarkersOn = (isMarkersOn) => {
    this.addMarkerMode = isMarkersOn
    if (!isMarkersOn && this.markers && this.markers.length && this.map) {
      this.markers.forEach((marker) => marker.removeFrom(this.map))
      delete this.markers
    } else {
      const { marker, onRemoveMarker } = this.props
      this.markers = []
      marker && onRemoveMarker()
    }
  }

  updateTopographicMarkersOn = (isTopographicMarkersOn) => {
    this.addTopographicMarkersMode = isTopographicMarkersOn
    if (!isTopographicMarkersOn && this.topographicMarkers && this.topographicMarkers.length && this.map) {
      this.topographicMarkers.forEach((marker) => marker.removeFrom(this.map))
      delete this.topographicMarkers
    } else {
      this.topographicMarkers = []
    }
  }

  createUserMarkerText = (point) => {
    let coordinates = this.showCoordinates(point)
    if (Array.isArray(coordinates)) {
      coordinates = coordinates.join(`<br/>`)
    }
    const text = 'Орієнтир' // TODO
    return `<strong>${text}</strong><br/><br/>${coordinates}`
  }

  addUserMarker = (point) => {
    const text = this.createUserMarkerText(point)
    setTimeout(() => {
      const marker = createSearchMarker(point, text)
      marker.addTo(this.map)
      this.markers.push(marker)
      setTimeout(() => marker.bindPopup(text).openPopup(), 1000)
    }, 50)
  }

  addTopographicMarker = (point) => {
    const { isMarkersOn } = this.props
    this.topographicMarkers.forEach((marker) => marker.removeFrom(this.map))
    if (!isMarkersOn) {
      const marker = createSearchMarker(point)
      marker.addTo(this.map)
        .on('click', () => this.props.toggleTopographicObjModal())
        .on('dblclick', () => this.removeTopographicMarker(marker))
      this.topographicMarkers.push(marker)
    }
  }

  removeTopographicMarker = (marker) => {
    const { toggleTopographicObjModal } = this.props
    marker.removeFrom(this.map)
    toggleTopographicObjModal()
    this.removeBacklightingTopographicObject()
  }

  backLightingTopographicObject = (object) => {
    if (this.backLights) {
      this.removeBacklightingTopographicObject()
    } else {
      this.backLights = []
    }
    const backLighting = L.geoJSON(object, this.backLightingStyles(object))
    backLighting.addTo(this.map)
    this.backLights.push(backLighting)
  }

  backLightingStyles = (object) => {
    switch (object.geometry.type) {
      case LINE_STRING:
      case MULTI_LINE_STRING:
        return BACK_LIGHT_STYLE_LINE
      default:
        return BACK_LIGHT_STYLE_POLYGON
    }
  }

  removeBacklightingTopographicObject = () => {
    this.backLights && this.backLights.forEach((item) => item.removeFrom(this.map))
  }

  onMouseClick = (e) => {
    if (!this.isBoxSelection && !this.draggingObject && !this.map._customDrag) {
      this.onSelectedListChange([])
    }
    if (!this.props.selection.newShape.type) {
      if (this.addMarkerMode) {
        this.addUserMarker(e.latlng)
      }
      if (this.addTopographicMarkersMode) {
        const { getTopographicObjects } = this.props
        this.addTopographicMarker(e.latlng)
        const location = {
          coordinates: {
            lat: e.latlng.lat.toFixed(6),
            lng: e.latlng.lng.toFixed(6),
          },
          zoom: this.map.getZoom(),
        }
        getTopographicObjects(location)
      }
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
    const { objects, layer: layerId, edit, selection: { list: selectedIds, preview } } = this.props
    if (
      objects !== prevProps.objects ||
      selectedIds !== prevProps.selection.list ||
      edit !== prevProps.edit ||
      layerId !== prevProps.layer ||
      preview !== prevProps.selection.preview
    ) {
      const selectedIdsSet = new Set(selectedIds)
      const canEditLayer = selectedIds.length === 1 && edit
      this.map.eachLayer((layer) => {
        if (layer.options.tsType) {
          const { id } = layer
          const isSelected = selectedIdsSet.has(id)
          const isActiveLayer = (layer.options && layer.options.tsType === entityKind.FLEXGRID) ||
            (layer.object && layer.object.layer === layerId)
          const isActive = canEditLayer && isSelected && isActiveLayer
          setLayerSelected(layer, isSelected, isActive && !(preview && preview.id === id), isActiveLayer)
          if (isActive) {
            this.activeLayer = layer
          }
        }
      })
    }
  }

  updateActiveObject = (prevProps) => {
    const { activeObjectId, tryLockObject } = this.props

    if (activeObjectId && activeObjectId !== prevProps.activeObjectId) {
      tryLockObject(activeObjectId)
        .then((success) => {
          if (!success && this.activeLayer.id === activeObjectId) {
            this.activeLayer.setLocked && this.activeLayer.setLocked(true)
            setLayerSelected(this.activeLayer, true, false)
            this.activeLayer = null
          }
        })
    }
  }

  onStopMeasuring = () => {
    if (!this.byReact) {
      this.props.stopMeasuring()
    }
  }

  moveHandler = debounce(() => {
    const center = this.map.getCenter()
    const zoom = this.map.getZoom()
    const isZoomChanged = zoom !== this.view.zoom
    if (!geomPointEquals(center, this.view.center) || isZoomChanged) {
      this.view = { center, zoom }
      const { onMove } = this.props
      onMove(center.wrap(), zoom, isZoomChanged)
    }
  }, 500)

  updateShowLayer = (levelEdge, layersById, hiddenOpacity, selectedLayerId, item) => {
    if (item.id && item.object) {
      const { layer, level } = item.object
      const itemLevel = Math.max(level, SubordinationLevel.TEAM_CREW)
      const hidden = itemLevel < levelEdge || ((!layer || !layersById.hasOwnProperty(layer)) && !item.catalogId)
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

  updateScaleOptions = () => {
    const { params } = this.props
    settings.WAVE_SIZE.max = params[paramsNames.WAVE_SIZE_MAX]
    settings.WAVE_SIZE.min = params[paramsNames.WAVE_SIZE_MIN]
    settings.STROKE_SIZE.max = params[paramsNames.STROKE_SIZE_MAX]
    settings.STROKE_SIZE.min = params[paramsNames.STROKE_SIZE_MIN]
    settings.NODES_SIZE.max = params[paramsNames.NODE_SIZE_MAX]
    settings.NODES_SIZE.min = params[paramsNames.NODE_SIZE_MIN]
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

  showCoordinates = ({ lat, lng }) => {
    try {
      return this.indicateMode === indicateModes.ALL
        ? Object.values(indicateModes)
          .slice(1, indicateModes.count)
          .map((mode) => serializeCoordinate(mode, lat, lng))
          .join('<br/>')
        : serializeCoordinate(this.indicateMode || indicateModes.WGS, lat, lng)
    } catch (err) {
      console.error(err)
      return '---'
    }
  }

  crosshairCursor = (on) => {
    if (this.map) {
      this.map._container.style.cursor = on ? 'crosshair' : ''
    }
  }

  setMapCursor = (edit, type) => {
    this.crosshairCursor(edit && type)
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
        console.info({
          'REACT_APP_PREFIX': process.env.REACT_APP_PREFIX,
          'REACT_APP_TILES': process.env.REACT_APP_TILES,
          'tileLayerURL': url,
        })
        const sourceLayer = new TileLayer(url, rest)
        settings.MIN_ZOOM = rest.minZoom || settings.MIN_ZOOM
        settings.MAX_ZOOM = rest.maxZoom || settings.MAX_ZOOM
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

  initCatalogObjects = () => {
    this.updateCatalogObjects(this.props.catalogObjects)
  }

  updateObjects = (objects, preview) => {
    if (this.map) {
      const existsIds = new Set()
      const changes = []
      this.map.eachLayer((layer) => {
        const { id, options: { tsType: type } } = layer
        if (id && type !== entityKind.FLEXGRID) {
          const object = preview && preview.id && preview.id === id ? preview : objects.get(id)
          if (object) {
            existsIds.add(id)
            if (layer.object !== object) {
              changes.push({ object, layer })
            }
          } else {
            layer.remove()
            layer.pm && layer.pm.disable()
          }
        }
      })
      for (let i = 0; i < changes.length; i++) {
        const { object, layer } = changes[i]
        const newLayer = this.addObject(object, layer)
        if (newLayer !== layer) {
          setLayerSelected(layer, false, false)
          this.activeLayer = null
          layer.remove()
          layer.pm && layer.pm.disable()
        }
      }
      objects.forEach((object, id) => {
        if (!existsIds.has(id)) {
          this.addObject(preview && preview.id && preview.id === id ? preview : object, null)
        }
      })
      const isNew = Boolean(preview && !preview.id)
      if (isNew === Boolean(this.newLayer)) {
        isNew && this.addObject(preview, this.newLayer)
      } else {
        if (isNew) {
          this.newLayer = this.addObject(preview, null)
        } else {
          setLayerSelected(this.newLayer, false, false)
          this.newLayer.remove()
          this.newLayer.pm && this.newLayer.pm.disable()
          this.newLayer = null
        }
      }
    }
  }

  updateCatalogObjects = (catalogObjects) => {
    if (this.map) {
      const existsIds = new Set()
      const changes = []
      this.map.eachLayer((layer) => {
        const { id, catalogId } = layer
        if (id && catalogId) {
          const catalog = catalogObjects[Number(catalogId)]
          const object = catalog && catalog.find(({ id: objId }) => objId === id)
          if (object) {
            existsIds.add(id)
            if (layer.catalogObject !== object) {
              changes.push({ object, layer })
            }
          } else {
            layer.remove()
            // layer.pm && layer.pm.disable()
          }
        }
      })
      for (let i = 0; i < changes.length; i++) {
        const { object, layer } = changes[i]
        const newLayer = this.addCatalogObject(object, layer)
        if (newLayer !== layer) {
          layer.remove()
          // layer.pm && layer.pm.disable()
        }
      }
      Object.values(catalogObjects).forEach((objects) => {
        objects && objects.forEach((object) => {
          if (!existsIds.has(object.id)) {
            this.addCatalogObject(object)
          }
        })
      })
    }
  }

  addObject = (object, prevLayer) => {
    const { id, attributes } = object
    try {
      validateObject(object.toJS())
    } catch (e) {
      return null
    }
    const layer = createTacticalSign(object, this.map, prevLayer)
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

      layer === prevLayer ? (layer.update && layer.update()) : layer.addTo(this.map)

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

  addCatalogObject = (object, prevLayer) => {
    const { id, location, catalogId } = object
    const [ app6Code, amplifiers ] = catalogSign(catalogId) // TODO: amplifiers
    const layer = createCatalogIcon(app6Code, amplifiers, location, prevLayer)
    if (layer) {
      layer.id = id
      layer.object = object
      // layer.object.level = catalogLevel(catalogId)
      layer.catalogId = catalogId
      layer.on('click', this.clickOnCatalogLayer)
      layer.on('dblclick', this.dblClickOnCatalogLayer)
      // layer.on('pm:markerdragstart', this.onDragstartLayer)
      // layer.on('pm:markerdragend', this.onDragendLayer)
      // TODO: events

      layer === prevLayer
        ? layer.update && layer.update()
        : layer.addTo(this.map)

      const { params } = this.props
      setScaleOptions(layer, params)
    }
    return layer
  }

  onDragstartLayer = () => {
    this.draggingObject = true
  }

  onDragendLayer = () => setTimeout(() => {
    this.draggingObject = false
    this.checkSaveObject()
  }, 0)

  clickOnCatalogLayer = (event) => {
    L.DomEvent.stopPropagation(event)
    const { target: layer, target: { object: { name, state, catalogId } } } = event
    const { catalogs } = this.props
    const catalogName = catalogs[catalogId].name
    const text = `
      <strong>${catalogName}</strong><br/>
      <u>${i18n.DESIGNATION}:</u>&nbsp;${name}<br/>
      <u>${i18n.STATE}:</u>&nbsp;${state}
    `
    new L.Popup()
      .setLatLng(layer.getLatLng())
      .setContent(text)
      .openOn(layer._map)
  }

  dblClickOnCatalogLayer = (event) => {
    L.DomEvent.stopPropagation(event)
    const { target: { object: { id, catalogId } } } = event
    window.explorerBridge.showCatalogObject(catalogId, id)
  }

  clickOnLayer = (event) => {
    L.DomEvent.stopPropagation(event)
    const { target: { id, object, options: { tsType } } } = event
    const useOneClickForActivateLayer = this.props.hiddenOpacity === 100
    const targetLayer = object && object.layer
    let doActivate = tsType === entityKind.FLEXGRID || targetLayer === this.props.layer
    if (!doActivate && useOneClickForActivateLayer && targetLayer) {
      this.props.onChangeLayer(targetLayer)
      doActivate = true
    }
    if (doActivate) {
      this.selectLayer(id, event.originalEvent.ctrlKey)

      event.target._map._container.focus()
    }
  }

  dblClickOnLayer = (event) => {
    const { target: layer } = event
    const { id, object } = layer
    const { selection: { list }, editObject, objects } = this.props
    if (object && list.length === 1 && list[0] === object.id) {
      this.checkSaveObject(false)
      const obj = objects.get(object.id).toJS()
      const { geometry, point } = obj
      editObject(object.id, { geometry, point } || getGeometry(layer))
    } else {
      const targetLayer = object && object.layer
      if (targetLayer && targetLayer !== this.props.layer) {
        this.props.onChangeLayer(targetLayer)
        this.selectLayer(id)
        layer._map._container.focus()
      }
    }
    L.DomEvent.stopPropagation(event)
  }

  onDblClick = (event) => {
    const { selectDirection, flexGridVisible, showDirectionNameForm } = this.props
    if (this.flexGrid && flexGridVisible) {
      const { latlng } = event
      const cellClick = this.flexGrid.isInsideCell(latlng)
      if (cellClick) {
        const [ direction ] = cellClick
        selectDirection({ index: direction - 1 })
        showDirectionNameForm()
      }
    }
  }

  getCurrentZone = (event) => {
    if (this.flexGrid && this.props.flexGridVisible) {
      const { latlng } = event
      const cellClick = this.flexGrid.isInsideCell(latlng)
      if (cellClick) {
        const [ direction, zone ] = cellClick
        return { direction, zone }
      }
    }
    return null
  }

  highlightDirections = (selectedDirections) => {
    const { flexGridVisible } = this.props
    this.flexGrid && flexGridVisible && this.flexGrid.selectDirection(selectedDirections)
  }

  selectLayer = (id, exclusive) => {
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

  showFlexGrid = (show) => {
    if (!this.map) {
      return
    }
    if (show) {
      if (this.flexGrid) {
        this.flexGrid.addTo(this.map)
        const { inICTMode } = this.props
        if (inICTMode) {
          this.map.fitBounds(this.flexGrid.getBounds())
        }
      } else {
        this.dropFlexGrid()
      }
    } else {
      if (this.flexGrid) {
        this.flexGrid.removeFrom(this.map)
      }
    }
  }

  dropFlexGrid = (show = true) => {
    if (this.flexGrid) {
      this.flexGrid.removeFrom(this.map)
    }
    const {
      flexGridParams: {
        vertical,
      },
      flexGridData: {
        directions,
        zones,
        id,
        deleted,
        eternals,
        directionSegments,
        zoneSegments,
      },
      flexGridCreated,
      flexGridChanged,
      activeMapId,
      fixFlexGridInstance,
    } = this.props
    const layer = new L.FlexGrid(
      this.map.getBounds().pad(-0.2),
      {
        interactive: true,
        directions,
        zones,
        vertical,
      },
      id,
      id && !deleted
        ? {
          eternals: eternals.toArray(),
          directionSegments: directionSegments.toArray(),
          zoneSegments: zoneSegments.toArray(),
        }
        : undefined,
    )
    layer.on('click', this.clickOnLayer)
    layer.on('dblclick', this.dblClickOnLayer)
    layer.on('pm:markerdragstart', this.onDragstartLayer)
    layer.on('pm:markerdragend', this.onDragendLayer)
    if (show && id) {
      layer.addTo(this.map)
    }
    if (id) {
      this.flexGrid = layer
      fixFlexGridInstance && fixFlexGridInstance(layer)
    }
    const geometry = getGeometry(layer)
    if (!id) {
      flexGridCreated && flexGridCreated(activeMapId, geometry, { directions, zones })
    } else if (deleted) {
      flexGridChanged && flexGridChanged(id, activeMapId, geometry, { directions, zones })
    }
  }

  updateFlexGrid = (flexGridData) => {
    const {
      fixFlexGridInstance,
    } = this.props
    const actual = flexGridData.id && !flexGridData.deleted
    if (!actual && this.flexGrid) {
      this.flexGrid.removeFrom(this.map)
      delete this.flexGrid
      fixFlexGridInstance && fixFlexGridInstance(null)
    } else if (actual && !this.flexGrid) {
      const { flexGridVisible } = this.props
      this.dropFlexGrid(flexGridVisible)
    } else if (actual && this.flexGrid && flexGridData.directions !== this.flexGrid.options.directions) {
      const { directions, eternals, directionSegments, zoneSegments } = flexGridData
      const options = { directions }
      const internalProps = {
        eternals: eternals.toArray(),
        directionSegments: directionSegments.toArray(),
        zoneSegments: zoneSegments.toArray(),
      }
      this.flexGrid.updateProps(options, internalProps)
    }
  }

  updateCreatePoly = (type) => {
    const layerOptions = {
      tsType: type,
      fill: entityKindFillable.indexOf(type) >= 0,
    }
    const options = { tooltips: false, templineStyle: layerOptions, pathOptions: layerOptions }
    switch (type) {
      case entityKind.POLYLINE:
      case entityKind.CURVE:
        this.map.pm.enableDraw('Line', { ...options, hintlineStyle })
        break
      case entityKind.POLYGON:
      case entityKind.AREA:
        this.map.pm.enableDraw('Poly', { ...options, finishOn: 'dblclick' })
        break
      case entityKind.RECTANGLE:
      case entityKind.SQUARE:
        this.map.pm.enableDraw('Rectangle', options)
        break
      case entityKind.CIRCLE:
        this.map.pm.enableDraw('Circle', options)
        break
      case entityKind.TEXT:
      case entityKind.POINT:
        this.map.pm.enableDraw('Line', options)
        break
      default:
        this.map.pm.disableDraw()
        break
    }
  }

  createNewShape = (e) => {
    const { layer } = e
    layer.removeFrom(this.map)
    const geometry = getGeometry(layer)
    this.props.onFinishDrawNewShape(geometry)
  }

  onDrawStart = ({ workingLayer }) => {
    const { options: { tsType } } = workingLayer
    if (tsType === entityKind.TEXT || tsType === entityKind.POINT) {
      workingLayer.on('pm:vertexadded', ({ workingLayer }) => {
        const geometry = getGeometry(workingLayer)
        this.map.pm.disableDraw('Line')
        this.props.onFinishDrawNewShape(geometry)
      })
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

  disableDrawLineSquareMark = () => {
    const { selection: { newShape }, disableDrawUnit } = this.props
    if (newShape.type) {
      this.map.pm.disableDraw()
      disableDrawUnit()
    }
  }

  escapeHandler = () => {
    if (this.markers) {
      this.props.onRemoveMarker()
    }
    this.disableDrawLineSquareMark()
  }

  spaceHandler = () => {
    this.onSelectedListChange([])
  }

  enterHandler = () => {
    const { type } = this.props.selection.newShape
    if (type === SelectionTypes.CURVE || type === SelectionTypes.POLYLINE) {
      const activeLayer = this.map.pm.Draw && this.map.pm.Draw.Line._layer
      this.createNewShape({ layer: activeLayer })
      this.map.pm.disableDraw()
    }
  }

  render () {
    return (
      <div
        onDragOver={this.dragOverHandler}
        onDrop={this.dropHandler}
        ref={(container) => (this.container = container)}
        style={{ height: '100%' }}
      >
        <MapProvider value={this.map} >{this.props.children}</MapProvider>
        <HotKey selector={shortcuts.ESC} onKey={this.escapeHandler} />
        <HotKey selector={shortcuts.SPACE} onKey={this.spaceHandler} />
        <HotKey selector={shortcuts.ENTER} onKey={this.enterHandler} />
        { this.props.flexGridVisible && (
          <FlexGridToolTip
            startLooking={this.enableLookAfterMouseMove}
            stopLooking={this.disableLookAfterMouseMove}
            getCurrentCell={this.getCurrentZone}
            names={this.props.flexGridData.directionNames}
          />
        )}
      </div>
    )
  }
}

/** Do not delete, please, it is FIX */
export const buildFlexGridGeometry = formFlexGridGeometry
