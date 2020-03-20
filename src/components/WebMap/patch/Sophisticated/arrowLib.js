import Bezier from 'bezier-js'
import { Intersection, ShapeInfo } from 'kld-intersections'
import {
  moveTo, lineTo, drawArc, drawBezier,
} from './utils'

const coefTangent = 3
const coefArrowWing = 0.33 // коэфициент выступа стрелки над телом стрелки
const coefArrow = 0.3 // отношение головы стрелки к телу стрелки по умолчанию

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
// eslint-disable-next-line no-unused-vars
function buildingAirborne (datapt, typeLine, bindingType) {
  const coeffH = 0.5 // коэффициент выступа стрелки над телом символа
  if (!datapt) return null
  let pt
  if (typeof (datapt) === 'string') {
    try {
      pt = JSON.parse(datapt)
    } catch (e) {
      //        console.log("Error Jason.parse datapt");
      return null
    }
  } else {
    if (typeof (datapt) !== 'object') return null
    pt = datapt.slice()
  }

  if (pt.length < 3) return null // для построения стрелки нужно минимум две координаты и опоргая точка стрелки[null,null]
  const indEnd = pt.length - 1
  let pointSide // Боковая опорная точка
  if (!isDefPoint(pt[indEnd]) || indEnd < 3) { // нет опорной точки стрелки, расчитываем ее по среднему
    pointSide = referencePoint(pt[0], pt[1])
  } else { // координаты опорной стрелки рассчитываем по имеющимся данным
    const polarPoints = coordinatesToAngle(pt[0], pt[1], pt[indEnd])
    pointSide = referencePoint(pt[0], pt[1], polarPoints.angle, polarPoints.beamLength)
  }
  const [ tR, tO ] = pointReflected(pointSide, pt[0], pt[1]) // tR - точка отражения края стрелки , tO задний край стрелки
  const tLp = segmentDivision(pointSide, tO, coeffH)
  const tRp = segmentDivision(tR, tO, coeffH)
  // eslint-disable-next-line prefer-const
  const widthL = lengthLine(tLp, tRp) // Ширина тела стрелки
  const tEnd = pointsToSegment(pt[1], pt[0], -widthL / 2) // perpendStraight(pt[1], pt[0], pt[1])
  const tEndL = pointRotationToPoint(tEnd, Math.PI / 2, pt[1])
  const tEndR = pointRotationToPoint(tEnd, -Math.PI / 2, pt[1])
  // const PointArrow = [ tLp, pointSide, pt[0], tR, tRp ] // tEndR,tEndL ]
  // const path = 'M' + PointArrow.map(({ x, y }) => `${x} ${y}`).join(' L')
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
// eslint-disable-next-line no-unused-vars
function buildingAttackHelicopter (datapt, typeLine, bindingType) {
  const coeffH = 0.5 // коэффициент выступа стрелки над телом символа
  if (!datapt) return null
  let pt
  if (typeof (datapt) === 'string') {
    try {
      pt = JSON.parse(datapt)
    } catch (e) {
      //        console.log("Error Jason.parse datapt");
      return null
    }
  } else {
    if (typeof (datapt) !== 'object') return null
    pt = datapt.slice()
  }

  if (pt.length < 3) return null// constructionTail(pt,30); // для построения стрелки нужно минимум две координаты и опоргая точка стрелки[null,null]
  const indEnd = pt.length - 1
  let pointSide // Боковая опорная точка стрелки
  if (!isDefPoint(pt[indEnd]) || indEnd < 3) { // нет опорной точки стрелки, расчитываем ее по среднему
    pointSide = referencePoint(pt[0], pt[1])
  } else { // координаты опорной стрелки рассчитываем по имеющимся данным
    const polarPoints = coordinatesToAngle(pt[0], pt[1], pt[indEnd])
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
  if (angle > Math.PI / 2 || angle < -Math.PI / 2) fRotate = -1 // Выворачивание стрелочки к верху
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
  const amplifiers = `M${pm[15].x} ${pm[15].y} L${pm[16].x} ${pm[16].y}L${pm[17].x} ${pm[17].y} Z`
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
// eslint-disable-next-line no-unused-vars
function buildingMainAttack (datapt, typeLine, bindingType) {
  if (!datapt) return null
  let pt
  if (typeof (datapt) === 'string') {
    try {
      pt = JSON.parse(datapt)
    } catch (e) {
      //        console.log("Error Jason.parse datapt");
      return null
    }
  } else {
    if (typeof (datapt) !== 'object') return null
    pt = datapt.slice()
  }

  if (pt.length < 3) return null // constructionTail(pt,30); // для построения стрелки нужно минимум две координаты и опоргая точка стрелки[null,null]
  const indEnd = pt.length - 1
  let pointSide // Боковая опорная точка
  if (!isDefPoint(pt[indEnd]) || indEnd < 3) { // нет опорной точки стрелки, расчитываем ее по среднему
    pointSide = referencePoint(pt[0], pt[1])
  } else { // координаты опорной стрелки рассчитываем по имеющимся данным
    const polarPoints = coordinatesToAngle(pt[0], pt[1], pt[indEnd])
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
// eslint-disable-next-line no-unused-vars
function buildingArrow (datapt, typeLine, bindingType) {
  if (!datapt) return null
  let pt
  if (typeof (datapt) === 'string') {
    try {
      pt = JSON.parse(datapt)
    } catch (e) {
      //        console.log("Error Jason.parse datapt");
      return null
    }
  } else {
    if (typeof (datapt) !== 'object') return null
    pt = datapt.slice()
  }

  if (pt.length < 3) return null// constructionTail(pt,30); // для построения стрелки нужно минимум две координаты и опоргая точка стрелки[null,null]
  const indEnd = pt.length - 1
  let pointSide // Боковая опорная точка
  if (!isDefPoint(pt[indEnd]) || indEnd < 3) { // нет опорной точки стрелки, расчитываем ее по среднему
    pointSide = referencePoint(pt[0], pt[1])
  } else { // координаты опорной стрелки имеются, рассчитываем по имеющимся данным для полярной системы
    const polarPoints = coordinatesToAngle(pt[0], pt[1], pt[indEnd])
    pointSide = referencePoint(pt[0], pt[1], polarPoints.angle, polarPoints.beamLength)
  }
  const [ tR, tO ] = pointReflected(pointSide, pt[0], pt[1]) // tR - точка отражения края стрелки , tO задний край стрелки
  const tLp = segmentDivision(pointSide, tO, getKoefArrow())
  const tRp = segmentDivision(tR, tO, getKoefArrow())
  // eslint-disable-next-line prefer-const
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
// стратегия перемещения опорных точек для символов 151401 - 151406
// eslint-disable-next-line no-unused-vars
const STRATEGY_ARROW = {
  // Довільне розташування усіх точок
  empty: () => {
  },
  // Проверка взаиморасположения точек PT 1, PT 2, PT N (определяют длину и ширину стрелки)
  supportingAttack: (prevPoints, nextPoints, changed) => {
    // const newPT = [...prevPoints];
    if (prevPoints.length === nextPoints.length) { // кол-во точек совпадает
      const indEnd = prevPoints.length - 1
      // console.log({changed},{indEnd});
      // опорных точек должно быть минимум 4 (мне хотябы 3), обрабатываем изменение одной точки
      if (((changed[0] === indEnd || changed[0] < 2) && indEnd > 2)) { // Обрабатываем изменения контрольных точек головы стрелки
        const referencePT = { x: nextPoints[indEnd].x, y: nextPoints[indEnd].y }
        const polarPoint = coordinatesToAngle(prevPoints[0], prevPoints[1], referencePT)
        //      console.log({referencePT});
        const coordinates = referencePoint(nextPoints[0], nextPoints[1], polarPoint.angle, polarPoint.beamLength)
        //      console.log({coordinates});
        nextPoints[indEnd] = { x: coordinates.x, y: coordinates.y }
      }
    }
  }
}

// ----------------------------------------------------------------------------------
// Деление отрезка на сегменты с коэфициентом kf
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
// eslint-disable-next-line no-unused-vars
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
function referencePoint (t1, t2, angle, beamLength) {
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
  // const c1 = l1p2.y * l1p1.x - l1p2.x * l1p1.y;
  // const c2 = l2p2.y * l2p1.x - l2p2.x * l2p1.y;
  return { x: (b1 * c2 - b2 * c1) / d, y: (a2 * c1 - a1 * c2) / d }
}

// --------------------------------------------------------
// полярные координаты точки
// t1, t2 координаты отрезка
// t3 - координаты точка
// возвращаем угол между лучами (t1,t2) и (t1,t3) и длину отрезка (t1,t3)
function coordinatesToAngle (t1, t2, t3) {
  const beamLength = Math.sqrt((t1.x - t3.x) * (t1.x - t3.x) + (t1.y - t3.y) * (t1.y - t3.y))
  const angle = anglePoint(t1, t2, t3)
  return { angle, beamLength }
}

// eslint-disable-next-line no-unused-vars
export function coordinatesToPolar (t1, t2, t3) {
  const beamLength = Math.sqrt((t1.x - t3.x) * (t1.x - t3.x) + (t1.y - t3.y) * (t1.y - t3.y))
  const angle = Math.atan2((t3.y - t1.y) * (t2.x - t1.x) - (t2.y - t1.y) * (t3.x - t1.x),
    (t3.x - t1.x) * (t2.x - t1.x) + (t3.y - t1.y) * (t2.y - t1.y))
  return { angle, beamLength }
}

export function angle3Points (t1, t2, t3) {
  return Math.atan2((t3.y - t1.y) * (t2.x - t1.x) - (t2.y - t1.y) * (t3.x - t1.x),
    (t3.x - t1.x) * (t2.x - t1.x) + (t3.y - t1.y) * (t2.y - t1.y))
}

function angle4Points (t1, t2, t3, t4) {
  // return Math.atan2((t1.y - t2.y) * (t4.x - t3.x) - (t3.y - t4.y) * (t2.x - t1.x),
  //   (t2.x - t1.x) * (t4.x - t3.x) + (t1.y - t2.y) * (t3.y - t3.y))
  const l1 = straight(t1, t2)
  const l2 = straight(t3, t4)
  return Math.atan2((l1.A * l2.B - l2.A * l1.B), (l1.A * l2.A + l1.B * l2.B))
}
// eslint-disable-next-line no-unused-vars
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
  // пересечение перпендикулярных прямых
  // const intersection={x: -(C1*A1+C2*B1)/(B1*B1+A1*A1), y: (A1*C2-B1*C1)/(B1*B1+A1*A1)};
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
    y: (A1 * line.C - line.A * C1) / (B1 * line.A - line.B * A1)
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

// -----------------------------------------------------------------------------------------
// Расчет угла между отрезками P1P2 P1P3
function anglePoint (p1, p2, p3) {
  const m1 = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y))
  const m2 = Math.sqrt((p3.x - p1.x) * (p3.x - p1.x) + (p3.y - p1.y) * (p3.y - p1.y))
  const sm = (p2.x - p1.x) * (p3.x - p1.x) + (p2.y - p1.y) * (p3.y - p1.y)
  return Math.acos(sm / (m1 * m2))
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
  // const ugol = angleLineToOX(t[0], t[2])
  // const ugol2 = angleLineToOX(t[2], t[0])
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
    // angleR = angleLineToOX(t[0], t[1])
    return [ t[1], t[1] ]
  }
  // console.log(deg(ugol), deg(ugol2), deg(angleR), deg(angleL))
  // eslint-disable-next-line no-unused-vars
  // приводим длину вектора к растоянию между точками апроксимации
  // eslint-disable-next-line prefer-const
  const ktR = { x: t[1].x + dlinaR * Math.cos(angleR), y: t[1].y + dlinaR * Math.sin(angleR) }
  const ktL = { x: t[1].x - dlinaL * Math.cos(angleR), y: t[1].y - dlinaL * Math.sin(angleR) }
  // if (position < 0) {
  //   // контрольная точка для начала линии (t0 и t1 совпадают)
  //   ktL = t[1]
  // } else if (position > 0) {
  //   // контрольная точка для конца линии (t1 и t2 совпадают)
  //   ktR = t[1]
  //   ktL = t[1]
  // }
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
  // const line = straight(pointL, pointR)
  // const distan = distance(point, line)
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
  if (dataPt.length < 3) return null
  let minLength = 0
  if (isDef(equally)) {
    minLength = lengthLine(dataPt[1], dataPt[2])
    for (let i = 2; i < dataPt.length - 1; i++) {
      if (minLength > lengthLine(dataPt[i], dataPt[i + 1])) {
        minLength = lengthLine(dataPt[i], dataPt[i + 1])
      }
    }
  }
  // [ ktL, ktR ] = referencePoints([ dataPt[0], dataPt[0], dataPt[1] ], minLength)
  // mKtBezier.push({ ktL, ktR })
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
    // console.log('Intersec ', {e}, bz1, bz2)
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
  if (pt.length < 1) return null
  const mKtBezier = qalqControlPoints(pt, equally)
  const mpt = pt.slice(1) // убираем первую точку(задание стартового направления)
  const indEnd = mpt.length - 1
  const mPolyBezSideL = [] // масив тел полилиний
  const mPolyBezSideP = [] // масив тел полилиний
  let outlineOffsetL, outlineOffsetP
  // const mpt = pt.slice(1)
  for (let i = 1; i <= indEnd; i++) {
    const PolyBez = new Bezier(mpt[i - 1].x, mpt[i - 1].y, mKtBezier[i - 1].ktR.x, mKtBezier[i - 1].ktR.y,
      mKtBezier[i].ktL.x, mKtBezier[i].ktL.y, mpt[i].x, mpt[i].y)
    try {
      outlineOffsetL = PolyBez.offset(-Math.max(widthL, 5))
      outlineOffsetP = PolyBez.offset(Math.max(widthL, 5))
    } catch (e) {
      // console.log('error constructing the body of the curve Bez ', PolyBez.points, e)
      continue
    }
    mPolyBezSideP.push({
      sectionBez: (outlineOffsetP.map((elm) => elm.points))
    })
    mPolyBezSideL.push({
      sectionBez: (outlineOffsetL.map((elm) => elm.points))
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
      `M ${p[0].x} ${p[0].y} C ${p[1].x} ${p[1].y}  ${p[2].x}  ${p[2].y}  ${p[3].x}  ${p[3].y} `)
    )
  }
  return pathCurve
}
// ----------------------------------------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
function buildingDotted (result, points) {
  if (points.length < 4) return ''
  const pointN = points[points.length - 1]
  const [ pointR, pointBase ] = pointReflected(pointN, points[0], points[1])
  const lengthStreych = lengthLine(points[points.length - 1], pointR) / 8
  // eslint-disable-next-line max-len
  const pointO = increaseSection(pointBase, points[0], lengthStreych / Math.tan(angle3Points(points[0], pointBase, pointN)))
  const pointDottedL = increaseSection(pointBase, pointN, lengthStreych)
  const pointDottedR = increaseSection(pointBase, pointR, lengthStreych)
  const mLine = [ pointDottedL, pointO, pointDottedR ]
  drawDotted(result, mLine)
}
// ----------------------------------------------------------------------------------------------
// пунктир по точкам
// eslint-disable-next-line no-unused-vars
function drawDotted (result, points) {
  if (points.length < 2) return ''
  const color = result.layer._path.getAttribute('stroke')
  const width = result.layer._path.getAttribute('stroke-width')
  const pathDotted = 'M' + points.map((el) => `${el.x} ${el.y}`).join('L')
  let dash = '20,12'
  // по длине первого отрезка выбираем шаг пунктира
  const ls = lengthLine(points[0], points[1]) / 10
  if (ls > 10) {
    dash = `${ls * 2}, ${ls}`
  }
  result.amplifiers += `<path fill="transparent" stroke="${color}" stroke-width="${width}" stroke-dasharray="${dash}" d="${pathDotted}" />`
}
// -------------------------------------------------
// eslint-disable-next-line no-unused-vars
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
// eslint-disable-next-line no-unused-vars
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
        // mLine[0].p2 = mLine[1].p1
        // console.log("Подоезаем", mLine[i], deg(angle1), deg(angle2))
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
        // console.log(i, mLine[i])
        mLine[i].p2 = pIntersec.points[0]
        mNewLine.push({ p1: mLine[i].p1, p2: mLine[i].p2, typeLine: 'line' })
        mLine[i + 1].p1 = pIntersec.points[0]
      }
    } else { // нет пересечения, соединяем
      // if (i === 0) { console.log('До ', mLine[0]) }
      let bind = bindType
      if (bindType === 'miter') {
        // Срез определяется по углу пересечения
        // const angle = angleLine(mLine[i].p1, mLine[i].p2, mLine[i + 1].p1, mLine[i + 1].p2)
        const angle2 = Math.abs(angle4Points(mLine[i].p2, mLine[i].p1, mLine[i + 1].p1, mLine[i + 1].p2))
        // console.log(i, deg(angle), deg(angle2))
        if (angle2 > Math.PI / 2) {
          // угол тупой - дотягиваем линии до пересечения
          bind = 'arcs'
        } else {
          // удлиняем линии чтобы соединяющая линии была дальше ширины линии
          bind = 'bevel'
          // const increase = widthL * Math.tan(angle / 4)
          const increase = widthL * Math.tan((Math.PI - angle2) / 4)
          // console.log(i, deg(angle), deg(angle2), increase)
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
      // if (i === 0) { console.log('После ', mLine[0]) }
    }
  }
  if (mLine.length > 0) {
    mNewLine.push({ p1: mLine[mLine.length - 1].p1, p2: mLine[mLine.length - 1].p2, typeLine: 'line' })
  }
  return mNewLine
}
// -------------------------------------------------------------------------------------------------------
// блискавка
// eslint-disable-next-line no-unused-vars
function drawLightning (result, pN, pK) {
  const lengthL = lengthLine(pN, pK)
  const lengthZ = lengthL / 10
  const dx = pN.x - pK.x
  const dy = pN.y - pK.y
  const angle = Math.atan2(dy, dx) - Math.PI / 4
  const pC = {
    x: pN.x - dx / 2,
    y: pN.y - dy / 2
  }
  const p1 = {
    x: pC.x - Math.cos(angle) * lengthZ,
    y: pC.y - Math.sin(angle) * lengthZ
  }
  const p2 = {
    x: pC.x + Math.cos(angle) * lengthZ,
    y: pC.y + Math.sin(angle) * lengthZ
  }
  const angleA = Math.atan2(p2.y - pK.y, p2.x - pK.x)
  const pA1 = {
    x: pK.x + Math.cos(angleA - Math.PI / 18) * lengthL / 5,
    y: pK.y + Math.sin(angleA - Math.PI / 18) * lengthL / 5
  }

  const pA2 = {
    x: pK.x + Math.cos(angleA + Math.PI / 18) * lengthL / 5,
    y: pK.y + Math.sin(angleA + Math.PI / 18) * lengthL / 5
  }
  // console.log(pC, dx, dy, p1, p2, lengthZ)
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
// eslint-disable-next-line no-unused-vars
function drawWires (result, pN, pK) {
  const lengthL = lengthLine(pN, pK)
  const radius = lengthL / 4
  const lengthK = lengthL / 5
  const dx = pN.x - pK.x
  const dy = pN.y - pK.y
  const da = radius - Math.sqrt(radius * radius - lengthK * lengthK)
  const pA1 = {
    x: pK.x - lengthK,
    y: pK.y + da
  }
  const pA2 = {
    x: pK.x + lengthK,
    y: pK.y + da
  }
  drawArc(result, pA1, pA2, radius, 0, 0, 1)
  const pC = {
    x: pN.x - dx / 2,
    y: pN.y - dy / 2
  }
  const pK1 = {
    x: pC.x - lengthK,
    y: pC.y - lengthK
  }
  const pK2 = {
    x: pC.x + lengthK,
    y: pC.y + lengthK
  }
  drawBezier(result, pN, pK1, pK2, pK)
}
