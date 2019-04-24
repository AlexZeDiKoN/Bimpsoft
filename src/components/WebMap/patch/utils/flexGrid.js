import * as R from 'ramda'
import memoize from 'memoize-one'
import { buildFlexGridGeometry } from '../../'
import { calcControlPoint, halfPoint } from './Bezier'

const pointToArr = ({ lat, lng, x, y }) => [ x || lat, y || lng ]
const toLatLng = (point) => point.hasOwnProperty('lat') ? point : { lat: point.x, lng: point.y }
const toXY = (props) => Array.isArray(props)
  ? { x: props[0], y: props[1] }
  : props.hasOwnProperty('x')
    ? props
    : { x: props.lat, y: props.lng }

export const dividingCurrent = (flexGrid, index) => {
  const { zoneSegments, eternals, directions, zones, directionSegments, directionNames } = flexGrid
  const divPoints = getPointsDivZones(eternals, zoneSegments, index)
  const newDirections = directions + 1
  const newDirectionSegments = directionSegments.insert(index + 1, [ ...Array(zones * 2) ].map(() => [])).toArray()
  const newEternals = eternals.insert(index + 1, divPoints).toArray()
  const newDirectionNames = directionNames.size > index
    ? directionNames.insert(index + 1, null).toArray()
    : directionNames.toArray()
  const newZoneSegments = changeZoneSegments(zoneSegments, index).toArray()
  const geometryProps = buildFlexGridGeometry(newEternals, newDirectionSegments, newZoneSegments)
  const attrProps = {
    zones,
    directions: newDirections,
    directionNames: newDirectionNames,
  }
  return { geometryProps, attrProps }
}

const getPointsDivZones = (eternals, segments, index) => segments.toArray().map(getMiddlePoint(eternals, index))

const getMiddlePoint = memoize((eternals, index) =>
  (segment, i) => {
    const arr = getRulePoints(eternals, index, segment, i)
    if (!(arr.length % 2)) { // если в итоговом массиве четное количество точек
      const points = arr.splice(arr.length / 2 - 2, 4)
      const [ , cp2 ] = calcControlPoint(pointToArr(points[0]), pointToArr(points[1]), pointToArr(points[2]))// getting controlPoints
      const [ cp1 ] = calcControlPoint(pointToArr(points[1]), pointToArr(points[2]), pointToArr(points[3]))// getting controlPoints
      return toLatLng(halfPoint(toXY(points[1]), toXY(cp2), toXY(cp1), toXY(points[2])))
    }
    return toLatLng(arr[Math.floor(arr.length / 2)])
  }
)

const changeZoneSegments = (segments, index) => segments.map((column) => {
  const newCol = [ ...column ]
  const newZones = makeTwoSegmentArrays(column[index])
  newCol.splice(index, 1, ...newZones)
  return newCol
})

const makeTwoSegmentArrays = (list) => {
  if (list.length > 1) {
    const isOdd = !!(list.length % 2)
    const middlePoint = Math.floor(list.length / 2)
    const startedArr = list.slice(0, middlePoint)
    const lastArr = list.slice(isOdd ? middlePoint + 1 : middlePoint)
    return [ startedArr, lastArr ]
  }
  return [ [], [] ]
}

const getRulePoints = (eternals, index, segment, i) => {
  const line1 = eternals.get(index)
  const line2 = eternals.get(index + 1)
  const currentSegment = segment[index]
  const defaultArray = [ line1[i], ...currentSegment, line2[i] ]
  if (defaultArray.length < 3) {
    const line0 = eternals.get(index - 1) || line1
    const line3 = eternals.get(index + 2) || line2
    const nextSegment = segment[index + 1] || []
    const prevSegment = segment[index - 1] || []
    defaultArray.unshift(R.last(prevSegment) || line0[i])
    defaultArray.push(R.head(nextSegment) || line3[i])
  }
  return defaultArray
}
