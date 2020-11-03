import L from 'leaflet'

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

}
