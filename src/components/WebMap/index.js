import React from 'react'
import PropTypes from 'prop-types'
import 'leaflet/dist/leaflet.css'
import 'leaflet.pm/dist/leaflet.pm.css'
import './Tactical.css'
import L, { Map, TileLayer, Control, DomEvent, Point, control, point, popup } from 'leaflet'
import * as debounce from 'debounce'
import { utils } from '@DZVIN/CommonComponents'
import { model } from '@DZVIN/MilSymbolEditor'
import FlexGridToolTip from '../../components/FlexGridTooltip'
import renderIndicators from '../../components/UnitIndicators'
import i18n from '../../i18n'
import { version } from '../../version'
import 'leaflet.pm'
import 'leaflet-minimap/dist/Control.MiniMap.min.css'
import 'leaflet-minimap'
import '@DZVIN/leaflet-measure-custom/leaflet.measure/leaflet.measure.css'
import '@DZVIN/leaflet-measure-custom/leaflet.measure/leaflet.measure'
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min.css'
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min'
import 'leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.css'
import 'leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.min'
import 'leaflet-switch-scale-control/src/L.Control.SwitchScaleControl.css'
import 'leaflet-switch-scale-control/src/L.Control.SwitchScaleControl'
import { colors, SCALES, SubordinationLevel, paramsNames, shortcuts, access } from '../../constants'
import { HotKey } from '../common/HotKeys'
import { validateObject } from '../../utils/validation'
import { flexGridPropTypes } from '../../store/selectors'
import {
  BACK_LIGHT_STYLE_LINE,
  BACK_LIGHT_STYLE_POLYGON,
  LINE_STRING,
  MULTI_LINE_STRING,
} from '../../constants/TopoObj'
import { ETERNAL, ZONE } from '../../constants/FormTypes'
import { catalogSign } from '../Catalogs'
import { calcMoveWM } from '../../utils/mapObjConvertor' /*, calcMiddlePoint */
// import { isEnemy } from '../../utils/affiliations' /* isFriend, */
import { settings } from '../../constants/drawLines'
import entityKind, {
  entityKindFillable,
  entityKindMultipointCurves,
  entityKindMultipointAreas,
  GROUPS,
} from './entityKind'
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
  createTargeting,
} from './Tactical'
import { MapProvider } from './MapContext'
import { findDefinition } from './patch/Sophisticated/utils'
import { generateGeometry } from './patch/FlexGrid'

const { Coordinates: Coord } = utils

const hintlineStyle = { // стиль лінії-підказки при створенні лінійних і площинних тактичних знаків
  color: 'red',
  dashArray: [ 5, 5 ],
}

// TODO: тимчасово відключаємо показ характеристик підрозділу
// const openingAction = 'open'
// const closingAction = 'close'
const xBound = 160
const yBound = 320
const openPopUpInterval = 1000
const clearLastUnitIdToGetNewRequestForIndicators = 30000

const popupOptionsIndicators = {
  maxWidth: 310, maxHeight: 310, className: 'sign_Popup', autoPan: false, closeButton: false,
}

const switchScaleOptions = {
  scales: SCALES,
  splitScale: true,
  ratioCustomItemText: '1: інший...', // CustomItem заблокирован через стили
  customScaleTitle: 'Задайте свій масштаб і натисніть Enter',
}

const getFeatureParent = (item) => item.feature && item.options && item.options.tsType === entityKind.CONTOUR
  ? item._eventParents[Object.keys(item._eventParents)[0]]
  : item

const isLayerInBounds = (layer, bounds) => {
  const geometryObj = getGeometry(layer)
  if (geometryObj === null) {
    return false
  }
  let { geometry } = geometryObj
  if (Array.isArray(geometry)) {
    geometry = geometry.flat(3)
  }
  const rect = geometry && geometry.length && L.latLngBounds(geometry)
  return rect && bounds.contains(rect)
}

/* const tmp = `<svg
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
</svg>` */

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
  let serialized = mode === indicateModes.WGSI
    ? `${toGMS(lat, 'N', 'S')}   ${toGMS(lng, 'E', 'W')}`
    : Coord.stringify({ type, lat, lng })
  if (type === Coord.types.UCS_2000 || type === Coord.types.CS_42) {
    const coord = serialized.split(' ', 2)
    serialized = `${coord[0]} ${coord[1]}`
  }
  return `${Coord.names[type]}: ${serialized}`.replace(' ', '\xA0')
}

const setScaleOptions = (layer, params) => {
  const pointSizes = {
    min: Number(params[paramsNames.POINT_SIZE_MIN]),
    max: Number(params[paramsNames.POINT_SIZE_MAX]),
  }
  const textSizes = {
    min: Number(params[paramsNames.TEXT_SIZE_MIN]),
    max: Number(params[paramsNames.TEXT_SIZE_MAX]),
  }
  const lineSizes = {
    min: Number(params[paramsNames.LINE_SIZE_MIN]),
    max: Number(params[paramsNames.LINE_SIZE_MAX]),
    pointSizes,
  }
  if (layer?.object) {
    if (layer.object.catalogId) {
      layer.setScaleOptions(pointSizes)
    } else if (layer.object.type) {
      switch (Number(layer.object.type)) {
        case entityKind.POINT:
        case entityKind.GROUPED_HEAD:
        case entityKind.GROUPED_LAND:
        case entityKind.GROUPED_REGION:
          layer.setScaleOptions(pointSizes)
          break
        case entityKind.TEXT:
          layer.setScaleOptions(textSizes)
          break
        case entityKind.SEGMENT:
        case entityKind.AREA:
        case entityKind.CURVE:
        case entityKind.POLYGON:
        case entityKind.POLYLINE:
        case entityKind.CIRCLE:
        case entityKind.RECTANGLE:
        case entityKind.SQUARE:
        case entityKind.CONTOUR:
        case entityKind.SOPHISTICATED:
          layer.setScaleOptions(lineSizes)
          break
        default:
      }
    }
  }
}

const useTry = (func) => (...args) => {
  try {
    func(...args)
  } catch (e) {
    console.warn('ERROR: cannot execute function ', func, ' because of ', e)
  }
}

const useDebounce = (func, time) => debounce(useTry(func), time) // please use this debounce to reduce number of errors related to map`s unmount

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
      }),
    ),
    layersById: PropTypes.object,
    unitsById: PropTypes.object,
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
    layersByIdFromStore: PropTypes.object,
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
      mainDirectionIndex: PropTypes.number,
      selectedEternal: PropTypes.shape({
        coordinates: PropTypes.object,
        position: PropTypes.array,
      }),
    }),
    flexGridVisible: PropTypes.bool,
    flexGridData: flexGridPropTypes,
    activeMapId: PropTypes.any,
    inICTMode: PropTypes.any,
    topographicObjects: PropTypes.object,
    catalogObjects: PropTypes.object,
    catalogs: PropTypes.object,
    targetingObjects: PropTypes.object,
    undoInfo: PropTypes.shape({
      canUndo: PropTypes.bool,
      canRedo: PropTypes.bool,
    }),
    isMapCOP: PropTypes.bool,
    // Redux actions
    editObject: PropTypes.func,
    updateObjectGeometry: PropTypes.func,
    onChangeLayer: PropTypes.func,
    onSelectedList: PropTypes.func,
    onClick: PropTypes.func,
    onFinishDrawNewShape: PropTypes.func,
    onMove: PropTypes.func,
    onRemoveMarker: PropTypes.func,
    onDropUnit: PropTypes.func,
    onSelectUnit: PropTypes.func,
    stopMeasuring: PropTypes.func,
    requestAppInfo: PropTypes.func,
    requestMaSources: PropTypes.func,
    warningLockObjectsMove: PropTypes.func,
    tryLockObject: PropTypes.func,
    tryUnlockObject: PropTypes.func,
    getLockedObjects: PropTypes.func,
    flexGridCreated: PropTypes.func,
    flexGridChanged: PropTypes.func,
    flexGridDeleted: PropTypes.func,
    fixFlexGridInstance: PropTypes.func,
    showDirectionNameForm: PropTypes.func,
    showEternalDescriptionForm: PropTypes.func,
    getTopographicObjects: PropTypes.func,
    toggleTopographicObjModal: PropTypes.func,
    selectEternal: PropTypes.func,
    disableDrawUnit: PropTypes.func,
    onMoveContour: PropTypes.func,
    onMoveObjList: PropTypes.func,
    onMoveGroup: PropTypes.func,
    getZones: PropTypes.func,
    createGroup: PropTypes.func,
    dropGroup: PropTypes.func,
    newShapeFromSymbol: PropTypes.func,
    newShapeFromLine: PropTypes.func,
    getCoordForMarch: PropTypes.func,
    marchMode: PropTypes.bool,
    marchDots: PropTypes.array,
    marchRefPoint: PropTypes.object,
    undo: PropTypes.func,
    redo: PropTypes.func,
    checkObjectAccess: PropTypes.func,
    onShadowDelete: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.view = {
      center: { lat: 0, lng: 0 },
      zoom: 0,
    }
    this.activeLayer = null
    this.marchMarkers = []
    this.marchRefPoint = null
  }

  async componentDidMount () {
    const { sources, requestAppInfo, requestMaSources, getLockedObjects } = this.props

    window.webMap = this

    await requestAppInfo()
    this.setMapView()
    this.setMapSource(sources)
    await requestMaSources()
    await getLockedObjects()
    useTry(this.initObjects)()
    this.initCatalogObjects()
    this.updateScaleOptions()
    window.addEventListener('beforeunload', () => {
      this.onSelectedListChange([])
    })
    this.updateMarchDots(this.props.marchDots, [])
    window.explorerBridge.init(true)
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (!this.map || !this.map._container) {
      return // Exit if map is not yet initialized
    }

    const {
      objects, showMiniMap, showAmplifiers, sources, level, layersById, hiddenOpacity, layer, edit, coordinatesType,
      isMeasureOn, isMarkersOn, isTopographicObjectsOn, backOpacity, params, lockedObjects, flexGridVisible,
      flexGridData, catalogObjects,
      flexGridParams: { selectedDirections, selectedEternal, mainDirectionIndex },
      selection: { newShape, preview, previewCoordinateIndex, list },
      topographicObjects: { selectedItem, features },
      targetingObjects, marchDots, marchMode, marchRefPoint,
    } = this.props

    if (objects !== prevProps.objects || preview !== prevProps.selection.preview) {
      this.updateObjects(objects, preview)
      this.map && this.map._container.focus()
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
      layer !== prevProps.layer || list !== prevProps.selection.list
    ) {
      this.updateShowLayers(level, layersById, hiddenOpacity, layer, list)
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
    this.updateBackOpacity(backOpacity)
    if (params !== prevProps.params) {
      this.updateScaleOptions()
    }
    this.updateViewport(prevProps)
    if (lockedObjects !== prevProps.lockedObjects) {
      this.updateLockedObjects(lockedObjects)
    }
    if (flexGridData !== prevProps.flexGridData) {
      this.updateFlexGrid(flexGridData, prevProps.flexGridData)
    }
    if (flexGridVisible !== prevProps.flexGridVisible) {
      this.showFlexGrid(flexGridVisible)
    }
    if (selectedDirections !== prevProps.flexGridParams.selectedDirections) {
      this.highlightDirections(selectedDirections)
    }
    if (mainDirectionIndex !== prevProps.flexGridParams.mainDirectionIndex) {
      mainDirectionIndex !== -1 && this.highlightMainDirection(mainDirectionIndex)
    }
    if (selectedEternal !== prevProps.flexGridParams.selectedEternal) {
      this.highlightEternal(selectedEternal.position, prevProps.flexGridParams.selectedEternal.position)
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
    this.crosshairCursor(isMeasureOn || isMarkersOn || isTopographicObjectsOn || marchMode)
    if (targetingObjects !== prevProps.targetingObjects || list !== prevProps.selection.list) {
      this.updateTargetingZones(targetingObjects/*, list, objects */)
    }
    this.updateMarchDots(marchDots, prevProps.marchDots)
    this.updateMarchRefPoint(marchRefPoint)
  }

  componentWillUnmount () {
    delete window.webMap
    this.map && this.map.remove()
  }

  indicateMode = indicateModes.WGS

  sources = []

  updateMinimap = (showMiniMap) => showMiniMap
    ? this.mini.addTo(this.map) &&
    this.mini._miniMap.on('move', (e) => e.target._renderer && e.target._renderer._update())
    : this.mini.remove()

  updateLockedObjects = (lockedObjects) => Object.keys(this.map._layers)
    .filter((key) => this.map._layers[key]._locked)
    .forEach((key) => {
      const { activeObjectId } = this.props
      const layer = this.map._layers[key]
      const isLocked = lockedObjects.get(layer.id)
      if (!isLocked) {
        layer.setLocked(false)
        layer.id === activeObjectId && this.onSelectedListChange([])
      }
    })

  toggleIndicateMode = () => {
    this.indicateMode = (this.indicateMode + 1) % indicateModes.count
  }

  updateTargetingZones = async (targetingObjects/*, selectedList, objects */) => {
    if (!this.map) {
      return
    }
    /* const selectedPoints = (selectedList || [])
      .filter((id) => {
        const object = objects.find((object) => object && object.id === id)
        return object && object.type === entityKind.POINT
      }) */
    /* const selectedFriends = selectedPoints
      .filter((id) => {
        const object = objects.find((object) => object && object.id === id)
        return isFriend(object.code) && object.level === SubordinationLevel.TEAM_CREW
      }) */
    /* const selectedEnemies = selectedPoints
      .filter((id) => {
        const object = objects.find((object) => object && object.id === id)
        return isEnemy(object.code)
      }) */
    /* const enemy = selectedEnemies && selectedList && selectedEnemies.length === 1 && selectedList.length === 1
      ? selectedEnemies[0]
      : null */
    /* const friend = selectedFriends && selectedList && selectedFriends.length === 1 && selectedList.length === 1
      ? selectedFriends[0]
      : null */
    const buildingObjects = /* targetingObjects.size >= 1 && friend
      ? [ friend ]
      : */ targetingObjects.map((object) => object.id).sort().toArray()
    const hash = `${JSON.stringify(buildingObjects)}` // ${enemy}
    if (this.targetingZonesHash !== hash) {
      const { getZones } = this.props
      const zones = buildingObjects.length
        ? (await getZones(buildingObjects, null/* enemy */)).map(JSON.parse).filter(Boolean)
        : null
      this.targeting && this.targeting.removeFrom(this.map)
      if (zones && zones.length) {
        this.targeting = createTargeting(zones, this.targeting)
        this.targeting.addTo(this.map)
      } else {
        delete this.targeting
      }
      this.targetingZonesHash = hash
    }
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
    if (marker !== prevProps.marker /* && marker !== null */) {
      if (!isMarkersOn) {
        if (marker) {
          this.markers && this.markers.length && this.markers[0].removeFrom(this.map)
          let { point, text } = marker
          text = this.createSearchMarkerText(point, text)
          setTimeout(() => {
            this.markers = [ createSearchMarker(point) ]
            this.markers[0].addTo(this.map)
            setTimeout(() => this.markers && this.markers[0].bindPopup(text).openPopup(), 1000)
          }, 500)
        } else {
          if (this.markers) {
            this.markers && this.markers[0] && this.markers[0].removeFrom(this.map)
            delete this.markers
          }
        }
      } else {
        if (marker) {
          let { point, text } = marker
          text = this.createSearchMarkerText(point, text)
          setTimeout(() => {
            const searchMarker = createSearchMarker(point)
            searchMarker.addTo(this.map)
            this.markers.push(searchMarker)
            setTimeout(() => searchMarker.bindPopup(text).openPopup(), 500)
          }, 1000)
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
        this.map.objects.forEach((layer) =>
          layer.options.tsType && selectedIdsSet.has(layer.id) && points.push(...getGeometry(layer).geometry),
        )
        if (points.length > 0) {
          const bounds = L.latLngBounds(points)
          if (bounds.isValid() && !this.map.getBounds().contains(bounds)) {
            const center = bounds.getCenter()
            const zoom = Math.min(this.map.getBoundsZoom(bounds), this.map.getZoom())
            setTimeout(() => this.props.onMove(center.wrap(), zoom), 0) // eslint-disable-line react/prop-types
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
      measureControl: {
        button: null,
        formatDistance: (val) => Math.round((val / 1000) * 10) / 10 + ' ' + i18n.ABBR_KILOMETERS,
        // Format distance for meters and kilometers
        // formatDistance: (val) => val < 1000
        //   ? Math.round(val) + ' ' + i18n.ABBR_METERS
        //   : Math.round((val / 1000) * 100) / 100 + ' ' + i18n.ABBR_KILOMETERS,
      },
    })
    this.map.objects = []
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
    scale.text.style.width = '100%'
    const graphicStyle = this.scale._container.style
    const graphicStyleInner = this.scale._scaleInner.style
    graphicStyle.background = 'rgba(255, 255, 255, 0.65)'
    graphicStyle.padding = '5px 14px 5px 14px'
    graphicStyle.height = '30px'
    graphicStyle.borderRadius = '0px 4px 0px 0px'
    graphicStyle.marginBottom = '0'
    graphicStyle.marginLeft = '0'
    graphicStyle.fontSize = '11px'
    graphicStyle.color = '#000'
    graphicStyleInner.marginTop = '12px'

    this.control = control.zoom({
      zoomInTitle: i18n.ZOOM_IN,
      zoomOutTitle: i18n.ZOOM_OUT,
      position: 'bottomleft',
    }).addTo(this.map)
    this.control._container.style.left = '15px'
    DomEvent.addListener(this.coordinates._container, 'click', () => {
      this.toggleIndicateMode()
      this.coordinates._update({ latlng: this.coordinates._currentPos })
    }, this.coordinates)
    this.map.setView(this.props.center, this.props.zoom)
    if (process.env.NODE_ENV === 'development') {
      this.map.attributionControl.setPrefix(`f${version} b${this.props.backVersion}`)
    }
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

  checkSaveObject = async (leaving) => {
    const { selection: { list }, updateObjectGeometry, tryUnlockObject, flexGridData } = this.props
    const id = list[0]
    const layer = this.findLayerById(id)
    let isFlexGrid = false
    if (layer) {
      let checkPoint = null
      let checkGeometry
      if (layer.object) {
        const { point, geometry } = layer.object
        if (id !== null && (!point || !point.toJS || !geometry || !geometry.toArray)) {
          console.warn(`layer.object`, layer.object) // такої ситуації не мало би виникати
        }
        checkPoint = point && point.toJS && point.toJS()
        checkGeometry = geometry && geometry.toArray && geometry.toArray()
      } else if (layer === this.flexGrid) {
        const { eternals, directionSegments, zoneSegments } = flexGridData
        checkGeometry = [ eternals.toArray(), directionSegments.toArray(), zoneSegments.toArray() ]
        isFlexGrid = true
      }
      const geometryChanged = isGeometryChanged(layer, checkPoint, checkGeometry)
      if (id !== null) {
        if (geometryChanged) {
          await updateObjectGeometry(id, getGeometry(layer), true, isFlexGrid && checkGeometry)
        }
        if (leaving) {
          await tryUnlockObject(id)
        }
      }
    }
  }

  checkSaveEditedObject = async () => {
    const { edit, selection: { list } } = this.props
    if (edit && list.length === 1) {
      const layer = this.findLayerById(list[0])
      if (layer?.object) {
        await this.checkSaveObject(false)
        return layer.object.id
      }
    }
  }

  adjustEditMode = (edit, { type }) => {
    const { selection: { list } } = this.props
    if (!edit && list.length === 1) {
      this.checkSaveObject(false)
    }
    this.setMapCursor(edit, type)
    this.updateCreatePoly(edit && type)
  }

  async onSelectedListChange (newList) {
    const {
      selection: { list },
      onSelectedList, onSelectUnit, edit,
    } = this.props
    if (newList.length === 0 && list.length === 0) {
      return
    }

    // save geometry when one selected item lost focus
    if (list.length === 1 && (list[0] !== newList[0] || newList.length !== 1) && edit) {
      await this.checkSaveObject(true)
    }

    // get unit from new selection
    let selectedUnit = null
    if (newList.length === 1 && list[0] !== newList[0]) {
      const id = newList[0]
      const layer = this.findLayerById(id)
      selectedUnit = (layer?.object?.unit) || null
    }
    await onSelectUnit(selectedUnit)

    return onSelectedList(newList)
  }

  updateMarkersOn = (isMarkersOn) => {
    this.addMarkerMode = isMarkersOn
    if (!isMarkersOn && this.markers && this.markers.length && this.map) {
      this.markers.forEach((marker) => marker.removeFrom(this.map))
      delete this.markers
    } else {
      const { marker, onRemoveMarker } = this.props
      this.markers = this.markers || []
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
      const marker = createSearchMarker(point)
      marker.addTo(this.map)
      this.markers.push(marker)
      setTimeout(() => marker.bindPopup(text).openPopup(), 1000)
    }, 50)
  }

  updateMarchDots = (marchDots, prevMarchDots) => {
    const drawMarchLine = () => {
      if (!this.marchLines) {
        this.marchLines = []
      }
      if (this.marchLines.length > 0) {
        this.marchLines.forEach((line) => {
          line.removeFrom(this.map)
        })
        this.marchLines = []
      }
      marchDots.forEach((dot, id) => {
        if (id !== marchDots.length - 1) {
          const marchLine = L.polyline([ dot.coordinates, marchDots[id + 1].coordinates ], dot.options)
          marchLine.addTo(this.map)
          this.marchLines.push(marchLine)
        }
      })
    }

    if (marchDots.length !== prevMarchDots.length) {
      if (this.marchMarkers.length !== 0) {
        this.marchMarkers.forEach((marker) => marker.removeFrom(this.map))
        this.marchMarkers = []
      }
      marchDots.forEach((dot) => {
        const marker = createSearchMarker(dot.coordinates, false)
        const { lat, lng } = dot.coordinates
        const msgTooltip = `${lat} ${lng} | ${dot.refPoint}`

        marker.bindTooltip(msgTooltip, { direction: 'top', offset: new Point(0, -15) })

        marker.addTo(this.map)
        this.marchMarkers.push(marker)
      })

      drawMarchLine()
    } else {
      if (marchDots.length !== 0 && prevMarchDots.length !== 0) {
        let redrawLine = false
        marchDots.forEach((dot, id) => {
          if (
            dot.coordinates.lat !== prevMarchDots[id].coordinates.lat ||
            dot.coordinates.lng !== prevMarchDots[id].coordinates.lng ||
            dot.options.color !== prevMarchDots[id].options.color
          ) {
            redrawLine = true
            const marker = createSearchMarker(dot.coordinates, false)
            marker.addTo(this.map)
            if (this.marchMarkers.length && this.marchMarkers[id]) {
              this.marchMarkers[id].removeFrom(this.map)
              this.marchMarkers[id] = marker
            } else {
              this.marchMarkers.push(marker)
            }
          }
        })
        if (marchDots.length > 1) {
          if (redrawLine) {
            drawMarchLine()
          }
        }
      }
    }
  }

  updateMarchRefPoint = (marchRefPoint) => {
    if (this.marchRefPoint) {
      this.marchRefPoint.removeFrom(this.map)
    }

    let marker = null
    if (marchRefPoint) {
      marker = createSearchMarker(marchRefPoint, false, 'marker-icon-red.png')
      marker.addTo(this.map)
    }

    this.marchRefPoint = marker
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

  isFlexGridEditingMode = () =>
    this.flexGrid && this.props.flexGridVisible && this.props.selection.list.includes(this.props.flexGridData.id)

  canClickOnLayer = (item) => {
    item = getFeatureParent(item)

    const { object, options: { tsType } = {} } = item

    if (!object && tsType !== entityKind.FLEXGRID) {
      return false
    }

    const {
      hiddenOpacity,
      layer,
    } = this.props

    const useOneClickForActivateLayer = hiddenOpacity === 100
    const targetLayer = object && object.layer
    let doActivate = tsType === entityKind.FLEXGRID || targetLayer === layer
    if (!doActivate && useOneClickForActivateLayer && targetLayer) {
      doActivate = true
    }

    return doActivate
  }

  onMouseClick = useDebounce((e) => {
    const { originalEvent: { detail } } = e // detail - порядковый номер сделанного клика с коротким промежутком времени

    const {
      isMeasureOn,
      isMarkersOn,
      isTopographicObjectsOn,
      marchMode,
      layer,
      onChangeLayer,
      printStatus,
      onClick,
      getCoordForMarch,
      selection: { newShape, preview },
    } = this.props

    if (!this.isBoxSelection && !this.draggingObject && !this.map._customDrag && !isMeasureOn && !isMarkersOn &&
      !isTopographicObjectsOn && !marchMode
    ) {
      if (this.boxSelected && detail <= 1) {
        delete this.boxSelected
      } else if (!newShape.type) {
        const area = (layer) => {
          if (!layer.getBounds) {
            return 0
          }
          const b = layer.getBounds()
          return Math.abs((b.getNorth() - b.getSouth()) * (b.getWest() - b.getEast()))
        }
        const byArea = (a, b) => area(a) - area(b)

        const elems = document.elementsFromPoint(e.originalEvent.clientX, e.originalEvent.clientY)
        const all = [].map
          .call(elems, (item) => this.map._targets[L.Util.stamp(item)])
          .filter(Boolean)
          .filter(this.canClickOnLayer)
          .sort(byArea)

        let [ result ] = all

        this.map._container.focus()

        if (!result) {
          this.onSelectedListChange([])
        } else {
          result = getFeatureParent(result)
          if (detail <= 1) {
            result.object && result.object.layer !== layer && onChangeLayer(result.object.layer)
            return this.selectLayer(result.id, e.originalEvent.ctrlKey)
          } else { // double click
            return this.processDblClickOnLayer(result)
          }
        }
      }
    }

    if (!newShape.type && !preview && !printStatus) {
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

    if (marchMode) {
      getCoordForMarch(e.latlng)
    }

    onClick(e.latlng)
  }, 200)

  onBoxSelectStart = () => {
    this.isBoxSelection = true
  }

  onBoxSelectEnd = ({ boxSelectBounds }) => {
    this.isBoxSelection = false
    const { layer: activeLayerId, layersById } = this.props
    const selectedIds = []
    this.map.objects.forEach((layer) => {
      if (layer.options.tsType && !layer._hidden) {
        const isInBounds = isLayerInBounds(layer, boxSelectBounds)
        const isOnActiveLayer = layer.object && (layer.object.layer === activeLayerId)
        const isActiveLayerVisible = Object.prototype.hasOwnProperty.call(layersById, activeLayerId)
        const isSelected = isInBounds && isOnActiveLayer && isActiveLayerVisible
        isSelected && selectedIds.push(layer.id)
      }
    })
    this.onSelectedListChange(selectedIds)
    this.boxSelected = true
  }

  updateSelection = (prevProps) => {
    const {
      objects,
      layer: layerId,
      edit,
      selection: { list: selectedIds, preview },
    } = this.props
    if (
      objects !== prevProps.objects ||
      selectedIds !== prevProps.selection.list ||
      edit !== prevProps.edit ||
      layerId !== prevProps.layer ||
      preview !== prevProps.selection.preview
    ) {
      const selectedIdsSet = new Set(selectedIds)
      const canEditLayer = edit && (selectedIds.length === 1)
      const canDrag = edit && (selectedIds.length > 1)
      this.map.objects.forEach((layer) => {
        if (layer.options.tsType) {
          const { id } = layer
          const isSelected = selectedIdsSet.has(id)
          const isActiveLayer = (layer.options?.tsType === entityKind.FLEXGRID) ||
            (layer.object?.layer === layerId)
          const isActive = canEditLayer && isSelected && isActiveLayer
          const isDraggable = canDrag && isSelected && isActiveLayer
          if (layer._map === null) {
            layer._map = this.map
          }
          setLayerSelected(layer, isSelected, isActive && !(preview && preview.id === id), isActiveLayer,
            isDraggable)
          if (isActive) {
            this.activeLayer = layer
          }
        }
      })
    }
  }

  updateActiveObject = async (prevProps) => {
    const { isMapCOP, activeObjectId, tryLockObject, checkObjectAccess } = this.props

    if (activeObjectId && activeObjectId !== prevProps.activeObjectId) {
      let success = true
      if (isMapCOP) {
        success = await checkObjectAccess(activeObjectId) === access.WRITE
      }
      if (success) {
        success = await tryLockObject(activeObjectId)
      }
      if (!success && this.activeLayer.id === activeObjectId) {
        this.activeLayer.setLocked && this.activeLayer.setLocked(true)
        setLayerSelected(this.activeLayer, true, false)
        this.activeLayer = null
      }
    }
  }

  onStopMeasuring = () => {
    if (!this.byReact) {
      this.props.stopMeasuring()
    }
  }

  moveHandler = useDebounce(() => {
    const center = this.map.getCenter()
    const zoom = this.map.getZoom()
    const isZoomChanged = zoom !== this.view.zoom
    if (!geomPointEquals(center, this.view.center) || isZoomChanged) {
      this.view = { center, zoom }
      const { onMove } = this.props
      onMove(center.wrap(), zoom, isZoomChanged)
      this.updateShowLayersByBounds()
    }
  }, 500)

  updateShowLayer = (levelEdge, layersById, hiddenOpacity, selectedLayerId, item, list) => {
    if (item.object) {
      const { layer, level = 0 } = item.object

      const itemLevel = Math.max(level, SubordinationLevel.TEAM_CREW)
      const isSelectedItem = (item.id && list.includes(item.id)) || item === this.newLayer
      const hidden = !isSelectedItem && (
        (itemLevel < levelEdge) ||
        ((!layer || !Object.prototype.hasOwnProperty.call(layersById, layer)) && !item.catalogId) ||
        (item._groupParent && GROUPS.GENERALIZE.includes(item._groupParent.object.type))
      )

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

  updateShowLayerByBounds = (bounds, item) => {
    const intersect = item.intersectsWithBounds(bounds, this.map)
    const showed = this.map.hasLayer(item)
    if (showed !== intersect) {
      if (intersect) {
        item.addTo(this.map)
      } else {
        item.removeFrom(this.map)
      }
    }
  }

  updateShowLayers = (levelEdge, layersById, hiddenOpacity, selectedLayerId, list) => {
    this.map && this.map.objects.forEach((item) =>
      this.updateShowLayer(levelEdge, layersById, hiddenOpacity, selectedLayerId, item, list))
  }

  updateShowLayersByBounds = () => {
    const bounds = this.map.getBounds()
    this.map.objects
      .filter((item) => item.id && item.object && item.intersectsWithBounds && !item._hidden)
      .forEach((item) => this.updateShowLayerByBounds(bounds, item))
  }

  updateScaleOptions = () => {
    const { params } = this.props
    settings.LINE_SIZE.min = params[paramsNames.LINE_SIZE_MIN]
    settings.LINE_SIZE.max = params[paramsNames.LINE_SIZE_MAX]
    settings.WAVE_SIZE.max = params[paramsNames.WAVE_SIZE_MAX]
    settings.WAVE_SIZE.min = params[paramsNames.WAVE_SIZE_MIN]
    settings.BLOCKAGE_SIZE.max = params[paramsNames.BLOCKAGE_SIZE_MAX]
    settings.BLOCKAGE_SIZE.min = params[paramsNames.BLOCKAGE_SIZE_MIN]
    settings.ROW_MINE_SIZE.max = params[paramsNames.ROW_MINE_SIZE_MAX]
    settings.ROW_MINE_SIZE.min = params[paramsNames.ROW_MINE_SIZE_MIN]
    settings.MOAT_SIZE.max = params[paramsNames.MOAT_SIZE_MAX]
    settings.MOAT_SIZE.min = params[paramsNames.MOAT_SIZE_MIN]
    settings.STROKE_SIZE.max = params[paramsNames.STROKE_SIZE_MAX]
    settings.STROKE_SIZE.min = params[paramsNames.STROKE_SIZE_MIN]
    settings.NODES_SIZE.max = params[paramsNames.NODE_SIZE_MAX]
    settings.NODES_SIZE.min = params[paramsNames.NODE_SIZE_MIN]
    settings.TEXT_AMPLIFIER_SIZE.max = params[paramsNames.TEXT_AMPLIFIER_SIZE_MAX]
    settings.TEXT_AMPLIFIER_SIZE.min = params[paramsNames.TEXT_AMPLIFIER_SIZE_MIN]
    settings.GRAPHIC_AMPLIFIER_SIZE.max = params[paramsNames.GRAPHIC_AMPLIFIER_SIZE_MAX]
    settings.GRAPHIC_AMPLIFIER_SIZE.min = params[paramsNames.GRAPHIC_AMPLIFIER_SIZE_MIN]
    settings.POINT_SYMBOL_SIZE.max = params[paramsNames.POINT_SIZE_MAX]
    settings.POINT_SYMBOL_SIZE.min = params[paramsNames.POINT_SIZE_MIN]
    this.map && this.map.objects.forEach((layer) => setScaleOptions(layer, params))
  }

  updateShowAmplifiers = (showAmplifiers) => {
    this.map && this.map.objects.forEach((layer) => layer.setShowAmplifiers && layer.setShowAmplifiers(showAmplifiers))
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
          REACT_APP_PREFIX: process.env.REACT_APP_PREFIX,
          REACT_APP_TILES: process.env.REACT_APP_TILES,
          tileLayerURL: url,
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

  removeLayer = (layer) => {
    const index = this.map.objects.indexOf(layer)
    if (index >= 0) {
      this.map.objects.splice(index, 1)
    }
    layer.pm && layer.pm.disable()
    layer.remove()
    if (this.catalogsPopup && this.catalogsPopup.isOpen() && this.catalogsPopup._openOver === layer) {
      this.catalogsPopup.remove()
    }
  }

  updateObjects = (objects, preview) => {
    if (this.map) {
      const existsIds = new Set()
      const changes = []
      const regions = []
      const groups = []
      const groupItems = []
      const toDelete = []

      // Визначаємо по списку наявних на карті об'єктів, які треба видалити, які змінити; заповнюємо список існуючих ID
      this.map.objects.forEach((layer) => {
        const { id, options: { tsType: type } } = layer
        if (id && type !== entityKind.FLEXGRID) {
          const object = preview && preview.id && preview.id === id ? preview : objects.get(id)
          if (object) {
            existsIds.add(id)
            if (layer.object !== object) {
              changes.push({ object, layer })
            }
          } else if (!layer.catalogId) {
            toDelete.push(layer)
            if (GROUPS.GENERALIZE.includes(layer.options.tsType) && layer._groupChildren) {
              layer._groupChildren.forEach((child) => toDelete.push(child))
              this.props.onShadowDelete(layer._groupChildren.map(({ id }) => id))
            }
          }
        }
      })

      // Видаляємо з карти об'єкти, яких вже немає в редаксі
      toDelete.forEach(this.removeLayer)

      // Заповнюємо списки групованих об'єктів
      objects.forEach((object) => {
        if (object.parent) {
          switch (objects.get(object.parent)?.type) {
            case entityKind.GROUPED_REGION: {
              if (!regions.includes(object.parent)) {
                regions.push(object.parent)
              }
              break
            }
            case entityKind.GROUPED_LAND:
            case entityKind.GROUPED_HEAD: {
              if (!groups.includes(object.parent)) {
                groups.push(object.parent)
              }
              if (!groupItems.includes(object.id)) {
                groupItems.push(object.id)
              }
              break
            }
            default:
          }
        }
      })

      // По списку змінених об'єктів: перегенеровуємо значки на карті
      for (let i = 0; i < changes.length; i++) {
        const { object, layer } = changes[i]
        const newLayer = this.addObject(object, layer)
        if (newLayer !== layer) {
          setLayerSelected(layer, false, false)
          this.activeLayer = null
          this.removeLayer(layer)
        }
      }

      // Створюємо об'єкти, які є в редаксі, але немає на карті
      objects.forEach((object, id) => {
        if (!existsIds.has(id)) {
          this.addObject(preview && preview.id && preview.id === id ? preview : object, null)
        }
      })

      // Окремо оновлюємо поточний створюваний або редагований об'єкт
      const isNew = Boolean(preview && !preview.id)
      if (isNew) {
        this.newLayer = this.addObject(preview, this.newLayer)
      } else if (this.newLayer) {
        setLayerSelected(this.newLayer, false, false)
        this.removeLayer(this.newLayer)
        this.newLayer = null
      }

      // Очищуємо списки дочірніх об'єктів у групованих об'єктів
      this.map.objects.forEach((layer) => {
        if (layer._groupChildren) {
          layer._groupChildren = []
        }
      })

      // Для групованих об'єктів: заповнюємо список дочірніх, а у них встановлюємо посилання на батьківський
      objects.forEach((object, id) => {
        const parent = object.parent
        if (parent) {
          const layer = this.findLayerById(id)
          const parentLayer = this.findLayerById(parent)
          if (layer && parentLayer) {
            if (!parentLayer._groupChildren) {
              parentLayer._groupChildren = []
            }
            parentLayer._groupChildren.push(layer)
            layer._groupParent = parentLayer
          }
        }
      })

      // Для іконки групованого об'єкта формуємо список ID дочірніх
      objects.forEach((object) => {
        if (GROUPS.GENERALIZE.includes(object.type)) {
          const layer = this.findLayerById(object.id)
          if (layer && layer.options.icon) {
            layer.options.icon.options.data = layer._groupChildren
              ? layer._groupChildren.map(({ object }) => object)
              : []
          }
        }
      })

      // Перерендер "позиційних районів підрозділу"
      regions.forEach((item) => {
        const layer = this.findLayerById(item)
        if (layer) {
          layer._update()
        }
      })

      // Перерендер групованих точкових знаків
      groups.forEach((item) => {
        const layer = this.findLayerById(item)
        if (layer) {
          layer._reinitIcon()
          layer.update()
          layer._groupChildren.forEach(this.removeLayer)
        }
      })
    }
  }

  updateCatalogObjects = (catalogObjects) => {
    if (this.map) {
      const existsIds = new Set()
      const changes = []
      const toDelete = []

      this.map.objects.forEach((layer) => {
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
            toDelete.push(layer)
          }
        }
      })
      toDelete.forEach(this.removeLayer)

      for (let i = 0; i < changes.length; i++) {
        const { object, layer } = changes[i]
        const newLayer = this.addCatalogObject(object, layer)
        if (newLayer !== layer) {
          this.removeLayer(layer)
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

  findLayerDirection = (map, layer) => {
    const pointLocation = map.latLngToContainerPoint(layer._latlng)
    const mapSize = map.getSize()
    let newPosition = 'n'
    const yDiff = yBound - pointLocation.y
    if (yDiff > 0) {
      newPosition = 's'
    }
    let xDiff = pointLocation.x - (mapSize.x - xBound)
    if (xDiff > 0) {
      newPosition += 'w'
    } else {
      xDiff = xBound - pointLocation.x
      if (xDiff > 0) {
        newPosition += 'e'
      }
    }
    return newPosition
  }

  getUnitIndicatorsInfoOnHover = () => {
    let timer
    const lastUnits = {}
    const popupInner = popup(popupOptionsIndicators)
    return (actionType, layer, formationId, object) => {
      const isPopUpOpen = popupInner.isOpen()
      clearTimeout(timer)
      if (actionType === 'open') {
        if (!lastUnits[object.unit]) {
          window.explorerBridge.getUnitIndicators(object.unit, formationId)
          lastUnits[object.unit] = setTimeout(() => (lastUnits[object.unit] = undefined),
            clearLastUnitIdToGetNewRequestForIndicators)
        }

        timer = setTimeout(() => {
          if (layer?._latlng) {
            const unitData = this.getUnitData(object.unit)
            const renderPopUp = renderIndicators(object, unitData)
            const dir = this.findLayerDirection(this.map, layer)
            const getCoordinates = (point) => this.map.unproject(point, this.map.getZoom())
            popupInner.setContent(renderPopUp)
            const pointCoord = this.map.project(layer._latlng, this.map.getZoom())
            let newCoordinates
            switch (dir) {
              case 's': {
                newCoordinates = getCoordinates(L.point(pointCoord.x, pointCoord.y + yBound))
                break
              }
              case 'se': {
                newCoordinates = getCoordinates(L.point(pointCoord.x + xBound, pointCoord.y + yBound))
                break
              }
              case 'sw': {
                newCoordinates = getCoordinates(L.point(pointCoord.x - xBound, pointCoord.y + yBound))
                break
              }
              case 'ne': {
                newCoordinates = getCoordinates(L.point(pointCoord.x + xBound, pointCoord.y))
                break
              }
              case 'nw': {
                newCoordinates = getCoordinates(L.point(pointCoord.x - xBound, pointCoord.y))
                break
              }
              default: {
                newCoordinates = layer._latlng
                break
              }
            }
            popupInner.setLatLng(newCoordinates)
            popupInner.openOn(this.map)
          }
        }, openPopUpInterval,
        )
      } else {
        isPopUpOpen && popupInner._close()
      }
    }
  }

  showUnitIndicatorsHandler = this.getUnitIndicatorsInfoOnHover()

  getUnitData = (unitId) => (this.props.unitsById && this.props.unitsById[unitId]) || {}

  addObject = (object, prevLayer) => {
    const {
      // TODO: тимчасово відключаємо показ характеристик підрозділу
      // layersByIdFromStore,
      level,
      layersById,
      hiddenOpacity,
      params,
      showAmplifiers,
      layer: selectedLayerId,
      selection: { list },
    } = this.props

    const {
      id,
      attributes,
      // TODO: тимчасово відключаємо показ характеристик підрозділу
      // layer: layerInner,
      // unit,
    } = object

    // TODO: тимчасово відключаємо показ характеристик підрозділу
    // const layerObject = layersByIdFromStore[layerInner]

    try {
      validateObject(object && object.toJS ? object.toJS() : object)
    } catch (e) {
      console.error(e)
      return null
    }

    const layer = createTacticalSign(object, this.map, prevLayer)

    if (layer) {
      layer.map = this.map
      layer.options.lineCap = 'butt'
      layer.pm.options.snappable = false // отключаем примагничивание маркеров к объектам при их перемещении
      layer.id = id
      layer.object = object
      // layer.on('click', this.clickOnLayer)
      layer.on('dblclick', this.dblClickOnLayer)
      // TODO: тимчасово відключаємо показ характеристик підрозділу
      /* if (object.type === entityKind.POINT && unit) {
        layer.on('mouseover ', () => this.showUnitIndicatorsHandler(
          openingAction,
          layer,
          layerObject.formationId,
          object,
        ))
        layer.on('mouseout', () => this.showUnitIndicatorsHandler(
          closingAction,
          layer,
          layerObject.formationId,
          object,
        ))
      } */
      layer.on('pm:markerdragstart', this.onMarkerDragStart)
      layer.on('pm:markerdragend', this.onMarkerDragEnd)
      layer.on('pm:dragstart', this.onDragStarted)
      layer.on('pm:drag', this.onDragged)
      layer.on('pm:dragend', this.onDragEnded)
      layer.on('pm:vertexremoved', this.onVertexRemoved)
      layer.on('pm:vertexadded', this.onVertexAdded)

      if (layer === prevLayer) {
        layer.update && layer.update()
        if (layer.pm && layer.pm.enabled()) {
          layer.pm.disable()
          layer.pm.enable()
        }
      } else {
        this.map.objects.push(layer)
      }

      this.updateShowLayer(level, layersById, hiddenOpacity, selectedLayerId, layer, list)

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
    const affiliation = model.app6Data.identities.find(({ title }) => title === object.affiliation) || null
    if (affiliation) {
      amplifiers.affiliation = affiliation.id
    }
    const layer = createCatalogIcon(app6Code, amplifiers, location, prevLayer)
    if (layer) {
      layer.id = id
      layer.object = object
      layer.map = this.map
      // layer.object.level = catalogLevel(catalogId)
      layer.catalogId = catalogId
      layer.on('click', this.clickOnCatalogLayer)
      layer.on('dblclick', this.dblClickOnCatalogLayer)
      // layer.on('pm:markerdragstart', this.onMarkerDragStart)
      // layer.on('pm:markerdragend', this.onMarkerDragEnd)
      // TODO: events

      if (layer === prevLayer) {
        layer.update && layer.update()
      } else {
        this.map.objects.push(layer)
        layer.addTo(this.map)
      }

      const { params } = this.props
      setScaleOptions(layer, params)
    }
    return layer
  }

  onMarkerDragStart = () => {
    this.draggingObject = true
  }

  onMarkerDragEnd = () => setTimeout(() => {
    this.checkSaveObject(false)
    this.draggingObject = false
  }, 250)

  moveListByOne = (layer) => {
    const { selection: { list } } = this.props
    if (list.length > 1) {
      this._dragEndPx = this.map.project(layer._bounds._northEast)
      const delta = {
        x: this._dragEndPx.x - this._dragStartPx.x,
        y: this._dragEndPx.y - this._dragStartPx.y,
      }
      const objects = list.filter((id) => id !== layer.id)
      this.map.objects.forEach((item) => {
        if (item.id && objects.includes(item.id)) {
          const shiftOne = (latLng) => {
            const f = this.map.project(latLng)
            return this.map.unproject(point({
              x: f.x + delta.x,
              y: f.y + delta.y,
            }))
          }
          const shift = (coords) => Array.isArray(coords)
            ? coords.map(shift)
            : shiftOne(coords)
          if (item.getLatLngs && item.setLatLngs) {
            const shifted = shift(item.getLatLngs())
            item.setLatLngs(shifted).redraw()
          } else if (item.getLatLng && item.setLatLng) {
            const shifted = shift(item.getLatLng())
            item.setLatLng(shifted) // .redraw()
          } else if (item instanceof L.GeoJSON) {
            item._shiftPx(delta)
          } else {
            console.warn(item)
          }
        }
      })
      this._dragStartPx = this._dragEndPx
    }
  }

  onDragStarted = ({ target: layer }) => {
    const { selection: { list }, lockedObjects, warningLockObjectsMove } = this.props
    if (list.length > 1) {
      this._dragStartPx = this.map.project(layer._bounds._northEast)
      this._savedDragStartPx = this._dragStartPx
      // Проверка выделенных объектов на блокировку
      if (list.some((objectId) => lockedObjects.has(objectId))) {
        // повідомлення про спробу переміщення заблокованого об'єкта
        warningLockObjectsMove()
        // зупиняємо процес переміщення об'єктів
        layer.dragging?._draggable?.finishDrag && layer.dragging._draggable.finishDrag()
      }
    }
  }

  onDragged = ({ target: layer }) => {
    this.moveListByOne(layer)
  }

  onDragEnded = ({ target: layer }) => {
    this.moveListByOne(layer)
    const { selection: { list } } = this.props
    if (list.length > 1) {
      const delta = calcMoveWM({
        x: this._dragEndPx.x - this._savedDragStartPx.x,
        y: this._dragEndPx.y - this._savedDragStartPx.y,
      }, this.map.getZoom())
      this.props.onMoveObjList(list, delta)
    } else {
      const shift = layer._dragDeltaPx
        ? calcMoveWM(layer._dragDeltaPx, layer._map.getZoom())
        : { x: 0, y: 0 }
      switch (layer.options.tsType) {
        case entityKind.CONTOUR:
          return this.props.onMoveContour(layer.id, shift)
        case entityKind.GROUPED_HEAD:
        case entityKind.GROUPED_LAND:
        case entityKind.GROUPED_REGION:
          return this.props.onMoveGroup(layer.id, shift)
        default:
          return this.checkSaveObject(false)
      }
    }
  }

  onVertexRemoved = () => {
    this.checkSaveObject(false)
  }

  onVertexAdded = (event) => {
    const { layer, workingLayer, marker } = event
    marker.on('dblclick', (event) => {
      event.target = workingLayer || layer
      this.dblClickOnLayer(event)
    })
  }

  clickOnCatalogLayer = (event) => {
    L.DomEvent.stopPropagation(event)
    const { target: layer, target: { object: { name, state, catalogId, country, affiliation } } } = event
    const { catalogs } = this.props
    const catalogName = catalogs[catalogId].name
    let text = `<strong>${catalogName}</strong><br/>`
    name && (text += `<u>${i18n.DESIGNATION}:</u>&nbsp;<span class="nameValue">${name}</span><br/>`)
    state && (text += `<u>${i18n.STATE}:</u>&nbsp;${state}<br/>`)
    country && (text += `<u>${i18n.COUNTRY}:</u>&nbsp;${country}<br/>`)
    affiliation && (text += `<u>${i18n.IDENTITY}:</u>&nbsp;${affiliation}`)
    text = `<div style="overflow:auto;">${text}</div>`
    if (!this.catalogsPopup) {
      this.catalogsPopup = L.popup()
    }
    this.catalogsPopup._openOver = layer
    this.catalogsPopup
      .setLatLng(layer.getLatLng())
      .setContent(text)
      .openOn(layer._map)
  }

  dblClickOnCatalogLayer = (event) => {
    L.DomEvent.stopPropagation(event)
    const { target: { object: { id, catalogId } } } = event
    // todo: move this call outside component (in the actions)
    window.explorerBridge.showCatalogObject(catalogId, id)
  }

  dblClickOnLayer = (event) => {
    // L.DomEvent.stopPropagation(event)
    return this.processDblClickOnLayer(event.target)
  }

  processDblClickOnLayer = async (layer) => {
    const { id, object } = layer
    const { selection: { list }, editObject, onSelectUnit, getLockedObjects } = this.props
    const lockedObjects = await getLockedObjects()
    const lockedIndex = Object.keys(lockedObjects.payload).findIndex((id) => object.id === id)
    if (object && list.length === 1 && list[0] === object.id && lockedIndex < 0) {
      object.id && editObject(object.id)
    } else {
      const targetLayer = object && object.layer
      if (targetLayer && targetLayer !== this.props.layer) {
        await this.selectLayer(id)
        await this.props.onChangeLayer(targetLayer)
        await onSelectUnit(layer?.object?.unit ?? null)
        layer._map._container.focus()
      }
    }
  }

  onDblClick = (event) => {
    const { flexGridVisible, showDirectionNameForm } = this.props
    if (this.flexGrid && flexGridVisible) {
      const { latlng } = event
      const cellClick = this.flexGrid.isInsideCell(latlng)
      if (cellClick) {
        const [ direction ] = cellClick
        showDirectionNameForm({ index: direction - 1 })
      }
    }
  }

  getCursorDescription = (e) => {
    const { flexGridVisible, flexGridData: { eternalDescriptions, directionNames } } = this.props
    if (this.flexGrid && flexGridVisible) {
      if (this.isFlexGridEditingMode()) {
        const eternalProps = this.flexGrid.isOnEternal(e.latlng)
        if (eternalProps) {
          const { position } = eternalProps
          const eternalDescription = eternalDescriptions.get(position[0])
          const description = eternalDescription && eternalDescription[position[1]]
          return { type: ETERNAL, description }
        }
      }
      const cellClick = this.flexGrid.isInsideCell(e.latlng)
      if (cellClick) {
        const [ direction, zone ] = cellClick
        const directionName = directionNames.get(direction - 1)
        const name = `${directionName ? `"${directionName}"` : `№ ${direction}`}`
        return { type: ZONE, name, zone }
      }
    }
    return null
  }

  highlightDirections = (selectedDirections) => {
    const { flexGridVisible } = this.props
    this.flexGrid && flexGridVisible && this.flexGrid.selectDirection(selectedDirections)
  }

  highlightMainDirection = (mainDirectionIndex) => {
    const { flexGridVisible } = this.props
    this.flexGrid && this.flexGrid.setMainDirection(mainDirectionIndex, flexGridVisible)
  }

  highlightEternal = (position, prevPosition) => {
    const { flexGridVisible, flexGridData } = this.props
    if (prevPosition) {
      const { eternals } = flexGridData
      const latLng = eternals.get(prevPosition[0], [])[prevPosition[1]]
      latLng && this.flexGrid.pm.updateEternalManually(latLng)
    }
    this.flexGrid && flexGridVisible && this.flexGrid.pm.selectEternal(position)
  }

  selectLayer = (id, exclusive) => {
    const { selection: { list } } = this.props

    let result = []

    if (id) {
      if (exclusive) {
        result = list.indexOf(id) === -1
          ? [ ...list, id ]
          : list.filter((itemId) => itemId !== id)
      } else if (list.length !== 1 || list[0] !== id) {
        result = [ id ]
      }
    }

    return this.onSelectedListChange(result)
  }

  findLayerById = (id) => {
    for (const lkey of Object.keys(this.map._layers)) {
      const layer = this.map._layers[lkey]
      if (Number(layer.id) === Number(id)) {
        return layer
      }
    }
  }

  /* // TODO: пибрати це після тестування
  handleAddSegment = async () => {
    const bounds = this.map.getBounds()
    const center = bounds.getCenter()
    const width = bounds.getEast() - bounds.getWest()
    // const height = bounds.getNorth() - bounds.getSouth()
    const geometry = [
      { lat: center.lat, lng: center.lng - width / 10 },
      { lat: center.lat, lng: center.lng + width / 10 },
    ]
    const created = await this.addObject({
      type: entityKind.SEGMENT,
      point: calcMiddlePoint(geometry),
      geometry,
      attributes: {
        template: await parseStringPromise(tmp),
        color: 'red',
      },
    }, null)
    setLayerSelected(created, true, true)
  } */

  showFlexGrid = (show) => {
    if (!this.map) {
      return
    }
    if (show) {
      if (this.flexGrid) {
        this.flexGrid.addTo(this.map)
        this.props.inICTMode && this.map.fitBounds(this.flexGrid.getBounds())
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
      this.removeLayer(this.flexGrid)
      // this.flexGrid.removeFrom(this.map)
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
    // layer.on('click', this.clickOnLayer)
    layer.on('dblclick', this.dblClickOnLayer)
    layer.on('pm:markerdragstart', this.onMarkerDragStart)
    layer.on('pm:markerdragend', this.onMarkerDragEnd)
    layer.on('pm:eternaldblclick', this.onDoubleClickEternal)
    if (show && id) {
      layer.addTo(this.map)
    }
    if (id) {
      this.flexGrid = layer
      this.map.objects.push(layer)
      fixFlexGridInstance && fixFlexGridInstance(layer)
    }
    const geometry = getGeometry(layer)
    if (!id) {
      flexGridCreated && flexGridCreated(activeMapId, geometry, { directions, zones })
    } else if (deleted) {
      flexGridChanged && flexGridChanged(id, activeMapId, geometry, { directions, zones })
    }
  }

  updateFlexGrid = (flexGridData, prevData) => {
    const { fixFlexGridInstance, flexGridVisible } = this.props
    const actual = flexGridData.id && !flexGridData.deleted
    if (!actual && this.flexGrid) {
      this.flexGrid.removeFrom(this.map)
      delete this.flexGrid
      fixFlexGridInstance && fixFlexGridInstance(null)
    } else if (actual && !this.flexGrid) {
      this.dropFlexGrid(flexGridVisible)
    } else if (actual && this.flexGrid) {
      if (flexGridVisible /* && flexGridData.directions !== prevData.directions */) { // срабатывает в случаях ненативного изменения ОЗ (изменения через модальные окна деления/переноса через координаты, etc.)
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
  }

  onDoubleClickEternal = (eternalProps) => eternalProps && this.props.showEternalDescriptionForm(eternalProps)

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
    if (data.type === 'symbol') {
      const point = this.map.mouseEventToLatLng(e)
      const { lat, lng } = point
      this.props.newShapeFromSymbol(data, { lat, lng })
    }
    if (data.type === 'line') {
      const point = this.map.mouseEventToContainerPoint(e)
      const { x, y } = point
      const { amp, isFlip } = data
      const size = this.map.getSize()
      const w = Math.max(Math.min(size.x, size.y) / 4, 128)
      const sw = w / 2
      const c2g = (p) => this.map.containerPointToLatLng(p)
      let geometry = []
      if (amp.type === entityKind.SOPHISTICATED) {
        geometry = (geometry && geometry.length) ||
          findDefinition(data.code).init(data.amp).map(({ x: dx, y: dy }) => ({
            x: x - w + dx * w * 2,
            y: y - w + dy * w * 2,
          })).map(c2g)
      } else if (amp.type === entityKind.CURVE || amp.type === entityKind.AREA || amp.type === entityKind.POLYGON) {
        const p0 = { x: x + sw, y }
        const p1 = { x: x - sw, y: y - sw }
        const p2 = { x: x - sw, y: y + sw }
        if (isFlip) {
          geometry = [ p2, p1, p0 ].map(c2g)
        } else {
          geometry = [ p0, p1, p2 ].map(c2g)
        }
        // eslint-disable-next-line max-len
      } else if (amp.type === entityKind.POLYLINE || amp.type === entityKind.RECTANGLE || amp.type === entityKind.SQUARE) {
        const p0 = { x: x + sw, y: y + sw }
        const p1 = { x: x - sw, y: y - sw }
        geometry = [ p0, p1 ].map(c2g)
      } else if (amp.type === entityKind.OLOVO) {
        const { directions = 3, zones = 2 } = amp.params || {}
        const box = this.map.getBounds().pad(-0.4)
        geometry = generateGeometry(zones, directions, box)
      } else {
        const p0 = { x, y }
        const p1 = { x: x + sw, y: y + sw }
        geometry = [ p0, p1 ].map(c2g)
      }
      this.props.newShapeFromLine(data, this.map.containerPointToLatLng(point), geometry)
    }
  }

  disableDrawLineSquareMark = () => {
    const {
      selection: { newShape },
      disableDrawUnit,
    } = this.props

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
    let activeLayer
    if (entityKindMultipointCurves.includes(type)) {
      activeLayer = this.map.pm.Draw && this.map.pm.Draw.Line._layer
    } else if (entityKindMultipointAreas.includes(type)) {
      activeLayer = this.map.pm.Draw && this.map.pm.Draw.Polygon._layer
    }
    if (activeLayer) {
      this.createNewShape({ layer: activeLayer })
      this.map.pm.disableDraw()
    }
  }

  undoHandler = () => {
    const { edit, undoInfo: { canUndo }, undo } = this.props
    edit && canUndo && undo && undo()
  }

  redoHandler = () => {
    const { edit, undoInfo: { canRedo }, redo } = this.props
    edit && canRedo && redo && redo()
  }

  render () {
    return (
      <>
        <HotKey selector={shortcuts.ESC} onKey={this.escapeHandler}/>
        <HotKey selector={shortcuts.SPACE} onKey={this.spaceHandler}/>
        <HotKey selector={shortcuts.ENTER} onKey={this.enterHandler}/>
        <HotKey selector={shortcuts.UNDO} onKey={this.undoHandler} />
        <HotKey selector={shortcuts.REDO} onKey={this.redoHandler} />
        {/* <HotKey selector={shortcuts.ADD_SEGMENT} onKey={this.handleAddSegment} /> */}
        <div
          onDragOver={this.dragOverHandler}
          onDrop={this.dropHandler}
          ref={(container) => {
            this.container = container
            this.container && this.container.removeAttribute('tabindex')
          }}
          className='catalog-leaflet-popup'
        >
          <MapProvider value={this.map}>{this.props.children}</MapProvider>
          {this.props.flexGridVisible && (
            <FlexGridToolTip
              startLooking={this.enableLookAfterMouseMove}
              stopLooking={this.disableLookAfterMouseMove}
              getCurrentCell={this.getCursorDescription}
              names={this.props.flexGridData.directionNames}
            />
          )}
        </div>
      </>
    )
  }
}

/** Do not delete, please, it is FIX */
export const buildFlexGridGeometry = formFlexGridGeometry
