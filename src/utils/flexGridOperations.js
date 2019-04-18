import { calcControlPoint, halfPoint } from '../components/WebMap/patch/utils/Bezier'

export const dividingCurrent = (flexGrid, index) => {
  console.log('___LETS`GO__')
  console.log('flexGrid', flexGrid)
  console.log('index', index)
  const { zoneSegments, eternals } = flexGrid
  const divPoints = getPointsDivZones(eternals, zoneSegments, index)
  console.log('resultDivPoints', divPoints)
  console.log('___FINISH__')
}

const getPointsDivZones = (eternals, segments, index) => segments.map((col, i) => {
  const inflections = col[index]
  const e1 = eternals[index + 1][i]
  const e2 = eternals[index][i]
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
  const halfPointCoordinates = halfPoint({ x: e1.lat, y: e1.lng }, { x: cp2[0], y: cp2[1] }, { x: cp1[0], y: cp1[1] }, { x: e2.lat, y: e2.lng })
  console.log('__NO ZONE SEGMENTS__')
  console.log('eternal point e1', e1)
  console.log('eternal point e2', e2)
  console.log('result: ', halfPointCoordinates)
  console.log('____________________')
  return halfPointCoordinates
}

// Если Внутри zoneSegments нечетное количество точек:
const getMiddleSegment = (zoneSegments) => {
  const midPoint = zoneSegments[Math.ceil(zoneSegments.length / 2)]
  console.log('__ODD SEGMENTS__')
  console.log('zoneSegments', zoneSegments)
  console.log('result: ', midPoint)
  console.log('____________________')
  return midPoint
}

// Если Внутри zoneSegments четное количество точек меньше 2х:
const getPairFewSegment = (zoneSegments, e1, e2) => { // e1 - выше, e2 - ниже
  const [ point1, point2 ] = zoneSegments
  const [ , cp2 ] = calcControlPoint([ e1.lat, e1.lng ], [ point1.lat, point1.lng ], [ point2.lat, point2.lng ])// getting controlPoints
  const [ cp1 ] = calcControlPoint([ point1.lat, point1.lng ], [ point2.lat, point2.lng ], [ e2.lat, e2.lng ])// getting controlPoints
  const halfPointCoordinates = halfPoint({ x: point1.lat, y: point1.lng }, { x: cp2[0], y: cp2[1] }, { x: cp1[0], y: cp1[1] }, { x: point2.lat, y: point2.lng })
  console.log('__PAIR FEW SEGMENTS__')
  console.log('zoneSegments', zoneSegments)
  console.log('result: ', halfPointCoordinates)
  console.log('____________________')
}

// Если Внутри zoneSegments четное количество точек больше 2х:
const getPairSegment = (p) => {
  const half = p.length / 2
  const n = [ half - 2, half - 1, half, half + 1 ]
  const [ , cp2 ] = calcControlPoint([ p[n[0]].lat, p[n[0]].lng ], [ p[n[1]].lat, p[n[1]].lng ], [ p[n[2]].lat, p[n[2]].lng ])// getting controlPoints
  const [ cp1 ] = calcControlPoint([ p[n[1]].lat, p[n[1]].lng ], [ p[n[2]].lat, p[n[2]].lng ], [ p[n[3]].lat, p[n[3]].lng ])// getting controlPoints
  const halfPointCoordinates = halfPoint({ x: p[n[1]].lat, y: p[n[1]].lng }, { x: cp2[0], y: cp2[1] }, { x: cp1[0], y: cp1[1] }, { x: p[n[2]].lat, y: p[n[2]].lng })
  console.log('__PAIR SEGMENTS__')
  console.log('internal point e1', p[n[1]])
  console.log('internal point e2', p[n[2]])
  console.log('result: ', halfPointCoordinates)
  console.log('____________________')
  return halfPointCoordinates
}
