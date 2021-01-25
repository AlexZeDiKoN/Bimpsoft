import L from 'leaflet'
import { applyToPoint, compose, rotate, translate } from 'transformation-matrix'
import infinity from 'cesium/Source/Shaders/Builtin/Constants/infinity'
import Bezier from 'bezier-js'
import { Intersection, ShapeInfo } from 'kld-intersections'
import { prepareBezierPath } from '../utils/Bezier'
import { interpolateSize } from '../utils/helpers'
import { drawArrowFill } from '../../../../utils/svg/lines'
import { FONT_FAMILY, FONT_WEIGHT, getTextWidth } from '../../../../utils/svg/text'
import { evaluateColor } from '../../../../constants/colors'
import { MARK_TYPE, settings } from '../../../../constants/drawLines'
import lineDefinitions from './lineDefinitions'
import { CONFIG } from '.'

const coefTangent = 3
const coefArrowWing = 0.33 // коэффициент выступа стрелки над телом стрелки
const coefArrow = 0.3 // отношение головы стрелки к телу стрелки по умолчанию
const coeffH = 0.5 // коэффициент выступа стрелки над телом символа

function getKoefArrow () {
  return coefArrowWing
}

const isDef = (v) => v !== undefined && v !== null

export const isDefPoint = (v) => isDef(v) && v.x !== undefined && v.x !== null && v.y !== undefined && v.y !== null

// ---------------------------------------------------------------------------------------
// Построение AIRBORNE / AVIATION
// bindingType= "arcs" "miter" "round" "bevel";
// TypeLine L - прямые
//          * - кривые Безье
export function buildingAirborne (datapt, typeLine, bindingType) {
  if (!datapt) {
    return null
  }
  let pt
  if (typeof (datapt) === 'string') {
    try {
      pt = JSON.parse(datapt)
    } catch (e) {
      return null
    }
  } else {
    if (typeof (datapt) !== 'object') {
      return null
    }
    pt = datapt.slice()
  }

  if (pt.length < 3) {
    return null
  } // для построения стрелки нужно минимум две координаты и опоргая точка стрелки[null,null]
  const indEnd = pt.length - 1
  let pointSide // Боковая опорная точка
  if (!isDefPoint(pt[indEnd]) || indEnd < 3) { // нет опорной точки стрелки, расчитываем ее по среднему
    pointSide = referencePoint(pt[0], pt[1])
  } else { // координаты стрелки рассчитываем по имеющимся данным
    const polarPoints = coordinatesToPolar(pt[0], pt[1], pt[indEnd])
    pointSide = referencePoint(pt[0], pt[1], polarPoints.angle, polarPoints.beamLength)
  }
  const [ tR, tO ] = pointReflected(pointSide, pt[0], pt[1]) // tR - точка отражения края стрелки , tO задний край стрелки
  const tLp = segmentDivision(pointSide, tO, coeffH)
  const tRp = segmentDivision(tR, tO, coeffH)
  const widthL = lengthLine(tLp, tRp) // Ширина тела стрелки
  const tEnd = pointsToSegment(pt[1], pt[0], -widthL / 2) // perpendStraight(pt[1], pt[0], pt[1])
  const tEndL = pointRotationToPoint(tEnd, Math.PI / 2, pt[1])
  const tEndR = pointRotationToPoint(tEnd, -Math.PI / 2, pt[1])
  // пропускаем начало тела стрелки
  const timePt = pt.slice(0, -1) // убираем контрольнуя точку стрелки из построения
  const halfTail = widthL / 2
  // построение динамического хвоста -------------------------------
  if (isDef(typeLine) && typeLine === 'L') {
    // дорисовка хвоста прямыми
    const PointArrow = [ tLp, pointSide, pt[0], tR, tRp ] // tEndR,tEndL ]
    const path = 'M' + PointArrow.map(({ x, y }) => `${x} ${y}`).join(' L')
    const [ lineL, lineP ] = constructionLines(timePt.slice(1), halfTail)
    lineL.unshift({ p1: tLp, p2: tEndR })
    lineP.unshift({ p1: tRp, p2: tEndL })
    const bLineL = bindingLine(lineL, bindingType, halfTail)
    const bLineP = bindingLine(lineP, bindingType, halfTail)
    const tailPath = []
    tailPath.push(...bLineL.map(lineToPath))
    tailPath.push(...bLineP.map(lineToPath))
    return path + tailPath.join(' ')
  }
  // Статика стрелки
  const PointArrowC = [ tEndR, tLp, pointSide, pt[0], tR, tRp, tEndL ]
  const pathC = 'M' + PointArrowC.map(({ x, y }) => `${x} ${y}`).join(' L')
  // отрисовка вспомогательных элементов построения кривых
  const pathService = '' // servicePath(timePt)
  // дорисовка хвоста кривыми Безье
  return pathC + pathService + constructionTailBezier(timePt, widthL / 2)
}
// -----------------------------------------------------------------------------------------
// Поcтроение ATTACK HELICOPTER (151402)
//  bindingType= "arcs" "miter" "round" "bevel" "smooth";
// TypeLine L - прямые
//          * - кривые Безье
export function buildingAttackHelicopter (datapt, typeLine, bindingType) {
  if (!datapt) {
    return null
  }
  let pt
  if (typeof (datapt) === 'string') {
    try {
      pt = JSON.parse(datapt)
    } catch (e) {
      return null
    }
  } else {
    if (typeof (datapt) !== 'object') {
      return null
    }
    pt = datapt.slice()
  }

  if (pt.length < 3) {
    return null
  }// constructionTail(pt,30); // для построения стрелки нужно минимум две координаты и опоргая точка стрелки[null,null]
  const indEnd = pt.length - 1
  let pointSide // Боковая опорная точка стрелки
  if (!isDefPoint(pt[indEnd]) || indEnd < 3) { // нет опорной точки стрелки, расчитываем ее по среднему
    pointSide = referencePoint(pt[0], pt[1])
  } else { // координаты опорной стрелки рассчитываем по имеющимся данным
    const polarPoints = coordinatesToPolar(pt[0], pt[1], pt[indEnd])
    pointSide = referencePoint(pt[0], pt[1], polarPoints.angle, polarPoints.beamLength)
  }
  // построение острия стрелки
  const [ tR, tO ] = pointReflected(pointSide, pt[0], pt[1]) // tR - точка отражения боковой опорной точки стрелки , tO задний край стрелки
  const tLp = segmentDivision(pointSide, tO, coeffH)
  const tRp = segmentDivision(tR, tO, coeffH)
  const PointArrow = [ tLp, pointSide, pt[0], tR, tRp ]
  let path = 'M' + PointArrow.map(({ x, y }) => `${x} ${y}`).join(' L')

  const widthL = lengthLine(tLp, tRp) // ширина тела стрелки
  // построение фигуры в стрелке
  const ptEnd = segmentDivision(pt[1], pt[0], 0.2) // точка окончания фигуры в стрелке
  const unitY = lengthLine(tLp, tRp) / 2 // Единица построения фигуры в стрелке по оси Y
  const unitX = lengthLine(tO, ptEnd) / 2 // Единица построения фигуры в стрелке по оси X
  const angle = angleLineToOX(tO, ptEnd) // угол наклона фигуры
  // опорные точки фигуры в стрелке
  const pointHelicopter = [ [ 0, 0 ], [ 0, unitY ], [ 0, -unitY ], [ unitX, 0 ], [ 2 * unitX, 0 ],
    [ unitX / 2, unitY / 2 ], [ unitX / 2, -unitY / 2 ], [ 3 * unitX / 2, -unitY / 2 ], [ 3 * unitX / 2, unitY / 2 ],
    [ 2 * unitX, -unitY ], [ 2 * unitX, unitY ] ]
  let fRotate = 1
  if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
    fRotate = -1
  } // Выворачивание стрелочки к верху
  const pointSmallArrow = [ [ unitX, (unitY - unitY / 4) * fRotate ], [ unitX, -unitY * fRotate ], // вертикаль стрелочки
    [ unitX - unitX / 4, (unitY - unitY / 4) * fRotate ], [ unitX + unitX / 4, (unitY - unitY / 4) * fRotate ], // низ стрелочки
    [ unitX - unitX / 8, -(unitY - unitY / 4) * fRotate ], [ unitX + unitX / 8, -(unitY - unitY / 4) * fRotate ], // верх стрелочки
    [ unitX, -(unitY + unitY / 2) * fRotate ] ] // верх стрелочки
  pointHelicopter.push(...pointSmallArrow)
  // поворот
  const arrPointRotation = pointHelicopter.map(([ x, y ]) => (pointRotation({ x, y }, angle)))
  // смещение
  const pm = shiftPoints(tO, arrPointRotation)
  // добавляем к стрелке фигуру
  path = `${path}
    M${pm[1].x} ${pm[1].y} L${pm[9].x} ${pm[9].y}
    M${pm[2].x} ${pm[2].y} L${pm[10].x} ${pm[10].y}
    M${pm[5].x} ${pm[5].y} L${pm[6].x} ${pm[6].y}
    M${pm[7].x} ${pm[7].y} L${pm[8].x} ${pm[8].y}
    M${pm[11].x} ${pm[11].y} L${pm[12].x} ${pm[12].y}
    M${pm[13].x} ${pm[13].y} L${pm[14].x} ${pm[14].y}`
  // добавляем элемен фигуры с заливкой
  const amplifiers = `M${pm[15].x} ${pm[15].y}L${pm[16].x} ${pm[16].y}L${pm[17].x} ${pm[17].y}Z`
  // построение динамического хвоста -------------------------------
  if (isDef(typeLine) && typeLine === 'L') { // дорисовка хвоста прямыми
    const timePt = pt.slice(0, -1) // убираем контрольнуя точку стрелки из построения
    timePt[0] = ptEnd // Устанавливаем начало тела стрелки на конец статического знака
    return { d: path + constructionTailLine(timePt, widthL / 2, bindingType), amplifiers }
  }
  const timePt = [ pt[0], ptEnd ] // Устанавливаем начало тела стрелки
  // добавляем остальное без управляющей точки
  // дорисовка хвоста кривыми Безье
  return { d: path + constructionTailBezier(timePt.concat(pt.slice(1, -1)), widthL / 2), amplifiers }
}

// ---------------------------------------------------------------------------------------
// Поcтроение MAIN ATTACK
//  bindingType= "arcs" "miter" "round" "bevel" "smooth";
// TypeLine L - прямые
//          * - кривые Безье
export function buildingMainAttack (datapt, typeLine, bindingType) {
  if (!datapt) {
    return null
  }
  let pt
  if (typeof (datapt) === 'string') {
    try {
      pt = JSON.parse(datapt)
    } catch (e) {
      return null
    }
  } else {
    if (typeof (datapt) !== 'object') {
      return null
    }
    pt = datapt.slice()
  }

  if (pt.length < 3) { // для построения стрелки нужно минимум две координаты и опоргая точка стрелки[null,null]
    return null
  }
  const indEnd = pt.length - 1
  let pointSide // Боковая опорная точка
  if (!isDefPoint(pt[indEnd]) || indEnd < 3) { // нет опорной точки стрелки, расчитываем ее по среднему
    pointSide = referencePoint(pt[0], pt[1])
  } else { // координаты опорной стрелки рассчитываем по имеющимся данным
    const polarPoints = coordinatesToPolar(pt[0], pt[1], pt[indEnd])
    pointSide = referencePoint(pt[0], pt[1], polarPoints.angle, polarPoints.beamLength)
  }
  const [ tR, tO ] = pointReflected(pointSide, pt[0], pt[1]) // tR - точка отражения края стрелки , tO задний край стрелки
  const tLp = segmentDivision(pointSide, tO, getKoefArrow())
  const tRp = segmentDivision(tR, tO, getKoefArrow())
  const pointCentrAdd = segmentDivision(pt[0], tO, getKoefArrow())
  const widthL = lengthLine(tLp, tRp) // Ширина тела стрелки
  const PointArrow = [ tLp, pointSide, pt[0], tR, tRp, pointCentrAdd, tLp ]
  const path = 'M' + PointArrow.map(({ x, y }) => `${x} ${y}`).join(' L')
  const timePt = pt.slice(0, -1) // убираем контрольнуя точку стрелки из построения
  timePt[0] = tO // Сдвигаем начало тела стрелки
  // построение динамического хвоста -------------------------------
  if (isDef(typeLine) && typeLine === 'L') { // дорисовка хвоста прямыми
    return path + constructionTailLine(timePt, widthL / 2, bindingType)
  }
  timePt.unshift(pt[0]) // добавляем направляющую точку
  // дорисовка хвоста кривыми Безье
  return path + constructionTailBezier(timePt, widthL / 2)
}

// ---------------------------------------------------------------------------------------
// Поcтроение SUPPORTING ATTACK
//  bindingType= "arcs" "miter" "round" "bevel";
// TypeLine L - прямые
//          * - кривые Безье
export function buildingArrow (datapt, typeLine, bindingType) {
  if (!datapt) {
    return null
  }
  let pt
  if (typeof (datapt) === 'string') {
    try {
      pt = JSON.parse(datapt)
    } catch (e) {
      return null
    }
  } else {
    if (typeof (datapt) !== 'object') {
      return null
    }
    pt = datapt.slice()
  }

  if (pt.length < 3) { // constructionTail(pt,30); // для построения стрелки нужно минимум две координаты и опоргая точка стрелки[null,null]
    return null
  }
  const indEnd = pt.length - 1
  let pointSide // Боковая опорная точка
  if (!isDefPoint(pt[indEnd]) || indEnd < 3) { // нет опорной точки стрелки, расчитываем ее по среднему
    pointSide = referencePoint(pt[0], pt[1])
  } else { // координаты опорной стрелки имеются, рассчитываем по имеющимся данным для полярной системы
    const polarPoints = coordinatesToPolar(pt[0], pt[1], pt[indEnd])
    pointSide = referencePoint(pt[0], pt[1], polarPoints.angle, polarPoints.beamLength)
  }
  const [ tR, tO ] = pointReflected(pointSide, pt[0], pt[1]) // tR - точка отражения края стрелки , tO задний край стрелки
  const tLp = segmentDivision(pointSide, tO, getKoefArrow())
  const tRp = segmentDivision(tR, tO, getKoefArrow())
  const widthL = lengthLine(tLp, tRp) // Ширина тела стрелки
  const PointArrow = [ tLp, pointSide, pt[0], tR, tRp ]
  const path = 'M' + PointArrow.map(({ x, y }) => `${x} ${y}`).join(' L')
  const timePt = [ pt[0], tO, ...pt.slice(1, -1) ]
  // построение динамического хвоста -------------------------------
  if (isDef(typeLine) && typeLine === 'L') { // дорисовка хвоста прямыми
    return path + constructionTailLine(timePt.slice(1), widthL / 2, bindingType)
  }
  // отображение контрольных точек
  const pathService = '' // servicePath(timePt)
  // дорисовка хвоста кривыми Безье
  return path + pathService + constructionTailBezier(timePt, widthL / 2)
}
// ---------------------------------------------------------------------------------------------------------
// создание кривой с векторами
// eslint-disable-next-line no-unused-vars
function servicePath (pt) {
  const mKtBezier = qalqControlPoints(pt)
  const clippedPt = pt.slice(1)
  // прорисовка контрольных линий кривой безье
  const pathControl = clippedPt.map((t, ind) => `M${t.x} ${t.y} L${mKtBezier[ind].ktL.x} ${mKtBezier[ind].ktL.y}
   M${t.x} ${t.y} L${mKtBezier[ind].ktR.x} ${mKtBezier[ind].ktR.y}`).join(' ')
  // прорисовка кривой безье по опорным точкам, первая точка не стоится (стартовая)
  const pathCurve = constructionPath(JSON.stringify(pt))
  return pathCurve + pathControl
}
// ---------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------
// Деление отрезка на сегменты с коэффициентом kf
function segmentDivision (t1, t2, kf) {
  const razX = t1.x - t2.x
  const razY = t1.y - t2.y
  const pX = t1.x - razX * kf
  const pY = t1.y - razY * kf
  return { x: pX, y: pY }
}

// точка на отрезке на расстоянии l от начальной точки (t1)
export function pointsToSegment (t1, t2, l) {
  const razX = t1.x - t2.x
  const razY = t1.y - t2.y
  const lengthSection = lengthLine(t1, t2)
  const pX = t1.x - razX * l / lengthSection
  const pY = t1.y - razY * l / lengthSection
  return { x: pX, y: pY }
}

// ---------------------------------------------------------------------------------------
// поворот точки на заданный угол
function pointRotation (point, angle) {
  const ca = Math.cos(angle)
  const sa = Math.sin(angle)
  return { x: point.x * ca - point.y * sa, y: point.x * sa + point.y * ca }
}
// поворот точки на заданный угол относительно точки
function pointRotationToPoint (point, angle, pointO) {
  const pp = { x: point.x - pointO.x, y: point.y - pointO.y }
  const ca = Math.cos(angle)
  const sa = Math.sin(angle)
  return { x: pp.x * ca - pp.y * sa + pointO.x, y: pp.x * sa + pp.y * ca + pointO.y }
}
// сдвиг точек относительно заданой
export function shiftPoints (pO, pArray) {
  return pArray.map((elm) => ({ x: elm.x + pO.x, y: elm.y + pO.y }))
}
// ------------------------------------------------------------------------------------------------
// расчет координат боковой опорной точки стрелки
export function referencePoint (t1, t2, angle, beamLength) {
  const arrowVector = vector(t1, t2)
  const angleVectora = Math.atan2(arrowVector.y, arrowVector.x)
  let sizeHeight
  let lamda = coefArrow // отношение головы стрелки к телу стрелки по умолчанию (0.3)
  if (isDef(angle) && isDef(beamLength)) { // передан угол
    const sizeOsnovanija = beamLength * Math.cos(angle)
    sizeHeight = beamLength * Math.sin(angle)
    lamda = sizeOsnovanija / lengthLine(t1, t2)
  } else {
    sizeHeight = lengthLine(t1, t2) * lamda
  }
  // Ограничиваем перемещение крыла стрелки
  if (lamda > 0.6) {
    lamda = 0.6
  }
  if (lamda < 0.1) {
    lamda = 0.1
  }
  if (sizeHeight > lengthLine(t1, t2)) {
    sizeHeight = lengthLine(t1, t2)
  }
  const osnov = { x: (t1.x + arrowVector.x * lamda), y: t1.y + arrowVector.y * lamda }
  const delta = { x: sizeHeight * Math.sin(angleVectora), y: sizeHeight * Math.cos(angleVectora) }
  return { x: osnov.x - delta.x, y: osnov.y + delta.y }
}

// ---------------------------------------------------------
// function rotateVector(vect, angle){
//    // vec2 rotated_point;
//     rotated_point.x = point.x * cos(angle) - point.y * sin(angle);
//     rotated_point.y = point.x * sin(angle) + point.y * cos(angle);
//     return rotated_point;
// }
// ------------------------------------------------------------------------------
// Поиск точки пересечения лучей отрезков
function pointIntersecLine (l1p1, l1p2, l2p1, l2p2) {
// коэффициенты уравнения прямой
  const a1 = l1p2.y - l1p1.y
  const b1 = l1p1.x - l1p2.x
  const c1 = l1p1.y * (l1p2.x - l1p1.x) - l1p1.x * (l1p2.y - l1p1.y)
  const a2 = l2p2.y - l2p1.y
  const b2 = l2p1.x - l2p2.x
  const c2 = l2p1.y * (l2p2.x - l2p1.x) - l2p1.x * (l2p2.y - l2p1.y)
  // координаты точки пересечения
  const d = a1 * b2 - a2 * b1
  if (d === 0) { // прямые параллельны
    return null
  }
  return { x: (b1 * c2 - b2 * c1) / d, y: (a2 * c1 - a1 * c2) / d }
}

// --------------------------------------------------------------------------------------------------------------
// Точка пересечения отрезков
export function pointIntersecSegments (l1p1, l1p2, l2p1, l2p2) {
  const point = pointIntersecLine(l1p1, l1p2, l2p1, l2p2)
  if (point) {
    const { x, y } = point
    if (((l1p1.x <= x && x <= l1p2.x) || (l1p2.x <= x && x <= l1p1.x)) &&
      ((l2p1.x <= x && x <= l2p2.x) || (l2p2.x <= x && x <= l2p1.x)) &&
      ((l1p1.y <= y && y <= l1p2.y) || (l1p2.y <= y && y <= l1p1.y)) &&
      ((l2p1.y <= y && y <= l2p2.y) || (l2p2.y <= y && y <= l2p1.y))) {
      return { x, y }
    }
  }
  return null
}

// --------------------------------------------------------------------------------------------------------------
// полярные координаты точки
// t1, t2 координаты отрезка
// t3 - координаты точка
// возвращаем угол между лучами (t1,t2) и (t1,t3) и длину отрезка (t1,t3)
export function coordinatesToPolar (t1, t2, t3) {
  const beamLength = Math.sqrt((t1.x - t3.x) * (t1.x - t3.x) + (t1.y - t3.y) * (t1.y - t3.y))
  const angle = angle3Points(t1, t2, t3)
  return { angle, beamLength }
}

// Расчет угла между отрезками t1t2 t1t3
export function angle3Points (t1, t2, t3) {
  return Math.atan2((t3.y - t1.y) * (t2.x - t1.x) - (t2.y - t1.y) * (t3.x - t1.x),
    (t3.x - t1.x) * (t2.x - t1.x) + (t3.y - t1.y) * (t2.y - t1.y))
}
export const beamAngle = (t1, t2, t3) => {
  return Math.atan2((t3.y - t1.y) * (t2.x - t1.x) - (t2.y - t1.y) * (t3.x - t1.x),
    (t3.x - t1.x) * (t2.x - t1.x) + (t3.y - t1.y) * (t2.y - t1.y))
}

export function angle4Points (t1, t2, t3, t4) {
  const l1 = straight(t1, t2)
  const l2 = straight(t3, t4)
  return Math.atan2((l1.A * l2.B - l2.A * l1.B), (l1.A * l2.A + l1.B * l2.B))
}
// ------------------------------------------------------------------------------------------
export function polarToCoordinates (t0, t1, tP) {
  const vectorN = vector(t0, t1)
  const angleVectora = Math.atan2(vectorN.y, vectorN.x)
  const sizeOsnovanija = tP.beamLength * Math.cos(tP.angle)
  const sizeHeight = tP.beamLength * Math.sin(tP.angle)
  const lamda = sizeOsnovanija / lengthLine(t0, t1)
  const osnov = { x: (t0.x + vectorN.x * lamda), y: t0.y + vectorN.y * lamda }
  const delta = { x: sizeHeight * Math.sin(angleVectora), y: sizeHeight * Math.cos(angleVectora) }
  return { x: osnov.x - delta.x, y: osnov.y + delta.y }
}
// ----------------------------------------------------------------------------------------
// расчет прямой
// Ax+By+C=0
function straight (p1, p2) {
  const A = p1.y - p2.y
  const B = p2.x - p1.x
  const C = p1.x * p2.y - p1.y * p2.x
  return { A, B, C }
}

// ----------------------------------------------------------------------------------------
// расчет перпендикулярной прямой
// Ax+By+C=0
function perpendStraight (n, p1, p2) {
  const A1 = p1.y - p2.y
  const B1 = p2.x - p1.x
  const A2 = B1
  const B2 = -A1
  const C2 = A1 * n.y - B1 * n.x
  return { A: A2, B: B2, C: C2 }
}

// -----------------------------------------------------------------------------------------
// reflection = точка отражения
// intersection - основание перпендикуляра к прямой из заданой точки
function pointReflected (n, p1, p2) {
  const A1 = p1.y - p2.y
  const B1 = p2.x - p1.x
  const C1 = p1.x * p2.y - p1.y * p2.x
  const line = perpendStraight(n, p1, p2)
  // пересечение двух прямых
  const intersection = {
    x: (C1 * line.B - line.C * B1) / (line.A * B1 - A1 * line.B),
    y: (A1 * line.C - line.A * C1) / (B1 * line.A - line.B * A1),
  }
  const reflection = { x: intersection.x * 2 - n.x, y: intersection.y * 2 - n.y }
  return [ reflection, intersection ]
}

// ----------------------------------------------------------------------------------------
export function lengthLine (t1, t2) {
  return Math.sqrt((t1.x - t2.x) * (t1.x - t2.x) + (t1.y - t2.y) * (t1.y - t2.y))
}

// -----------------------------------------------------------------------------------------
// расчет угла наклона отрезка к оси OX
function angleLineToOX (p1, p2) {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x)
}

// ----------------------------------------------------------------------------------------
function vector (p1, p2) {
  return { x: p2.x - p1.x, y: p2.y - p1.y }
}

// eslint-disable-next-line no-unused-vars
function angleLine (v1, v2, v3, v4) {
  if (arguments.length === 4) { // принимаем координаты отрезко
    const vec1 = vector(v1, v2)
    const vec2 = vector(v3, v4)
    return angleVector(vec1, vec2)
  }
  if (arguments.length === 2) { // принимаем векторы
    return angleVector(v1, v2)
  }
}

function angleVector (v1, v2) {
  const v1v2 = v1.x * v2.x + v1.y * v2.y
  const mv1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y)
  const mv2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y)
  return Math.acos(v1v2 / (mv1 * mv2))
}

// -----------------------------------------------------------------------------------------
// расчет контрольных точек для кривых Безье
function referencePoints (t, position, minLength) {
  let dlinaL = lengthLine(t[0], t[1]) / coefTangent
  let dlinaR = lengthLine(t[1], t[2]) / coefTangent
  if (isDef(minLength) && minLength > 0) {
    dlinaL = minLength / coefTangent
    dlinaR = minLength / coefTangent
  }
  let angleR = angleLineToOX(t[0], t[1]) + angle4Points(t[0], t[1], t[1], t[2]) / 2
  if (position < 0) {
    // контрольная точка для начала линии ( вектор t0->t1 - направляющий)
    angleR = angleLineToOX(t[0], t[1])
    return [ t[1], { x: t[1].x + dlinaR * Math.cos(angleR), y: t[1].y + dlinaR * Math.sin(angleR) } ]
  } else if (position > 0) {
    // контрольная точка для конца линии ( направление свободное)
    return [ t[1], t[1] ]
  }
  // приводим длину вектора к растоянию между точками апроксимации
  const ktR = { x: t[1].x + dlinaR * Math.cos(angleR), y: t[1].y + dlinaR * Math.sin(angleR) }
  const ktL = { x: t[1].x - dlinaL * Math.cos(angleR), y: t[1].y - dlinaL * Math.sin(angleR) }
  return [ ktL, ktR ]
}

// -----------------------------------------------------------------------------------------------
// расчет нормали от точки к отрезку
// eslint-disable-next-line no-unused-vars
function qalqNormal (point, pointL, pointR) {
  const P1 = perpendStraight(pointL, pointL, pointR)
  const P2 = perpendStraight(pointR, pointL, pointR)
  const P3 = perpendStraight(point, pointL, pointR)
  if ((P1.C > P2.C && P3.C < P1.C && P3.C > P2.C) || (P1.C < P2.C && P3.C > P1.C && P3.C < P2.C)) {
    return true
  }
  // выпали из отрезка
  return false
}

// -------------------------------------------------
// растояние от точки до прямой
// eslint-disable-next-line no-unused-vars
function distance (point, line) {
  const mu = 1 / Math.sqrt(line.A * line.A + line.B * line.B) * (line.C < 0 ? 1 : -1)
  const lineNorm = { a: line.A * mu, b: line.B * mu, c: line.C * mu }
  return Math.abs(lineNorm.a * point.x + lineNorm.b * point.y + lineNorm.c)
}

// ------------------------------------------------------------------------------------------------
// удлинение отрезка на increase
function increaseSection (pN, pK, increase) {
  const lengthSection = Math.sqrt((pN.x - pK.x) * (pN.x - pK.x) + (pN.y - pK.y) * (pN.y - pK.y))
  return { x: (pK.x - pN.x) * increase / lengthSection + pK.x, y: (pK.y - pN.y) * increase / lengthSection + pK.y }
}
// укорачивание отрезка на increase
function truncateSection (pN, pK, truncate) {
  const dx = pK.x - pN.x
  const dy = pK.y - pN.y
  const kf = truncate / Math.sqrt(dx * dx + dy * dy)
  return { x: pK.x - dx * kf, y: pK.y - dy * kf }
}
// -------------------------------------------------------------------------------------------------
// расчет точек направления Bizier
function qalqControlPoints (dataPt, equally) {
  const mKtBezier = []
  let ktL, ktR
  if (dataPt.length < 3) {
    return null
  }
  let minLength = 0
  if (isDef(equally)) {
    minLength = lengthLine(dataPt[1], dataPt[2])
    for (let i = 2; i < dataPt.length - 1; i++) {
      if (minLength > lengthLine(dataPt[i], dataPt[i + 1])) {
        minLength = lengthLine(dataPt[i], dataPt[i + 1])
      }
    }
  }
  // первая контрольная точка
  [ ktL, ktR ] = referencePoints([ dataPt[0], dataPt[1], dataPt[2] ], -1, minLength)
  mKtBezier.push({ ktL, ktR })
  const indEnd = dataPt.length - 1
  for (let i = 2; i < indEnd; i++) { // отрезок i i+1
    [ ktL, ktR ] = referencePoints([ dataPt[i - 1], dataPt[i], dataPt[i + 1] ], 0, minLength)
    mKtBezier.push({ ktL, ktR })
  }
  // последний сектор
  [ ktL, ktR ] = referencePoints([ dataPt[indEnd - 1], dataPt[indEnd], dataPt[indEnd] ], 1, minLength)
  mKtBezier.push({ ktL, ktR })
  return mKtBezier
}

// -------------------------------------------------------------------------------------------------------------------
// проверка пересечения полилиний
// eslint-disable-next-line no-unused-vars
function intersectionBezier (bezier1, bezier2) {
  let bz2
  let bz1
  if ((Math.abs(bezier1[0].x - bezier1[3].x) <= 1) && (Math.abs(bezier1[0].y - bezier1[3].y) <= 1)) {
    bz1 = ShapeInfo.line(bezier1[0], bezier1[3])
  } else {
    bz1 = ShapeInfo.cubicBezier(bezier1)
  }
  if ((Math.abs(bezier2[0].x - bezier2[3].x) <= 1) && (Math.abs(bezier2[0].y - bezier2[3].y) <= 1)) {
    bz2 = ShapeInfo.line(bezier2[0], bezier2[3])
  } else {
    bz2 = ShapeInfo.cubicBezier(bezier2)
  }
  let intersec
  try {
    intersec = Intersection.intersect(bz1, bz2)
  } catch (e) {
    return null
  }
  return intersec
}

// ---------------------------------------------------------------------------------------------------------
function intersectionCurves (curve1, curve2) {
  const Bez1 = new Bezier(...curve1)
  const Bez2 = new Bezier(...curve2)
  const lengthBez1 = Math.round(Bez1.length()) + 1
  const lengthBez2 = Math.round(Bez2.length()) + 1
  const lutBez1 = Bez1.getLUT(lengthBez1 * 4)
  const lutBez2 = Bez2.getLUT(lengthBez2 * 4)
  const epsilon = 0.25
  let intersec = false
  let mtp = {}
  let indp = 100
  // перибираем LUT
  lutBez1.some((el1, ind1) => {
    lutBez2.some((el2, ind2) => {
      if ((Math.abs(el1.x - el2.x) < epsilon) && (Math.abs(el1.y - el2.y) < epsilon)) {
        intersec = true
        // подбираем менший
        if (indp > Math.abs(el1.x - el2.x) + Math.abs(el1.y - el2.y)) {
          indp = Math.abs(el1.x - el2.x) + Math.abs(el1.y - el2.y)
          mtp = { x: el1.x, y: el1.y, ind1, ind2 }
        }
      }
      return intersec
    })
    return intersec
  })
  if (intersec) {
    if (mtp.ind1 === 0) { // имеем пересечение в начале

    }
    const newcurve1 = Bez1.split(0, mtp.ind1 / lutBez1.length)
    const newcurve2 = Bez2.split(mtp.ind2 / lutBez2.length, 1)
    return { intersec, curve1: newcurve1.points, curve2: newcurve2.points }
  }
  return { intersec, curve1, curve2 }
}

// -----------------------------------------------------------------------
function intersectionSlicing (mCurveBez) {
  const mCurve = mCurveBez.slice()
  let comparisonCurve
  for (let i = 1; i < mCurve.length; i++) {
    const mCurveL = mCurve[i - 1].sectionBez
    const mCurveP = mCurve[i].sectionBez
    for (let k = 0, intersec = false; (k < (mCurveL.length)) && (intersec === false); k++) {
      for (let j = mCurveP.length - 1; j >= 0 && !(k === (mCurveL.length - 1) && j === 0); j--) { // последние кривые не сравниваем
        comparisonCurve = intersectionCurves(mCurveL[k], mCurveP[j])
        intersec = comparisonCurve.intersec
        if (comparisonCurve.intersec) {
          // Вносим обрезанные кривые
          // удаляем все что между ними
          if (comparisonCurve.curve1 === undefined) { // Сократили полность
            mCurve[i - 1].sectionBez = mCurveL.slice(0, k)
          } else {
            mCurveL[k] = comparisonCurve.curve1
            mCurve[i - 1].sectionBez = mCurveL.slice(0, k + 1)
          }
          if (comparisonCurve.curve2 === undefined) { // Сократили полность
            mCurve[i].sectionBez = mCurveP.slice(j + 1)
          } else {
            mCurveP[j] = comparisonCurve.curve2
            mCurve[i].sectionBez = mCurveP.slice(j)
          }
          break
        }
      }
    }
  }
  return mCurve
}
// -----------------------------------------------------------------------
// Построение тела полилинии шириной widthL
// первая точка задает направление, нужна для qalqControlPoints
function constructionTailBezier (pt, widthL, equally) {
  if (pt.length < 1) {
    return null
  }
  const mKtBezier = qalqControlPoints(pt, equally)
  const mpt = pt.slice(1) // убираем первую точку(задание стартового направления)
  const indEnd = mpt.length - 1
  const mPolyBezSideL = [] // масив тел полилиний
  const mPolyBezSideP = [] // масив тел полилиний
  let outlineOffsetL, outlineOffsetP
  for (let i = 1; i <= indEnd; i++) {
    const PolyBez = new Bezier(mpt[i - 1].x, mpt[i - 1].y, mKtBezier[i - 1].ktR.x, mKtBezier[i - 1].ktR.y,
      mKtBezier[i].ktL.x, mKtBezier[i].ktL.y, mpt[i].x, mpt[i].y)
    try {
      outlineOffsetL = PolyBez.offset(-Math.max(widthL, 5))
      outlineOffsetP = PolyBez.offset(Math.max(widthL, 5))
    } catch (e) {
      continue
    }
    mPolyBezSideP.push({
      sectionBez: (outlineOffsetP.map((elm) => elm.points)),
    })
    mPolyBezSideL.push({
      sectionBez: (outlineOffsetL.map((elm) => elm.points)),
    })
  }

  // поиск пересечения кривых
  const intersectionBezSideP = intersectionSlicing(mPolyBezSideP)
  const intersectionBezSideL = intersectionSlicing(mPolyBezSideL)
  // вывод кривых в path
  return curveToPath(intersectionBezSideP).join(' ') + curveToPath(intersectionBezSideL).join(' ')
}
// -----------------------------------------------------------------------------------------------
// подмена функции Bezier.reduce
Bezier.prototype.reduce = function () {
  let i
  let t1 = 0
  let t2 = 0
  const step = 0.01
  let segment
  const pass1 = []
  const pass2 = []
  const utilsMap = function (v, ds, de, ts, te) {
    const d1 = de - ds
    const d2 = te - ts
    const v2 = v - ds
    const r = v2 / d1
    return ts + d2 * r
  }
  let extrema = this.extrema().values
  if (extrema.indexOf(0) === -1) {
    extrema = [ 0 ].concat(extrema)
  }
  if (extrema.indexOf(1) === -1) {
    extrema.push(1)
  }
  for (t1 = extrema[0], i = 1; i < extrema.length; i++) {
    t2 = extrema[i]
    segment = this.split(t1, t2)
    segment._t1 = t1
    segment._t2 = t2
    pass1.push(segment)
    t1 = t2
  }
  // second pass: further reduce these segments to simple segments
  pass1.forEach(function (p1) {
    t1 = 0
    t2 = 0
    while (t2 <= 1) {
      for (t2 = t1 + step; t2 <= 1 + step; t2 += step) {
        segment = p1.split(t1, t2)
        if (!segment.simple()) {
          // угол между нормалями больше 60 градусов или направлен в разные стороны
          t2 -= step
          if (Math.abs(t1 - t2) < step) {
            // we can never form a reduction
            // добавлено, иначе теряем сегменты кривой **
            if (lengthLine(segment.points[0], segment.points[3]) > 0.5) {
              pass2.push(p1) //  оставляем сегмент
            }
            return // сегмен короче 0.5px теряем
          }
          segment = p1.split(t1, t2)
          segment._t1 = utilsMap(t1, 0, 1, p1._t1, p1._t2)
          segment._t2 = utilsMap(t2, 0, 1, p1._t1, p1._t2)
          pass2.push(segment)
          t1 = t2
          break
        }
      }
    }
    if (t1 < 1) {
      segment = p1.split(t1, 1)
      segment._t1 = utilsMap(t1, 0, 1, p1._t1, p1._t2)
      segment._t2 = p1._t2
      pass2.push(segment)
    }
  })
  return pass2
}
// ----------------------------------------------------------------------------------------------
// Построение пути(svg.path) по массиву кривых Безье
function curveToPath (mCurve) {
  const pathCurve = []
  for (let k = 0; k < mCurve.length; k++) {
    pathCurve.push(...mCurve[k].sectionBez.map((p) =>
      `M ${p[0].x} ${p[0].y} C ${p[1].x} ${p[1].y}  ${p[2].x}  ${p[2].y}  ${p[3].x}  ${p[3].y} `),
    )
  }
  return pathCurve
}
// ----------------------------------------------------------------------------------------------
// определение точек пунктирной линии перед стрелкой
export function buildingDotted (result, points, count) {
  if (points.length < 3) {
    return ''
  }
  const pointN = points[points.length - 1]
  const [ pointR, pointBase ] = pointReflected(pointN, points[0], points[1])
  const offset = lengthLine(points[points.length - 1], pointR) / 8
  const pointO = increaseSection(pointBase, points[0], offset / Math.tan(angle3Points(points[0], pointBase, pointN)))
  const pointDottedL = increaseSection(pointBase, pointN, offset)
  const pointDottedR = increaseSection(pointBase, pointR, offset)
  const mLine = [ pointDottedL, pointO, pointDottedR ]
  drawDotted(result, mLine, [ 2, 1 ], count)
}
// ----------------------------------------------------------------------------------------------
// пунктир по точкам
// count - количество елементов пунктира на отрезке
export function drawDotted (result, points, dashArray, count = 3) {
  if (points.length < 2) {
    return ''
  }
  const color = result.layer._path.getAttribute('stroke')
  const width = result.layer._path.getAttribute('stroke-width')
  const pathDotted = 'M' + points.map((el) => `${el.x} ${el.y}`).join('L')
  if (!(Array.isArray(dashArray) && dashArray.length === 2 && Number(dashArray[0]) && Number(dashArray[1]))) {
    dashArray = [ 2, 1 ]
  }
  // по длине первого отрезка рассчитываем шаг пунктира
  const kfEnd = points.length === 2 ? 1 : 2
  let ls = lengthLine(points[0], points[1]) / (count * (dashArray[0] + dashArray[1]) + dashArray[0] / kfEnd)
  ls = ls < 2 ? 2 : ls // длина елемента пунктира не менее 2 px
  const dash = `${ls * dashArray[0]}, ${ls * dashArray[1]}`
  result.amplifiers += `<path fill="transparent" stroke="${color}" stroke-width="${width}" stroke-dasharray="${dash}" d="${pathDotted}" />`
}
// -------------------------------------------------
function constructionPath (datapt, equally) {
  const pt = JSON.parse(datapt)
  const mKtBezier = qalqControlPoints(pt, equally)
  const pathCurve = []
  const mpt = pt.slice(1) // убираем стартовую направляющую точку
  for (let i = 1; i < mpt.length; i++) {
    pathCurve.push(`M${mpt[i - 1].x} ${mpt[i - 1].y} C${mKtBezier[i - 1].ktR.x} ${mKtBezier[i - 1].ktR.y} ${mKtBezier[i].ktL.x} ${mKtBezier[i].ktL.y} ${mpt[i].x} ${mpt[i].y}`)
  }
  return pathCurve
}
// -----------------------------------------------------------------------------------------------------------
// заполнение path линиями
function lineToPath (el) {
  if (el.typeLine === 'line') {
    return `M${el.p1.x} ${el.p1.y} L${el.p2.x} ${el.p2.y}`
  }
  if (el.typeLine === 'round') {
    if (isDef(el.radius)) { // задан радиус
      const sweepFlag = (el.radius < 0) ? 1 : 0
      const radius = Math.abs(el.radius)
      return `M${el.p1.x} ${el.p1.y} A${radius} ${radius} 0 0 ${sweepFlag}  ${el.p2.x} ${el.p2.y}`
    } else {
      // нет радиуса
      // return `M${el.p1.x} ${el.p1.y} A${widthL} ${widthL} 0 0 ${sweepFlag} ${el.p2.x} ${el.p2.y}`
    }
  }
}

// ----------------------------------------------------------------------------------------------------------
// построение тела стрелки прямыми без обработки соединений
function constructionLines (pt, widthL) {
  const mLineL = []
  const mLineP = []
  for (let i = 1; i < pt.length; i++) { // создание смещенных отрезков
    const angleP = angleLineToOX(pt[i - 1], pt[i])
    const angleNormL = angleP - Math.PI / 2
    const angleNormP = angleP + Math.PI / 2
    const dxL = widthL * Math.cos(angleNormL)
    const dyL = widthL * Math.sin(angleNormL)
    const pL1 = { x: pt[i - 1].x + dxL, y: pt[i - 1].y + dyL }
    const pL2 = { x: pt[i].x + dxL, y: pt[i].y + dyL }
    const dxP = widthL * Math.cos(angleNormP)
    const dyP = widthL * Math.sin(angleNormP)
    const pP1 = { x: pt[i - 1].x + dxP, y: pt[i - 1].y + dyP }
    const pP2 = { x: pt[i].x + dxP, y: pt[i].y + dyP }
    mLineL.push({ p1: pL1, p2: pL2 })
    mLineP.push({ p1: pP1, p2: pP2 })
  }
  return [ mLineL, mLineP ]
}
// ----------------------------------------------------------------------------------------------------------
// построение тела стрелки прямыми
// bindingType - Тип обработки углов [arcs, miter, round, bevel]
function constructionTailLine (pt, widthL, bindingType) {
  const mLineL = []
  const mLineP = []
  const path = []
  for (let i = 1; i < pt.length; i++) { // создание смещенных отрезков
    const angleP = angleLineToOX(pt[i - 1], pt[i])
    const angleNormL = angleP - Math.PI / 2
    const angleNormP = angleP + Math.PI / 2
    const dxL = widthL * Math.cos(angleNormL)
    const dyL = widthL * Math.sin(angleNormL)
    const pL1 = { x: pt[i - 1].x + dxL, y: pt[i - 1].y + dyL }
    const pL2 = { x: pt[i].x + dxL, y: pt[i].y + dyL }
    const dxP = widthL * Math.cos(angleNormP)
    const dyP = widthL * Math.sin(angleNormP)
    const pP1 = { x: pt[i - 1].x + dxP, y: pt[i - 1].y + dyP }
    const pP2 = { x: pt[i].x + dxP, y: pt[i].y + dyP }
    mLineL.push({ p1: pL1, p2: pL2 })
    mLineP.push({ p1: pP1, p2: pP2 })
  }
  // Сведение отрезков к ломанной
  const mLineTypeL = bindingLine(mLineL, bindingType, widthL)
  const mLineTypeP = bindingLine(mLineP, bindingType, widthL)
  path.push(...mLineTypeL.map(lineToPath))
  path.push(...mLineTypeP.map(lineToPath))
  return path.join(' ')
}

// --------------------------------------------------------------------------------
// Обработка соединения прямых
function bindingLine (mLine, _bindingType, widthL) {
  let bindType = 'bevel'
  if (isDef(_bindingType)) {
    if (_bindingType === 'arcs' || _bindingType === 'bevel' || _bindingType === 'miter' ||
      _bindingType === 'round' || _bindingType === 'smooth') {
      bindType = _bindingType
    }
  }
  const mNewLine = [] // массив фигур для построения path
  for (let i = 0; i < (mLine.length - 1); i++) {
    const pIntersec = Intersection.intersectLineLine(mLine[i].p1, mLine[i].p2, mLine[i + 1].p1, mLine[i + 1].p2)
    if ((i === 0) && (pIntersec.status !== 'Intersection')) {
      const angle2 = Math.abs(angle3Points(mLine[1].p1, mLine[0].p2, mLine[1].p2))
      const angle1 = Math.abs(angle3Points(mLine[0].p2, mLine[0].p1, mLine[1].p1))
      if ((angle1 < Math.PI / 2) && (angle2 < Math.PI / 2)) {
        // Сводим внутренние близкие не пересекающиеся отрезки
        pIntersec.status = 'Intersection'
        pIntersec.points = [ mLine[1].p1 ]
      }
    }
    if (pIntersec.status === 'Intersection' && isDef(pIntersec.points[0])) {
      if (bindType === 'smooth') { // внутреннее пересечение для (  || bindType === 'round' ) пока не скругляем
        // закругляем пересечение
        // центр скругления бисектриса длиной widthL
        pointIntersecLine(mLine[i].p1, mLine[i].p2, mLine[i + 1].p1, mLine[i + 1].p2)
        const angle3 = angle3Points(pIntersec.points[0], mLine[i].p1, mLine[i + 1].p2) / 2
        // Обрезаем сегменты до точки пересечения
        mLine[i].p2 = pIntersec.points[0]
        const shortening = widthL * Math.abs(Math.cos(angle3))
        // Обрезаем сегменты до точки начала сектора
        const s1 = truncateSection(mLine[i].p1, mLine[i].p2, shortening) // pointsToSegment(pIntersec.points[0], mLine[i].p1, shortening)
        const s2 = pointsToSegment(pIntersec.points[0], mLine[i + 1].p2, shortening)
        mLine[i].p2 = s1
        mNewLine.push({ p1: mLine[i].p1, p2: mLine[i].p2, typeLine: 'line' })
        // соединяем отрезки сектором
        mNewLine.push({ p1: s1, p2: s2, typeLine: 'round', radius: widthL * Math.sin(angle3) })
        mLine[i + 1].p1 = s2 // pIntersec.points[0]
      } else {
        // просто обрезаем до точки пересечения
        mLine[i].p2 = pIntersec.points[0]
        mNewLine.push({ p1: mLine[i].p1, p2: mLine[i].p2, typeLine: 'line' })
        mLine[i + 1].p1 = pIntersec.points[0]
      }
    } else { // нет пересечения, соединяем
      let bind = bindType
      if (bindType === 'miter') {
        // Срез определяется по углу пересечения
        const angle2 = Math.abs(angle4Points(mLine[i].p2, mLine[i].p1, mLine[i + 1].p1, mLine[i + 1].p2))
        if (angle2 > Math.PI / 2) {
          // угол тупой - дотягиваем линии до пересечения
          bind = 'arcs'
        } else {
          // удлиняем линии чтобы соединяющая линии была дальше ширины линии
          bind = 'bevel'
          const increase = widthL * Math.tan((Math.PI - angle2) / 4)
          mLine[i].p2 = increaseSection(mLine[i].p1, mLine[i].p2, increase)
          mLine[i + 1].p1 = increaseSection(mLine[i + 1].p2, mLine[i + 1].p1, increase)
        }
      }
      if (bind === 'arcs') { // дотягиваем линии до пересечения
        const pIntersec = pointIntersecLine(mLine[i].p1, mLine[i].p2, mLine[i + 1].p1, mLine[i + 1].p2)
        if (isDef(pIntersec)) { // удлиняем отрезки до предпологаемого пересечения их лучей
          mLine[i].p2 = pIntersec
          mLine[i + 1].p1 = pIntersec
        }
      }
      if (bind === 'smooth') { // линии соединяем сектором с центром внутреннуго сектора
        const angle4 = angle4Points(mLine[i].p2, mLine[i].p1, mLine[i + 1].p1, mLine[i + 1].p2) / 2
        const shortening1 = widthL * Math.cos(Math.abs(angle4))
        const shortening2 = widthL / Math.tan(Math.abs(angle4))
        const shortening = shortening1 + shortening2
        // укорачиваем линии
        mLine[i].p2 = truncateSection(mLine[i].p1, mLine[i].p2, shortening)
        mLine[i + 1].p1 = truncateSection(mLine[i + 1].p2, mLine[i + 1].p1, shortening)
        const radius = widthL * (2 + Math.sin(Math.abs(angle4))) * ((angle4 < 0) ? -1 : 1)
        mNewLine.push({ p1: mLine[i].p1, p2: mLine[i].p2, typeLine: 'line' })
        mNewLine.push({ p1: mLine[i].p2, p2: mLine[i + 1].p1, typeLine: 'round', radius })
      } else {
        // не укорачивали линию
        mNewLine.push({ p1: mLine[i].p1, p2: mLine[i].p2, typeLine: 'line' })
      }
      if (bind === 'round') { // линии соединяем сектором с центром в контрольой точке
        const angle4 = angle4Points(mLine[i].p2, mLine[i].p1, mLine[i + 1].p1, mLine[i + 1].p2) / 2
        const radius = widthL * ((angle4 < 0) ? -1 : 1)
        mNewLine.push({ p1: mLine[i].p2, p2: mLine[i + 1].p1, typeLine: 'round', radius })
      }
      if (bind === 'bevel') { // Срезаем угол пересечения, соединяем разведенные отрезки
        mNewLine.push({ p1: mLine[i].p2, p2: mLine[i + 1].p1, typeLine: 'line' })
      }
    }
  }
  if (mLine.length > 0) {
    mNewLine.push({ p1: mLine[mLine.length - 1].p1, p2: mLine[mLine.length - 1].p2, typeLine: 'line' })
  }
  return mNewLine
}
// -------------------------------------------------------------------------------------------------------
// блискавка
export function drawLightning (result, pN, pK) {
  const lengthL = lengthLine(pN, pK)
  const lengthZ = lengthL / 10
  const dx = pN.x - pK.x
  const dy = pN.y - pK.y
  const angle = Math.atan2(dy, dx) - Math.PI / 4
  const pC = {
    x: pN.x - dx / 2,
    y: pN.y - dy / 2,
  }
  const p1 = {
    x: pC.x - Math.cos(angle) * lengthZ,
    y: pC.y - Math.sin(angle) * lengthZ,
  }
  const p2 = {
    x: pC.x + Math.cos(angle) * lengthZ,
    y: pC.y + Math.sin(angle) * lengthZ,
  }
  const angleA = Math.atan2(p2.y - pK.y, p2.x - pK.x)
  const pA1 = {
    x: pK.x + Math.cos(angleA - Math.PI / 18) * lengthL / 5,
    y: pK.y + Math.sin(angleA - Math.PI / 18) * lengthL / 5,
  }

  const pA2 = {
    x: pK.x + Math.cos(angleA + Math.PI / 18) * lengthL / 5,
    y: pK.y + Math.sin(angleA + Math.PI / 18) * lengthL / 5,
  }
  moveTo(result, pN)
  lineTo(result, p1)
  lineTo(result, p2)
  lineTo(result, pK)
  lineTo(result, pA1)
  moveTo(result, pK)
  lineTo(result, pA2)
}
// ---------------------------------------------------------------------------------------------------
// проводне керування
export function drawWires (result, pN, pK) {
  const lengthL = lengthLine(pN, pK)
  const radius = lengthL / 4
  const lengthK = lengthL / 5
  const dx = pN.x - pK.x
  const dy = pN.y - pK.y
  const da = radius - Math.sqrt(radius * radius - lengthK * lengthK)
  const pA1 = {
    x: pK.x - lengthK,
    y: pK.y + da,
  }
  const pA2 = {
    x: pK.x + lengthK,
    y: pK.y + da,
  }
  drawArc(result, pA1, pA2, radius, 0, 0, 1)
  const pC = {
    x: pN.x - dx / 2,
    y: pN.y - dy / 2,
  }
  const pK1 = {
    x: pC.x - lengthK,
    y: pC.y - lengthK,
  }
  const pK2 = {
    x: pC.x + lengthK,
    y: pC.y + lengthK,
  }
  drawBezier(result, pN, pK1, pK2, pK)
}

const EPSILON = 1e-12
const textSizeCache = {}

export const extractLineCode = (code) => code.slice(10, 16)
export const findDefinition = (code) => lineDefinitions[extractLineCode(code)]

// === Math ===

// Квадрат (для зручності просто)
export const square = (x) => x * x

// Підгонка кута для текстових блоків (щоб текст не перевертався ногами вгору)
export const cropAngle = (x) => x > Math.PI / 2 ? x - Math.PI
  : x < -Math.PI / 2 ? x + Math.PI
    : x

// Розв'язок квадратного рівняння
export const sqEq = (a, b, c) => {
  const d = Math.sqrt(square(b) - 4 * a * c)
  return [
    (-b + d) / 2 / a,
    (-b - d) / 2 / a,
  ]
}

// Генерація UUID
export const uuid = () => ([ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g,
  // eslint-disable-next-line no-mixed-operators
  (c) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))

// Радіани -> Градуси
export const deg = (x) => x / Math.PI * 180

// Градуси -> Радіани
export const rad = (x) => x * Math.PI / 180

// === Geometry ===

// Нульовий вектор
export const ZERO = { x: 0, y: 0 }

// Довжина відрізка
export const segmentLength = (p1, p2 = ZERO) => Math.sqrt(square(p1.x - p2.x) + square(p1.y - p2.y))

// Частина відрізка
export const segmentBy = (p1, p2, factor = 0.5) => ({
  x: p1.x + (p2.x - p1.x) * factor,
  y: p1.y + (p2.y - p1.y) * factor,
})

// Проекція точки на пряму, задану відрізком, притягнута до наближчої точки цього відрізка
export const setToSegment = (p, [ s1, s2 ]) => {
  const dx = p.x - s1.x
  if (dx === 0) {
    const dy = p.y - s1.y
    if (dy === 0) {
      return s1
    }
    const factor = dy / (s2.y - s1.y)
    if (factor >= 1) {
      return s2
    }
    return p
  }
  const factor = dx / (s2.x - s1.x)
  if (factor >= 1) {
    return s2
  }
  return p
}

// Еквівалентність точок
export const ptEq = (p1, p2) => p1.x === p2.x && p1.y === p2.y

// Співвідношення довжини частини відрізку до довжини всього відрізку
export const calcFactor = (p, [ s1, s2 ]) => segmentLength(getVector(s1, p)) / segmentLength(getVector(s1, s2))

// Масив частин відрізка
export const segmentsBy = (p1, p2, factors) => factors.map((factor) => segmentBy(p1, p2, factor))

// Кут за двома точками (між відрізком, що сполучає ці точки, та віссю абсцис)
export const angleOf = (p2, p1 = ZERO) => Math.atan2(p2.y - p1.y, p2.x - p1.x)

// Знайти вектор нормалі від відрізка до точки
export const normalVectorTo = (p1, p2, p) => {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  if (dx === 0 && dy === 0) {
    return {
      x: 0,
      y: 0,
    }
  } else if (dx === 0) {
    return {
      x: p.x - p1.x,
      y: 0,
    }
  } else if (dy === 0) {
    return {
      x: 0,
      y: p.y - p1.y,
    }
  } else {
    const k = dy / dx
    const b = p1.y - p1.x * k
    const kn = -1 / k
    const bn = p.y - p.x * kn
    const x = (bn - b) / (k - kn)
    const y = k * x + b
    return {
      x: p.x - x,
      y: p.y - y,
    }
  }
}

// Обчислити вектор, що із точки point1 приводить у точку point2
export const getVector = (point1, point2) => ({
  x: point2.x - point1.x,
  y: point2.y - point1.y,
})

// Застосувати вектор до точки (трансляція)
export const applyVector = (point, vector) => ({
  x: point.x + vector.x,
  y: point.y + vector.y,
})

// Множення вектора на скаляр
export const multiplyVector = (vector, value) => ({
  x: vector.x * value,
  y: vector.y * value,
})

// Протилежний вектор
export const oppositeVector = (vector) => multiplyVector(vector, -1)

// Встановлення довжини вектора
export const setVectorLength = (vector, length) => {
  const oldLength = segmentLength(vector)
  if (oldLength === 0) {
    return ZERO
  }
  return multiplyVector(vector, length / oldLength)
}

// Індекс півплощини (відносно прямої, що проходить черех перших дві точки), у яку потрапить третя точка
export const halfPlane = (p0, p1, p2) => {
  const tCheck = compose(
    rotate(-angleOf(p1, p0)),
    translate(-p0.x, -p0.y),
  )
  const pCheck = applyToPoint(tCheck, p2)
  return Number(pCheck.y > 0)
}

// Переводить 1 в 1, 0 в -1,
export const neg = (value) => value * 2 - 1

// Обчислити координати точки, яку отримаємо, якщо рухаючись із точки p1 до p2
// перенесемо на вказану відстань під заданим кутом
export const getPointAt = (p1, p2, angle, length) => applyToPoint(
  compose(
    translate(p2.x, p2.y),
    rotate(angleOf(p2, p1) + angle),
  ),
  { x: length, y: 0 },
)

// Обчислити координати точки, яку отримаємо, якщо точку p1
// переповернемо на вказаний кут і пройдемо ще вказану відстань
export const getPointMove = (p, angle, length) => applyToPoint(
  compose(
    translate(p.x, p.y),
    rotate(angle),
  ),
  { x: length, y: 0 },
)

// Трансляція центру координат до вказаної точки
export const translateTo = (p) => translate(p.x, p.y)

// Трансляція центру координат від вказаної точки
export const translateFrom = (p) => translate(-p.x, -p.y)

// Пошук у масиві точки, найближчої до вказаної
export const findNearest = (point, list) => {
  let index = -1
  let value = Infinity
  for (let i = 0; i < list.length; i++) {
    const dist = segmentLength(point, list[i])
    if (dist < value) {
      index = i
      value = dist
    }
  }
  return index
}

// Наявність перетинів
export const hasIntersection = (p1, p2, s1, s2) => {
  if (ptEq(p1, p2) || ptEq(s1, s2)) {
    return [ false ]
  }
  const det = (a, b, c, d) => a * d - b * c
  const between = (a, b, c) => Math.min(a, b) <= c + EPSILON && c <= Math.max(a, b) + EPSILON
  const intersect = (a, b, c, d) => {
    if (a > b) {
      [ a, b ] = [ b, a ]
    }
    if (c > d) {
      [ c, d ] = [ d, c ]
    }
    return Math.max(a, c) <= Math.min(b, d)
  }
  const A1 = p1.y - p2.y
  const B1 = p2.x - p1.x
  const C1 = -A1 * p1.x - B1 * p1.y
  const A2 = s1.y - s2.y
  const B2 = s2.x - s1.x
  const C2 = -A2 * s1.x - B2 * s1.y
  const zn = det(A1, B1, A2, B2)
  if (zn !== 0) {
    const x = -det(C1, B1, C2, B2) / zn
    const y = -det(A1, C1, A2, C2) / zn
    return [
      between(p1.x, p2.x, x) && between(p1.y, p2.y, y) && between(s1.x, s2.x, x) && between(s1.y, s2.y, y),
      { x, y },
    ]
  } else {
    return [
      det(A1, C1, A2, C2) === 0 && det(B1, C1, B2, C2) === 0 && intersect(p1.x, p2.x, s1.x, s2.x) &&
      intersect(p1.y, p2.y, s1.y, s2.y),
      null, // TODO: обчислити точку в цьому випадку
    ]
  }
}

export const drawBezierSpline = (result, points, locked) => (result.d += prepareBezierPath(points, locked))

// === Utils ===

// Визначення піксельних розмірів текстового блоку
export const textBBox = (text, layer, sizeFactor = 1) => {
  const element = L.SVG.create('text')
  const fontSize = getFontSize(layer, sizeFactor)
  element.setAttribute('font-family', CONFIG.FONT_FAMILY)
  element.setAttribute('font-size', `${fontSize}`)
  element.setAttribute('font-weight', CONFIG.FONT_WEIGHT)
  element.innerHTML = text
  if (layer?._renderer?._rootGroup) {
    layer._renderer._rootGroup.appendChild(element)
    const result = element.getBBox()
    element.remove()
    return result
  }
  // для друку
  const fontConfig = `${CONFIG.FONT_WEIGHT} ${Math.round(fontSize)}px ${CONFIG.FONT_FAMILY}`
  return { width: getTextWidth(text, fontConfig), height: fontSize }
}

// === Draw ===

// Переміститися у вказану точку
export const moveTo = (result, p) => (result.d += ` M${p.x} ${p.y}`)

// Провести лінію до вкааної точки
export const lineTo = (result, p) => (result.d += ` L${p.x} ${p.y}`)

export const bezierTo = (result, cp1, cp2, p) => (result.d += ` C${cp1.x} ${cp1.y} ${cp2.x} ${cp2.y} ${p.x} ${p.y}`)

// Ламана лінія між вказаними точками
export const drawLine = (result, p1, ...rest) => {
  moveTo(result, p1)
  rest.forEach((point) => lineTo(result, point))
}

// продовження ламаної лінія між вказаними точками
export const drawLineProceed = (result, p1, ...rest) => {
  rest.forEach((point) => lineTo(result, point))
}

// вставка в path соединнения последнюй точки пути с ее начальной точкой
export const drawZ = (result) => {
  result.d += `Z`
}

// Пунктирна линия між  вказаними точками
export const drawLineDashed = (result, pBegin, pEnd, dashed) => {
  moveTo(result, pBegin)
  const length = lengthLine(pBegin, pEnd)
  const n = Math.floor(length / dashed / 2)
  let pP
  for (let i = 0; i < n; i++) {
    pP = getPointAt(pEnd, pBegin, 0, -dashed * (i * 2 + 1))
    lineTo(result, pP)
    pP = getPointAt(pEnd, pBegin, 0, -dashed * (i * 2 + 2))
    moveTo(result, pP)
  }
  lineTo(result, pEnd)
}

// Дуга кола до вказаної точки // (rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y)
export const arcTo = (result, p, rx, ry, ar = 0, la = 0, sf = 0) =>
  (result.d += ` A${rx} ${ry} ${ar} ${la} ${sf} ${p.x} ${p.y}`)

// Дуга кола між вказаними точками
export const drawArc = (result, p1, p2, r, ar = 0, la = 0, sf = 0, z = false) => {
  moveTo(result, p1)
  arcTo(result, p2, r, r, ar, la, sf)
  if (z) {
    result.d += `Z`
  }
}

export const drawCircle = (result, center, radius) => {
  const p1 = {
    x: center.x + radius,
    y: center.y,
  }
  const p2 = {
    x: center.x - radius,
    y: center.y,
  }
  moveTo(result, p1)
  arcTo(result, p2, radius, radius)
  arcTo(result, p1, radius, radius)
}

export const drawRectangleC = (result, center, widthR, heightR) => {
  const dx = widthR / 2
  const dy = heightR / 2
  const p1 = {
    x: center.x - dx,
    y: center.y - dy,
  }
  drawLine(
    result,
    p1,
    {
      x: center.x + dx,
      y: center.y - dy,
    },
    {
      x: center.x + dx,
      y: center.y + dy,
    },
    {
      x: center.x - dx,
      y: center.y + dy,
    },
    p1,
  )
}

export const drawRectangleCz = (result, center, widthR, heightR) => {
  const dx = widthR / 2
  const dy = heightR / 2
  const p1 = {
    x: center.x - dx,
    y: center.y - dy,
  }
  drawLine(
    result,
    p1,
    {
      x: center.x + dx,
      y: center.y - dy,
    },
    {
      x: center.x + dx,
      y: center.y + dy,
    },
    {
      x: center.x - dx,
      y: center.y + dy,
    },
  )
  result.d += 'z'
}

export const drawBezier = (result, p1, ...rest) => {
  moveTo(result, p1)
  for (let i = 0; i < rest.length; i += 3) {
    bezierTo(result, rest[i], rest[i + 1], rest[i + 2])
  }
}

export const emptyPath = () => ({ d: '' })

// Малювання відрізка зі стрілкою на кінці (вказуються розміри катетів виносних елементів стрілки)
export const drawArrow = (result, p1, p2, dL, dW) => {
  drawLine(result, p1, p2)
  const l = segmentLength(p1, p2)
  if (l > 0) {
    const t = compose(
      translate(p1.x, p1.y),
      rotate(angleOf(applyToPoint(translate(-p1.x, -p1.y), p2))),
    )
    drawLine(
      result,
      applyToPoint(t, {
        x: l - dL,
        y: -dW,
      }),
      p2,
      applyToPoint(t, {
        x: l - dL,
        y: +dW,
      }),
    )
  }
}

// Стрілка з подвійної лінії
export const drawArrowOutline = (result, p1, p2, dL, dW, ddL, ddW, drawArrowLine = true) => {
  ddL = ddL === undefined ? dL / 3 : ddL
  ddW = ddW === undefined ? dW / 3 : ddW
  if (drawArrowLine) {
    drawLine(result, p1, p2)
  }
  const l = segmentLength(p1, p2)
  if (l > 0) {
    const t = compose(
      translate(p1.x, p1.y),
      rotate(angleOf(applyToPoint(translate(-p1.x, -p1.y), p2))),
    )
    drawLine(
      result,
      applyToPoint(t, {
        x: l - dL,
        y: -dW,
      }),
      p2,
      applyToPoint(t, {
        x: l - dL,
        y: dW,
      }),
      applyToPoint(t, {
        x: l - dL,
        y: dW + ddW,
      }),
      segmentBy(p1, p2, 1 + ddL / l),
      applyToPoint(t, {
        x: l - dL,
        y: -dW - ddW,
      }),
      applyToPoint(t, {
        x: l - dL,
        y: -dW,
      }),
    )
    drawZ(result)
  }
}

// Стрілка з пунктирною лінією
export const drawDoubleArrowDashes = (result, p1, p2, dL, dW, ddL, ddW) => {
  ddL = ddL === undefined ? dL / 3 : ddL
  ddW = ddW === undefined ? dW / 3 : ddW
  drawLine(result, p1, p2)
  const l = segmentLength(p1, p2)
  if (l > 0) {
    const t = compose(
      translate(p1.x, p1.y),
      rotate(angleOf(applyToPoint(translate(-p1.x, -p1.y), p2))),
    )
    drawLine(
      result,
      applyToPoint(t, {
        x: l - dL,
        y: -dW,
      }),
      p2,
      applyToPoint(t, {
        x: l - dL,
        y: dW,
      }),
    )
    const pd = applyToPoint(t, {
      x: l - dL,
      y: dW + ddW,
    })
    const pc = segmentBy(p1, p2, 1 + ddL / l)
    const pu = applyToPoint(t, {
      x: l - dL,
      y: -dW - ddW,
    })
    drawLine(
      result,
      pd,
      segmentBy(pd, pc, 0.2),
    )
    drawLine(
      result,
      segmentBy(pd, pc, 0.4),
      segmentBy(pd, pc, 0.6),
    )
    drawLine(
      result,
      segmentBy(pd, pc, 0.8),
      pc,
      segmentBy(pu, pc, 0.8),
    )
    drawLine(
      result,
      segmentBy(pu, pc, 0.6),
      segmentBy(pu, pc, 0.4),
    )
    drawLine(
      result,
      segmentBy(pu, pc, 0.2),
      pu,
    )
  }
}

// Стрілка з пунктирної лінії
export const drawArrowDashes = (result, pO, angle, length) => {
  const pd = getPointMove(pO, angle - Math.PI / 4, length)
  const pu = getPointMove(pO, angle + Math.PI / 4, length)
  drawLine(
    result,
    pd,
    segmentBy(pd, pO, 0.25),
  )
  drawLine(
    result,
    segmentBy(pd, pO, 0.375),
    segmentBy(pd, pO, 0.625),
  )
  drawLine(
    result,
    segmentBy(pd, pO, 0.75),
    pO,
    segmentBy(pu, pO, 0.75),
  )
  drawLine(
    result,
    segmentBy(pu, pO, 0.625),
    segmentBy(pu, pO, 0.375),
  )
  drawLine(
    result,
    segmentBy(pu, pO, 0.25),
    pu,
  )
}

// Продовження відрізку засічкою вказаного розміру
export const continueLine = (result, p1, p2, x, y) => {
  const t = compose(
    translate(p2.x, p2.y),
    rotate(angleOf(applyToPoint(translate(-p1.x, -p1.y), p2))),
  )
  return drawLine(result, p2, applyToPoint(t, { x, y }))
}

// Виведення тексту
// eslint-disable-next-line max-len
export const drawText = (
  result,
  textPoint,
  textAngle,
  text,
  sizeFactor = 1,
  textAnchor = 'middle',
  textAlign = 'middle',
  color = null) => {
  if (!text || !text.length) {
    return [ '', { width: 0, height: 0 } ]
  }
  const fontSize = getFontSize(result.layer, sizeFactor) // Обчислення розміру шрифту
  const key = `${fontSize}:${text}`
  let box = textSizeCache[key]
  if (!box) {
    box = textBBox(text, result.layer, sizeFactor, fontSize)
    textSizeCache[key] = box
  }
  // Ампліфікатор
  // font-weight="${CONFIG.FONT_WEIGHT}"
  const fill = color ? `fill = "${color}"` : `fill="black"`
  const transform = `translate(${textPoint.x},${textPoint.y}) rotate(${deg(cropAngle(textAngle))})`
  result.amplifiers += `<text 
    font-family="${FONT_FAMILY}"
    font-weight="${FONT_WEIGHT}"
    stroke="none" 
    ${fill}
    transform="${transform}"
    x="${0}" 
    y="${0}" 
    text-anchor="${textAnchor}" 
    font-size="${fontSize}"
    alignment-baseline="${textAlign}" 
  >${text}</text>`
  return [ transform, box ]
}
// font-size="${Math.round(CONFIG.FONT_SIZE * sizeFactor * 10) / 10}em"
// Виведення тексту у прямокутнику, вирізаному маскою з основного зображення
// eslint-disable-next-line max-len
export const drawMaskedText = (
  result,
  textPoint,
  textAngle,
  text,
  sizeFactor = 1,
  textAnchor = 'middle',
  textAlign = 'middle',
  color,
  isNumber = false) => {
  if (!text || !text.length) {
    return
  }
  const [ transform, box ] = drawText(result, textPoint, textAngle, text, sizeFactor, textAnchor, textAlign, color)
  // Маска
  const w = box.width / 2 + CONFIG.TEXT_EDGE
  const h = box.height / 2 + CONFIG.TEXT_EDGE
  let y
  if (textAlign === 'baseline' || textAlign === 'after-edge' || textAlign === 'text-after-edge') {
    y = h * 2
  } else if (textAlign === 'before-edge' || textAlign === 'text-before-edge') {
    y = 0
  } else {
    y = h
  }
  result.mask += `<rect
    fill="black"
    transform="${transform}" 
    x="-${w}" 
    y="-${y}" 
    width="${w * 2}" 
    height="${h * 2 * (isNumber ? 0.85 : 1)}"
  />`
}

export const addPathAmplifier = (result, amplifier, closed, dash) => {
  const color = result.layer._path
    ? result.layer._path.getAttribute('stroke')
    : result.layer.object.attributes.color
  const width = result.layer._path
    ? result.layer._path.getAttribute('stroke-width')
    : result.layer.object.attributes.strokeWidth

  result.amplifiers += `<path 
    stroke="${color}" ${closed ? ` fill="${color}"` : ` fill="none" stroke-width="${width}"`}${dash ? ` stroke-dasharray="${dash}"` : ''} 
    d="${amplifier.d}" 
  />`
}

export const getMaxPolygon = (points) => {
  const polygon = []
  let beginPoint = points[0]
  let beginIndex = 0
  if (points.length < 3) {
    return [ ...points ]
  }
  points.forEach((point, index) => {
    if (point.x < beginPoint.x || (point.x === beginPoint.x && point.y < beginPoint.y)) {
      beginPoint = point
      beginIndex = index
    }
  })
  polygon.push(beginPoint)
  const degradation = points.filter((e, index) => (index !== beginIndex))
  const nextPoint = degradation[0]
  const indexR = getLeftPoint(degradation, beginPoint, nextPoint)
  polygon.push(degradation[indexR]) // есть вторая точка многоугольника
  degradation.splice(indexR, 1)
  degradation.push(beginPoint)
  while (degradation.length) {
    const endIndex = polygon.length - 1
    const indexR = getLeftPoint(degradation, polygon[endIndex], polygon[endIndex - 1])
    if (indexR < 0) { // чето не срослось
      break
    }
    if (indexR === degradation.length - 1) { // пришли в начало
      break
    }
    polygon.push(degradation[indexR])
    degradation.splice(indexR, 1)
  }
  return polygon
}

function getLeftPoint (points, lP, nP) {
  let angle = -Math.PI
  let indexR = -1
  let distance = infinity
  points.forEach((point, index) => {
    const pP = coordinatesToPolar(lP, nP, point)
    if ((angle < pP.angle) || (angle === pP.angle && distance > pP.beamLength)) {
      angle = pP.angle
      indexR = index
      distance = pP.beamLength
    }
  })
  return indexR
}

// отресовка стрелок и оконцовок для линий ( пока только SOPHIISTICATED)
// не требующие заливки добавляются в "d" к пути линии
// требующие заливки выводятся в амплификаторы
export const drawLineMark = (result, markType, point, angle, scale = 1, color, lineWidth = 1) => {
  const graphicSize = getGraphicSize(result.layer)
  const strokeWidth = getStrokeWidth(result.layer, lineWidth, scale)
  let colorFill
  let da
  let hArrow
  let oArrow
  switch (markType) {
    case MARK_TYPE.SERIF:
      drawLine(result,
        getPointMove(point, angle - Math.PI / 2, graphicSize / 2),
        getPointMove(point, angle + Math.PI / 2, graphicSize / 2))
      return graphicSize
    case MARK_TYPE.ANGLE:
      drawLine(result,
        point,
        getPointMove(point, angle, graphicSize))
      return graphicSize
    case MARK_TYPE.CROSS:
      drawLine(result,
        getPointMove(point, angle - Math.PI / 3, graphicSize),
        getPointMove(point, angle - Math.PI / 3, -graphicSize))
      drawLine(result,
        getPointMove(point, angle + Math.PI / 3, graphicSize),
        getPointMove(point, angle + Math.PI / 3, -graphicSize))
      return graphicSize
    case MARK_TYPE.ARROW_90:
      da = Math.PI / 4
      break
    case MARK_TYPE.ARROW_60:
      da = Math.PI / 6
      break
    case MARK_TYPE.ARROW_45:
      da = Math.PI / 8
      break
    case MARK_TYPE.ARROW_30:
      da = Math.PI / 12
      break
    case MARK_TYPE.ARROW_90_DASHES:
      drawArrowDashes(result, point, angle, graphicSize * scale)
      return graphicSize
    case MARK_TYPE.ARROW2:
    case MARK_TYPE.ARROW_60_FILL: // для стрілок з заливкою
      oArrow = graphicSize * 0.866
      hArrow = graphicSize * 0.5
      colorFill = color || evaluateColor(result.layer.object.attributes.color) || 'black'
      result.amplifiers += drawArrowFill(point, deg(angle), strokeWidth, colorFill, oArrow, hArrow)
      return graphicSize
    case MARK_TYPE.ARROW_30_FILL: // для стрілок з заливкою
      oArrow = graphicSize * 0.966
      hArrow = graphicSize * 0.26
      colorFill = color || evaluateColor(result.layer.object.attributes.color) || 'black'
      result.amplifiers += drawArrowFill(point, deg(angle), strokeWidth, colorFill, oArrow, hArrow)
      return graphicSize
    default: { // для невідомих стрілок
      return graphicSize
    }
  }
  drawLine(result, getPointMove(point, angle - da, graphicSize), point, getPointMove(point, angle + da, graphicSize))
  return graphicSize
}

// Обчислення розміру шрифту
export const getFontSize = (layer, sizeFactor = 1) => {
  if (layer.printOptions) { // статичний розмір (для друку)
    return layer.printOptions.getFontSize() * sizeFactor || 12
  }
  // розмір залежить від маштабу (для екрану)
  return interpolateSize(layer._map.getZoom(), settings.TEXT_AMPLIFIER_SIZE, sizeFactor)
}

// Обчислення розміру маркера
export const getGraphicSize = (layer) => {
  if (layer.printOptions) { // статичний розмір (для друку)
    return layer.printOptions.graphicSize
  }
  // розмір залежить від маштабу (для екрану)
  return interpolateSize(layer._map.getZoom(), settings.GRAPHIC_AMPLIFIER_SIZE)
}

// Обчислення розміру точкового знаку
export const getPointSize = (layer) => {
  if (layer.printOptions) { // статичний розмір (для друку)
    return layer.printOptions.pointSymbolSize
  }
  // розмір залежить від маштабу (для екрану)
  return interpolateSize(layer._map.getZoom(), settings.POINT_SYMBOL_SIZE)
}

// Обчислення товщини линії
export const getStrokeWidth = (layer, width, scale = 1) => {
  if (layer.printOptions) { // статичний розмір (для друку)
    return layer.printOptions.getStrokeWidth(width)
  }
  // розмір залежить від маштабу (для екрану)
  const kfSize = interpolateSize(layer._map.getZoom(), settings.LINE_SIZE, 10) / 100
  return layer.options.weight ?? // уже имеется расчитанная толщина линий
    (width ? width * kfSize // передана базовая толщина линии
      : (layer.object?.attributes?.strokeWidth
        ? layer.object.attributes.strokeWidth * kfSize // расчитываем по аттрибутам объекта
        : settings.LINE_WIDTH * scale
      )
    )
}

// Обчислення розміру пунктиру
export const getDashSize = (layer, scale) => {
  if (layer.printOptions) { // статичний розмір (для друку)
    return layer.printOptions.dashSize
  }
  // розмір залежить від маштабу (для екрану)
  return settings.DASHARRAY * scale
}
