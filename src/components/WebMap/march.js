import L from 'leaflet'
import { ZOOM_BORDER } from '../../constants/March'

const drawMarchLine = (layer, marchDots) => {
  if (!layer.marchLines) {
    layer.marchLines = []
  }
  if (layer.marchLines.length > 0) {
    layer.marchLines.forEach((line) => {
      line.removeFrom(layer.map)
    })
    layer.marchLines = []
  }

  marchDots.forEach(({ coordinates, options, route }, id) => {
    if (id !== marchDots.length - 1) {
      let marchLine
      if (route && route.coordinates && route.coordinates.length) {
        const { coordinates } = route
        marchLine = L.polyline(coordinates, options)
        marchLine.addTo(layer.map)
        layer.marchLines.push(marchLine)
        marchLine = L.polyline([ coordinates[ coordinates.length - 1 ], marchDots[id + 1].coordinates ], options)
        marchLine.addTo(layer.map)
        layer.marchLines.push(marchLine)
      } else {
        marchLine = L.polyline([ coordinates, marchDots[id + 1].coordinates ], options)
        marchLine.addTo(layer.map)
        layer.marchLines.push(marchLine)
      }
    }
  })
  // console.log('draw', layer.marchLines)
}

const _onMarkerDragStart = (layer) => (markerEvent) => {
  const marker = markerEvent.target
  const marchDots = layer.props?.marchDots
  if (marker._middle) { // средний маркер между опорными и промежуточными меняем на промежуточний
    marker.options.icon = L.divIcon({ className: `marker-icon` })
    if (marker._map) {
      marker._icon.classList.remove('marker-icon-middle')
    }
    // определение места вставки
    const index = marchDots.findIndex((dot) => dot === marker.baseDot)
    if (index >= 0) {
      const dot = { coordinates: marker._latlng, isIntermediatePoint: true, options: { ...marchDots[index].options } }
      marker.dot = dot
      // вставляем промежуточный маркер в общий список в соответствующую позицию
      marchDots.splice(index + 1, 0, dot)
    }
  } else {
    // marker.dot = { coordinates: marker._latlng, isIntermediatePoint: true }
  }
}

const _onMarkerDragEnd = (layer) => (markerEvent) => {
  const marker = markerEvent.target
  // перегенерация марша
  if (marker._middle) {
    // Добавляем промежуточный пункт
    layer.props?.addChildMarch &&
    layer.props.addChildMarch(marker.baseDot.segmentId, marker.baseDot.childId, true, marker._latlng)
  } else {
  layer.props?.setCoordDotForMarch &&
  layer.props.setCoordDotForMarch({
    segmentId: marker.baseDot.segmentId,
    childId: marker.baseDot.childId,
    val: marker._latlng,
  })
  }
  // this._layer.fire('pm:markerdragend', { markerEvent })
}

const _onMarkerDrag = (layer) => (markerEvent) => {
  const marker = markerEvent.target
  if (!marker.baseDot.route) { // для маршрутов проложенных по дорогам не тянем линии за маркером
    if (marker._middle) {
      marker.dot.coordinates = marker._latlng
    } else {
      marker.baseDot.coordinates = marker._latlng
    }
    // перерисовка маршрута по новым координатам
    drawMarchLine(layer, layer.props.marchDots)
  }
}

const createRegulationMarker = (dot, nextDot, zoom) => {
  const { isActivePoint, coordinates } = dot
  const { lat, lng } = coordinates
  const { lat: nextLatY, lng: nextLngX } = nextDot.coordinates
  const ly = lat - nextLatY
  const lx = lng - nextLngX
  const tanValue = ly / lx
  const radTanAngle = Math.atan(tanValue)
  const degreesTanAngle = radTanAngle * 180 / Math.PI
  let width, height

  if (zoom > ZOOM_BORDER.get('first').scale) {
    width = height = ZOOM_BORDER.get('first').size
  } else {
    width = height = ZOOM_BORDER.get('last').size
  }
  const iconAnchorOffset = width / 2
  const colorLine = isActivePoint ? '#FF4500' : '#2B2A29'

  const svgRegulationIcon = `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="${width}" height="${height}" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
viewBox="0 0 2150 400">
 <defs>
  <style>
    .str0 {stroke:${colorLine};stroke-width:50;stroke-miterlimit:22.9256}
    .str1 {stroke:${colorLine};stroke-width:50;stroke-miterlimit:22.9256;stroke-dasharray:250.000000 150.000000}
    .fil0 {fill:none}
  </style>
 </defs>
 <g transform="rotate(${90 - degreesTanAngle} 1075 200)">
  <circle class="fil0 str0" cx="204.01" cy="197.65" r="147.52"/>
  <line class="fil0 str0" x1="104.9" y1="88.38" x2="303.05" y2= "306.98" />
  <line class="fil0 str0" x1="92.14" y1="293.82" x2="315.96" y2= "101.58" />
  <line class="fil0 str1" x1="351.52" y1="196.87" x2="1793.97" y2= "194.71" />
  <circle class="fil0 str0" cx="1932.47" cy="197.65" r="147.52"/>
  <line class="fil0 str0" x1="1833.36" y1="88.38" x2="2031.51" y2= "306.98" />
  <line class="fil0 str0" x1="1820.6" y1="293.82" x2="2044.43" y2= "101.58" />
 </g>
</svg>`

  const regulationIcon = L.divIcon({
    className: '',
    html: svgRegulationIcon,
    iconAnchor: [ iconAnchorOffset, iconAnchorOffset ],
  })

  return L.marker(dot.coordinates, { icon: regulationIcon })
}

export const getScaleBorderNameByValue = (scaleValue) => {
  for (const [ key, value ] of ZOOM_BORDER) {
    if (scaleValue > value.scale) {
      return key
    }
  }
  return null
}

export const marchMarker = {
  drawMarchLine,

  createIntermediateMarker: (point, middle, active = false, parent) => {
    const icon = L.divIcon({ className: `marker-icon ${middle ? 'marker-icon-middle' : ''} ${active ? 'marker-icon-active' : ''}` })
    const markerMarch = L.marker([ point.lat, point.lng ], { icon, keyboard: false, draggable: true })
    markerMarch._middle = middle
    markerMarch.on('move', _onMarkerDrag(parent), parent)
    markerMarch.on('dragstart', _onMarkerDragStart(parent), parent)
    markerMarch.on('dragend', _onMarkerDragEnd(parent), parent)
    return markerMarch
  },

  createRegulationMarker,

}
