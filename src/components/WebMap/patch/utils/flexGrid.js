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
  const divPoints = getPointsDivZones(eternals, zoneSegments, index).map(toLatLng)
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

const getPointsDivZones = (eternals, segments, index) => segments.toArray().map((col, i) => {
  const inflections = col[index]
  const e1 = eternals.get(index + 1)[i]
  const e2 = eternals.get(index)[i]
  const infLen = inflections.length
  return !infLen
    ? getHalfEternals(e1, e2)
    : infLen % 2
      ? getMiddleSegment(inflections)
      : infLen === 2
        ? getPairFewSegment(inflections, e1, e2)
        : getPairSegment(inflections)
})

// Если Внутри zoneSegments нет точек:
const getHalfEternals = (e1, e2) => {
  const [ , cp2 ] = calcControlPoint(pointToArr(e1), pointToArr(e1), pointToArr(e2))// getting controlPoints
  const [ cp1 ] = calcControlPoint(pointToArr(e1), pointToArr(e2), pointToArr(e2))// getting controlPoints
  return halfPoint(toXY(e1), toXY(cp2), toXY(cp1), toXY(e2))
}

// Если Внутри zoneSegments нечетное количество точек:
const getMiddleSegment = (segments) => segments[Math.floor(segments.length / 2)]

// Если Внутри zoneSegments четное количество точек меньше 2х:
const getPairFewSegment = (segments, e1, e2) => { // e1 - выше, e2 - ниже
  const [ point1, point2 ] = segments
  const [ , cp2 ] = calcControlPoint(pointToArr(e1), pointToArr(point1), pointToArr(point2))// getting controlPoints
  const [ cp1 ] = calcControlPoint(pointToArr(point1), pointToArr(point2), pointToArr(e2))// getting controlPoints
  return halfPoint(toXY(point1), toXY(cp2), toXY(cp1), toXY(point2))
}

// Если Внутри zoneSegments четное количество точек больше 2х:
const getPairSegment = (p) => {
  const half = p.length / 2
  const n = [ half - 2, half - 1, half, half + 1 ]
  const [ , cp2 ] = calcControlPoint(pointToArr(p[n[0]]), pointToArr(p[n[1]]), pointToArr(p[n[2]]))// getting controlPoints
  const [ cp1 ] = calcControlPoint(pointToArr(p[n[1]]), pointToArr(p[n[2]]), pointToArr(p[n[3]]))// getting controlPoints
  return halfPoint(toXY(p[n[1]]), toXY(cp2), toXY(cp1), toXY(p[n[2]]))
}

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
