import { concat } from 'lodash'
import { DivIcon, layerGroup, marker } from 'leaflet'
import { createItemNumber } from './itemNumbers'
import { isAreaOnScreen, setInitCoordinates } from './../helpers'

const createIcon = (text) => {
  const maxWidth = 200
  const fullHeight = 20
  const x = 5
  const y = 15
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${maxWidth}" height="${fullHeight}" viewBox="0 0 ${maxWidth} ${fullHeight}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <text fill="#000" style=" color: red; white-space: pre;" x="${x}" y="${y}" >${text}</text>
</svg>`
}

export const createMarkersGroup = (coordinatesMatrix, scale) => {
  const markers = concat(...coordinatesMatrix).map((coordinates) => {
    const markerCoordinate = [ coordinates[1][0], coordinates[0][1] ]
    const itemNumber = createItemNumber(markerCoordinate, scale)
    return marker(markerCoordinate, { icon: new DivIcon({
      className: `my-div-icon`,
      html: createIcon(itemNumber),
    }),
    })
  })
  return layerGroup(markers)
}

const isMarkerExist = (coordinate, markers) =>
  markers.some((marker) => {
    const { lat, lng } = marker._latlng
    const isLatExist = lat.toFixed(6) === coordinate[0].toFixed(6)
    const isLngExist = lng.toFixed(6) === coordinate[1].toFixed(6)
    return isLatExist && isLngExist
  })

export const updateMarkers = (coordinatesMatrix, scale, currentMarkers, map) => {
  const screenCoordinates = setInitCoordinates(map.getBounds())
  // Видаляємо ті що виходять за межі екрану
  currentMarkers.getLayers().forEach((marker) => {
    const position = marker._latlng
    !isAreaOnScreen(position, scale, screenCoordinates) && marker.removeFrom(currentMarkers)
  })
  // Додаємо нові
  const markers = currentMarkers.getLayers()
  concat(...coordinatesMatrix).forEach((coordinate) => {
    const markerCoordinate = [ coordinate[1][0], coordinate[0][1] ]
    if (!isMarkerExist(markerCoordinate, markers)) {
      const newMarker = marker(markerCoordinate, { icon: new DivIcon({
        className: `my-div-icon`,
        html: createIcon(createItemNumber(markerCoordinate, scale)),
      }),
      })
      currentMarkers.addLayer(newMarker)
    }
  })
}
