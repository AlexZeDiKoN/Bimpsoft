import proj4 from 'proj4'
import { roundXY } from '../../utils/svg/lines'
import { getMapObjectSvg } from './mapObject'

const PRINT_SCALE = 10
const METERS_PER_INCH = 0.0254

const getCoordToPixels = (projection, dpi, scale, { min, max }) => {
  const metersToPixels = dpi / scale / METERS_PER_INCH

  const tX = -(min.lng + max.lng) / 2
  const tY = -(min.lat + max.lat) / 2
  const width = (max.lng - min.lng) * metersToPixels
  const height = (max.lat - min.lat) * metersToPixels

  return ({ lng, lat }) => {
    const [ x, y ] = proj4(projection, [ lng, lat ])
    return {
      x: (x + tX) * metersToPixels + width / 2,
      y: (y + tY) * (-metersToPixels) + height / 2,
    }
  }
}

export const getMapObjectsSvg = (objects, southWest, northEast, projection, dpi, printScale) => {
  const [ lngSW, latSW ] = proj4(projection, [ southWest.lng, southWest.lat ])
  const [ lngNE, latNE ] = proj4(projection, [ northEast.lng, northEast.lat ])

  const boundsCoord = {
    min: { lng: Math.min(lngSW, lngNE), lat: Math.min(latSW, latNE) },
    max: { lng: Math.max(lngSW, lngNE), lat: Math.max(latSW, latNE) },
  }

  const coordToPixels = getCoordToPixels(projection, dpi, printScale, boundsCoord)

  const { x: xSW, y: ySW } = roundXY(coordToPixels(southWest))
  const { x: xNE, y: yNE } = roundXY(coordToPixels(northEast))
  const bounds = {
    min: { x: Math.min(xSW, xNE), y: Math.min(ySW, yNE) },
    max: { x: Math.max(xSW, xNE), y: Math.max(ySW, yNE) },
  }
  const commonData = { bounds, coordToPixels, scale: PRINT_SCALE }
  const groups = objects.map(getMapObjectSvg(commonData)).filter(Boolean).toArray()

  const width = bounds.max.x - bounds.min.x
  const height = bounds.max.y - bounds.min.y
  return `
<svg
  xmlns="http://www.w3.org/2000/svg" version="1.2"
  x="0px" y="0px" width="${width}px" height="${height}px"
  viewBox="${bounds.min.x} ${bounds.min.y} ${width} ${height}" fill="none">
  ${groups.join('\r\n')}
</svg>`
}
