import { calcControlPoint, halfPoint } from '../components/WebMap/patch/utils/Bezier'

export const dividingCurrent = (flexGrid, index) => {
  const { zoneSegments, eternals, directions, zones, directionSegments, directionNames, id, deleted } = flexGrid
  const divPoints = getPointsDivZones(eternals, zoneSegments, index).map((p) => p.x ? { lat: p.x, lng: p.y } : p)
  const newDirections = directions + 1
  const newDirectionSegments = directionSegments.insert(index + 1, [ ...Array(zones * 2) ].map(() => []))
  const newEternals = eternals.insert(index + 1, divPoints)
  const newDirectionNames = directionNames.insert(index + 1, null)
  const newZoneSegments = changeZoneSegments(zoneSegments, index)
  const newData = {
    id,
    deleted,
    zones,
    zoneSegments: newZoneSegments,
    eternals: newEternals,
    directions: newDirections,
    directionSegments: newDirectionSegments,
    directionNames: newDirectionNames,
  }
  return newData
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
  const [ , cp2 ] = calcControlPoint([ e1.lat, e1.lng ], [ e1.lat, e1.lng ], [ e2.lat, e2.lng ])// getting controlPoints
  const [ cp1 ] = calcControlPoint([ e1.lat, e1.lng ], [ e2.lat, e2.lng ], [ e2.lat, e2.lng ])// getting controlPoints
  return halfPoint({ x: e1.lat, y: e1.lng }, { x: cp2[0], y: cp2[1] }, { x: cp1[0], y: cp1[1] }, { x: e2.lat, y: e2.lng })
}

// Если Внутри zoneSegments нечетное количество точек:
const getMiddleSegment = (segments) => segments[Math.floor(segments.length / 2)]

// Если Внутри zoneSegments четное количество точек меньше 2х:
const getPairFewSegment = (segments, e1, e2) => { // e1 - выше, e2 - ниже
  const [ point1, point2 ] = segments
  const [ , cp2 ] = calcControlPoint([ e1.lat, e1.lng ], [ point1.lat, point1.lng ], [ point2.lat, point2.lng ])// getting controlPoints
  const [ cp1 ] = calcControlPoint([ point1.lat, point1.lng ], [ point2.lat, point2.lng ], [ e2.lat, e2.lng ])// getting controlPoints
  return halfPoint({ x: point1.lat, y: point1.lng }, { x: cp2[0], y: cp2[1] }, { x: cp1[0], y: cp1[1] }, { x: point2.lat, y: point2.lng })
}

// Если Внутри zoneSegments четное количество точек больше 2х:
const getPairSegment = (p) => {
  const half = p.length / 2
  const n = [ half - 2, half - 1, half, half + 1 ]
  const [ , cp2 ] = calcControlPoint([ p[n[0]].lat, p[n[0]].lng ], [ p[n[1]].lat, p[n[1]].lng ], [ p[n[2]].lat, p[n[2]].lng ])// getting controlPoints
  const [ cp1 ] = calcControlPoint([ p[n[1]].lat, p[n[1]].lng ], [ p[n[2]].lat, p[n[2]].lng ], [ p[n[3]].lat, p[n[3]].lng ])// getting controlPoints
  return halfPoint({ x: p[n[1]].lat, y: p[n[1]].lng }, { x: cp2[0], y: cp2[1] }, { x: cp1[0], y: cp1[1] }, { x: p[n[2]].lat, y: p[n[2]].lng })
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
