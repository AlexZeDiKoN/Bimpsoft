import { utils } from '@DZVIN/CommonComponents'
import { model } from '@DZVIN/MilSymbolEditor'
import L from 'leaflet'
import { calcMiddlePoint } from '../../utils/mapObjConvertor'
import './patch'
import entityKind, { GROUPS } from './entityKind'

const { Coordinates: Coord } = utils

const latLng2peerArr = (data) =>
  data && Array.isArray(data)
    ? data.map(latLng2peerArr)
    : [ data.lng, data.lat ]

// ------------------------ Фіксація активного тактичного знака --------------------------------------------------------

const recursiveForEach = (markers, func) => {
  for (const marker of markers) {
    if (Array.isArray(marker)) {
      recursiveForEach(marker, func)
    } else {
      func(marker)
    }
  }
}

const getMarkers = (layer) => {
  const { _markers, _editMarker } = layer.pm
  const markers = _markers || []
  if (_editMarker) {
    markers.push(_editMarker)
  }
  return markers
}

export const enableEdit = (layer) => {
  if (layer.options.tsType === entityKind.GROUPED_REGION) {
    return
  }
  if (GROUPS.COMBINED.includes(layer.options.tsType)) {
    layer.pm.enable()
  } else {
    if (layer.options.tsType !== entityKind.POINT && layer.options.tsType !== entityKind.TEXT) {
      layer.pm.enableLayerDrag()
      layer.on('pm:dragstart', () => {
        const { _markerGroup, _helperLayers } = layer.pm
        _markerGroup && _markerGroup.clearLayers()
        _helperLayers && _helperLayers.clearLayers()
      })
      layer.on('pm:dragend', () => {
        layer.pm._initMarkers()
      })
    }
    layer.pm.enable()
    const click = layer.fire.bind(layer, 'click')
    const dblclick = layer.fire.bind(layer, 'dblclick')
    recursiveForEach(getMarkers(layer), (marker) => {
      marker.on('click', click)
      marker.on('dblclick', dblclick)
    })
  }
}

export const disableEdit = (layer) => {
  recursiveForEach(getMarkers(layer), (marker) => {
    marker.off('click')
    marker.off('dblclick')
  })

  layer.pm.disable()
}

export const setLayerSelected = (layer, selected, active, activeLayer, isDraggable) => {
  layer.setSelected && layer.setSelected(selected, activeLayer)
  if (layer.pm?.enabled() !== active) {
    if (active) {
      enableEdit(layer)
    } else {
      disableEdit(layer)
    }
  }
  if (isDraggable !== undefined && isDraggable !== layer.options.draggable) {
    layer.options.draggable = isDraggable
    if (isDraggable) {
      layer.pm.enableLayerDrag()
    } else {
      layer.pm.disableLayerDrag()
    }
  }
}

// ------------------------ Функції створення тактичних знаків відповідного типу ---------------------------------------
export function createTacticalSign (data, map, prevLayer) {
  const { type } = data
  switch (Number(type)) {
    case entityKind.POINT:
      return createPoint(data, prevLayer)
    case entityKind.TEXT:
      return createText(data, prevLayer)
    case entityKind.SEGMENT:
      return createSegment(data, prevLayer)
    case entityKind.AREA:
      return createPolygon(entityKind.AREA, data, prevLayer)
    case entityKind.CURVE:
      return createPolyline(entityKind.CURVE, data, prevLayer)
    case entityKind.POLYGON:
      return createPolygon(entityKind.POLYGON, data, prevLayer)
    case entityKind.POLYLINE:
      return createPolyline(entityKind.POLYLINE, data, prevLayer)
    case entityKind.CIRCLE:
      return createCircle(data, map, prevLayer)
    case entityKind.RECTANGLE:
      return createRectangle(data, prevLayer)
    case entityKind.SQUARE:
      return createSquare(data, map, prevLayer)
    case entityKind.CONTOUR:
      return createContour(data, prevLayer)
    case entityKind.GROUPED_HEAD:
      return createGroup(entityKind.GROUPED_HEAD, data, prevLayer)
    case entityKind.GROUPED_LAND:
      return createGroup(entityKind.GROUPED_LAND, data, prevLayer)
    case entityKind.GROUPED_REGION:
      return createGroup(entityKind.GROUPED_REGION, data, prevLayer)
    case entityKind.SOPHISTICATED:
      return createSophisticated(data, prevLayer, map)
    default:
      console.error(`Невідомий тип тактичного знаку: ${type}`)
      return null
  }
}

export function createSearchMarker (point, bounce = true) {
  const icon = new L.Icon.Default({ imagePath: `${process.env.REACT_APP_PREFIX}/images/` })
  return L.marker([ point.lat, point.lng ], { icon, keyboard: false, draggable: false, bounceOnAdd: bounce })
}

export function createCoordinateMarker (point) {
  return L.marker(point, {
    icon: L.divIcon({
      className: 'marker-icon',
    }),
    keyboard: false,
    draggable: false,
  })
}

function createMarker (point, icon, layer) {
  if (layer && (layer instanceof L.DzvinMarker)) {
    layer.setIcon(icon)
    layer.setLatLng(point)
  } else {
    layer = new L.DzvinMarker(point, {
      icon,
      keyboard: false,
      draggable: false,
      pane: 'overlayPane',
    })
  }
  layer._bounds = L.latLngBounds([ point ])
  return layer
}

export function createCatalogIcon (code, amplifiers, point, layer) {
  if (point) {
    if (amplifiers.affiliation !== undefined) {
      code = model.APP6Code.setIdentity2(code, amplifiers.affiliation)
    }
    const icon = new L.PointIcon({ data: { code, amplifiers } })
    const marker = createMarker(point, icon, layer)
    marker.options.tsType = entityKind.POINT
    return marker
  }
}

function createSophisticated (data, layer, initMap) {
  if (layer && (layer instanceof L.Polyline)) {
    layer.setLatLngs(data.geometry.toJS())
  } else {
    layer = new L.Sophisticated(
      {
        ...prepareOptions(entityKind.SOPHISTICATED),
        textAmplifiers: data.attributes.textAmplifiers,
        pointAmplifier: data.attributes.pointAmplifier,
        params: data.attributes.params,
        ...(data.attributes.sectorsInfo ? { sectorsInfo: data.attributes.sectorsInfo } : {}),
      },
      data.code,
      data.geometry?.toJS(),
      initMap,
    )
  }
  return layer
}

function createPoint (data, layer) {
  const { point } = data
  const icon = new L.PointIcon({ data })
  layer = createMarker(point, icon, layer)
  layer.options.tsType = entityKind.POINT
  return layer
}

function createText (data, layer) {
  const { point } = data
  const icon = new L.TextIcon({ data })
  layer = createMarker(point, icon, layer)
  layer.options.tsType = entityKind.TEXT
  return layer
}

function createSegment (data) {
  const { geometry, attributes } = data
  const points = geometry && geometry.toJS ? geometry.toJS() : geometry
  const { template, color } = attributes
  const options = prepareOptions(entityKind.SEGMENT, color, template)
  return L.polyline(points, options)
}

function createGroup (kind, data, layer) {
  const { geometry, attributes } = data
  const points = geometry.toJS()
  const { scale } = attributes
  const options = prepareOptions(kind)
  options.tsScale = scale
  switch (kind) {
    case entityKind.GROUPED_HEAD:
    case entityKind.GROUPED_LAND: {
      const data = layer
        ? layer._groupChildren.map(({ object: { code, attributes } }) => ({ code, attributes }))
        : []
      const icon = new L.GroupIcon({ data })
      return createMarker(points[0], icon, layer)
    }
    default:
      return L.polyline(points, options)
  }
}

function createPolygon (type, data, layer) {
  if (layer && (layer instanceof L.Polygon)) {
    layer.setLatLngs(data.geometry.toJS())
    layer.setStyle({ tsType: type })
  } else {
    const options = prepareOptions(type)
    layer = L.polygon(data.geometry.toJS(), options)
  }
  return layer
}

function createPolyline (type, data, layer) {
  if (layer && (layer instanceof L.Polyline)) {
    layer.setLatLngs(data.geometry.toJS())
    layer.setStyle({ tsType: type })
  } else {
    const options = prepareOptions(type)
    layer = L.polyline(data.geometry.toJS(), options)
  }
  return layer
}

function createCircle (data, map) {
  const [ point1, point2 ] = data.geometry.toJS()
  if (!point1 || !point2) {
    console.error('createCircle: немає координат для круга')
    return
  }
  const options = prepareOptions(entityKind.CIRCLE)
  options.radius = map.distance(point1, point2)
  return L.circle(point1, options)
}

const geoJSONLayer = (coordinates, type, tsType, style, geomData) => L.geoJSON(geomData
  ? {
    type: 'FeatureCollection',
    features: geomData.map((geometry) => ({
      type: 'Feature',
      geometry,
    })),
  } : {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type,
          coordinates,
        },
      },
    ],
  }, {
  ...prepareOptions(tsType),
  style,
})

function createGeoJSONLayer (data, layer, type, style, geometry) {
  if (layer?._checkData === data) {
    return layer
  }
  // if (layer && (layer instanceof L.GeoJSON)) {
  // TODO: не перестворювати об'єкт L.GeoJSON, змінювати властивості
  // } else {
  if (geometry) {
    layer = geoJSONLayer(null, null, type, style, data)
    layer._checkData = geometry
  } else {
    const points = data.geometry.toJS()
    const coordinates = latLng2peerArr(points)
    try {
      layer = geoJSONLayer(coordinates, 'Polygon', type, style)
    } catch (err) {
      layer = geoJSONLayer(coordinates, 'MultiPolygon', type, style)
    }
    layer._data = points
    layer._bounds = L.latLngBounds(points.flat(4))
  }
  // }
  layer._checkData = data
  return layer
}

const createContour = (data, layer) => createGeoJSONLayer(data, layer, entityKind.CONTOUR, {
  weight: 3,
  fillOpacity: 0.1,
}, false)

export const createTargeting = (data, layer) => createGeoJSONLayer(data, layer, entityKind.TARGETING, {
  weight: 0,
  fillOpacity: 0.2,
}, true)

function createRectangle (data, layer) {
  const bounds = Array.isArray(data) ? data : data.geometry.toJS()
  if (layer && (layer instanceof L.Rectangle)) {
    layer.setBounds(bounds)
  } else {
    const options = prepareOptions(entityKind.RECTANGLE)
    layer = L.rectangle(bounds, options)
  }
  return layer
}

function createSquare (data, map, layer) {
  let [ point1 = null, point2 = null ] = data.geometry.toJS()
  if (!Coord.check(point1) || !Coord.check(point2)) {
    return null
  }
  const width = map.distance(point1, { lat: point1.lat, lng: point2.lng })
  point2 = L.CRS.Earth.calcPairRightDown(point1, width)
  return createRectangle([ point1, point2 ], layer)
}

function prepareOptions (signType, color, js) {
  const options = {
    tsType: signType,
    tsTemplate: js,
    interactive: signType !== entityKind.TARGETING,
    noClip: true,
    draggable: false, // signType === entityKind.CONTOUR,
    // renderer: new L.SVG(),
  }
  if (js && js.svg && js.svg.path && js.svg.path[0] && js.svg.path[0].$) {
    const $ = js.svg.path[0].$
    options.stroke = ($.stroke && $.stroke !== 'none')
    if (options.stroke) {
      options.color = color || $.stroke
      options.opacity = $['stroke-opacity']
      options.weight = $['stroke-width']
      options.lineCap = $['stroke-linecap']
      options.lineJoin = $['stroke-linejoin']
      options.dashArray = $['stroke-dasharray']
      options.dashOffset = $['stroke-dashoffset']
    }
    options.fill = ($.fill && $.fill !== 'none')
    if (options.fill) {
      options.fillColor = $.fill
      options.fillOpacity = $['fill-opacity']
      options.fillRule = $['fill-rule']
    }
  }
  return options
}

export function getGeometry (layer) {
  switch (layer.options.tsType) {
    case entityKind.POINT:
    case entityKind.TEXT:
      return formGeometry(layer.getLatLng ? [ layer.getLatLng() ] : layer.getLatLngs())
    case entityKind.SEGMENT:
    case entityKind.POLYLINE:
    case entityKind.CURVE:
    case entityKind.GROUPED_HEAD:
    case entityKind.GROUPED_LAND:
    case entityKind.GROUPED_REGION:
    case entityKind.SOPHISTICATED:
      return formGeometry(layer.getLatLngs())
    case entityKind.POLYGON:
    case entityKind.AREA: {
      const coords = layer.getLatLngs()
      const result = Array.isArray(coords[0])
        ? coords[0]
        : coords
      return formGeometry(result)
    }
    case entityKind.RECTANGLE:
    case entityKind.SQUARE:
      return formRectGeometry(layer.getLatLngs()[0])
    case entityKind.CIRCLE:
      return formCircleGeometry(layer.getLatLng(), layer.getRadius())
    case entityKind.CONTOUR:
      return layer._data ? { geometry: layer._data } : {}
    case entityKind.FLEXGRID:
      return formFlexGridGeometry(layer.eternals, layer.directionSegments, layer.zoneSegments)
    default:
      return null
  }
}

export const roundCoord = (value) => value === null ? NaN : Math.round(Number(value) * 1000000) / 1000000

export const geomPointEquals =
  (p1, p2) => p1 && p2 && roundCoord(p1.lat) === roundCoord(p2.lat) && roundCoord(p1.lng) === roundCoord(p2.lng)

function geomPointListEquals (list1, list2) {
  if (Array.isArray(list1) && Array.isArray(list2)) {
    const n = list1.length
    if (n !== list2.length) {
      return false
    }
    for (let i = 0; i < n; i++) {
      if (!geomPointListEquals(list1[i], list2[i])) {
        return false
      }
    }
    return true
  } else {
    return geomPointEquals(list1, list2)
  }
}

export function isGeometryChanged (layer, point, geometry) {
  const { options: { tsType } } = layer
  switch (tsType) {
    case entityKind.POINT:
    case entityKind.TEXT:
      return !geomPointEquals(layer.getLatLng ? layer.getLatLng() : layer.getLatLngs()[0][0], point)
    case entityKind.SEGMENT:
    case entityKind.POLYLINE:
    case entityKind.CURVE:
    case entityKind.GROUPED_HEAD:
    case entityKind.GROUPED_LAND:
    case entityKind.GROUPED_REGION:
    case entityKind.SOPHISTICATED:
      return !geomPointListEquals(layer.getLatLngs(), geometry)
    case entityKind.POLYGON:
    case entityKind.AREA:
      return !geomPointListEquals(layer.getLatLngs()[0], geometry)
    case entityKind.RECTANGLE:
    case entityKind.SQUARE: {
      const bounds = L.latLngBounds(layer.getLatLngs()[0])
      return !geomPointListEquals([ bounds.getNorthWest(), bounds.getSouthEast() ], geometry)
    }
    case entityKind.CIRCLE:
      return !geomPointEquals(layer.getLatLng(), point) || layer._map.distance(...geometry) !== layer.getRadius()
    case entityKind.FLEXGRID:
      return !geomPointListEquals([ layer.eternals, layer.directionSegments, layer.zoneSegments ], geometry)
    default:
      return false
  }
}

function formGeometry (coords) {
  return {
    point: calcMiddlePoint(coords),
    geometry: coords,
  }
}

export function formFlexGridGeometry (eternals, directionSegments, zoneSegments) {
  return {
    point: calcMiddlePoint(eternals.reduce((result, item) => result.concat(item), [])),
    geometry: [ eternals, directionSegments, zoneSegments ],
  }
}

function formRectGeometry (coords) {
  const bounds = L.latLngBounds(coords)
  return {
    point: calcMiddlePoint(coords),
    geometry: [ bounds.getNorthWest(), bounds.getSouthEast() ],
  }
}

function formCircleGeometry (point, radius) {
  const lng = point.toBounds(radius * 2).getEast()
  return {
    point,
    geometry: [ point, { lat: point.lat, lng } ],
  }
}
