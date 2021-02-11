import Bezier from 'bezier-js'
import { Symbol } from '@C4/milsymbol'
import { rotate, applyToPoint } from 'transformation-matrix'
import { Earth } from 'leaflet/src/geo/crs/CRS.Earth'
import { settings } from '../../../../constants/drawLines'
import {
  distanceAzimuth,
  moveCoordinate,
  sphereDirect,
  alignmentAngle,
  angleBetweenPoints,
} from '../utils/sectors'
import {
  normalVectorTo, segmentLength, setVectorLength, applyVector, segmentBy, getVector, findNearest, halfPlane,
  angleOf, oppositeVector, drawBezierSpline, getPointAt, neg, getPointSize,
  shiftPoints,
  lengthLine,
  coordinatesToPolar,
  polarToCoordinates,
  pointIntersecSegments,
  referencePoint,
} from './utils'

export const MIN_LINE_POINTS = 2
export const MIN_AREA_POINTS = 3

const adjustedNorm = (prevPoints, nextPoints, changed, order = [ 0, 1, 2 ]) => {
  let len
  if (!changed.includes(order[2])) {
    len = segmentLength(normalVectorTo(prevPoints[order[0]], prevPoints[order[1]], prevPoints[order[2]]))
    if (order[3] !== undefined) {
      const hp1 = halfPlane(prevPoints[order[0]], prevPoints[order[1]], prevPoints[order[2]])
      const hp2 = halfPlane(prevPoints[order[0]], prevPoints[order[1]], prevPoints[order[3]])
      if (hp1 !== hp2) {
        len = -len
      }
    }
  }

  let norm = normalVectorTo(nextPoints[order[0]], nextPoints[order[1]], nextPoints[order[2]])

  if (len !== undefined) {
    norm = setVectorLength(norm, len)
  }

  return norm
}

const middlePointBezier = (array, index1, index2, factor = 0.5) => {
  const p1 = array[index1]
  const p2 = array[index2]
  const spline = new Bezier(p1.x, p1.y, p1.cp2.x, p1.cp2.y, p2.cp1.x, p2.cp1.y, p2.x, p2.y)
  return spline.get(factor)
}

// стратегия перемещения опорных точек для символов 151401 - 151406
export const STRATEGY_ARROW = {
  // Довільне розташування усіх точок
  empty: () => {
  },
  // Проверка взаиморасположения точек PT 1, PT 2, PT N (определяют длину и ширину стрелки)
  supportingAttack: (prevPoints, nextPoints, changed) => {
    if (prevPoints.length === nextPoints.length && changed.length === 1) { // кол-во точек совпадает и перетаскиваем одну точку
      const indEnd = prevPoints.length - 1
      // опорных точек должно быть минимум 4 (мне хотябы 3), обрабатываем изменение одной точки
      if (((changed[0] === indEnd || changed[0] < 2) && indEnd > 1)) { // Обрабатываем изменения контрольных точек головы стрелки
        const referencePT = { x: nextPoints[indEnd].x, y: nextPoints[indEnd].y }
        const polarPoint = coordinatesToPolar(prevPoints[0], prevPoints[1], referencePT)
        if (polarPoint.angle < 0) {
          polarPoint.angle = -polarPoint.angle
        }
        const coordinates = referencePoint(nextPoints[0], nextPoints[1], polarPoint.angle, polarPoint.beamLength)
        nextPoints[indEnd] = { x: coordinates.x, y: coordinates.y }
      }
    }
  },
}

// Загальні стратегії взаємних залежностей розташування контрольних точок тактичного знаку
export const STRATEGY = {
  // Довільне розташування усіх точок
  empty: () => {},

  // Форма літери "T" (відрізок між двома точками, третя точка на кінці серединного перпендикуляру)
  shapeT: (factor = 0.5) => (prevPoints, nextPoints, changed) => {
    nextPoints[2] = applyVector(
      segmentBy(nextPoints[0], nextPoints[1], factor),
      adjustedNorm(prevPoints, nextPoints, changed))
  },

  // Форма кута 120 градусів
  shape120: (prevPoints, nextPoints, changed) => {
    nextPoints[0] = getPointAt(
      nextPoints[2],
      nextPoints[1],
      neg(halfPlane(nextPoints[2], nextPoints[1], nextPoints[0])) * Math.PI / 3,
      changed.includes(1) ? segmentLength(prevPoints[0], prevPoints[1]) : segmentLength(nextPoints[0], nextPoints[1]))
  },

  // Форма літери "L" (відрізок між двома точками, третя точка на кінці перпендикуляру від другої точки)
  shapeL: (prevPoints, nextPoints, changed) => {
    nextPoints[2] = applyVector(
      nextPoints[1],
      adjustedNorm(prevPoints, nextPoints, changed),
    )
  },

  // Остання точка "приклеюється" до найближчої (окрім передостанньої)
  snapNearest1: (prevPoints, nextPoints, changed) => {
    const count = prevPoints.length
    if (!changed.includes(count - 1)) {
      const nearest = findNearest(prevPoints[count - 1], prevPoints.slice(0, -2))
      nextPoints[count - 1] = applyVector(
        nextPoints[nearest],
        getVector(prevPoints[nearest], prevPoints[count - 1]),
      )
    }
  },

  // Форма літери "U" (відрізок між двома точками, третя точка на кінці перпендикуляру від другої точки,
  // а четверта - на кінці перпендикуляру від третьої точки)
  shapeU: (prevPoints, nextPoints, changed) => {
    nextPoints[0] = applyVector(
      nextPoints[1],
      adjustedNorm(prevPoints, nextPoints, changed, [ 2, 1, 0, 3 ]),
    )
    nextPoints[3] = applyVector(
      nextPoints[2],
      adjustedNorm(prevPoints, nextPoints, changed, [ 1, 2, 3, 0 ]),
    )
  },

  // перестроювання секторів
  // перша, друга точки - напрямок секторів
  // наступні пари точок завдають лівий та првий розмах сектора
  shapeSectorLL: (prevPoints, nextPoints, changedP) => {
    const p0 = prevPoints[0]
    const p1 = prevPoints[1]
    const pN0 = nextPoints[0]
    const pN1 = nextPoints[1]
    let indChanged
    // const distance = (p1, p2) => window.webMap.map.distance(p1, p2)
    if (prevPoints.length !== nextPoints.length) { // перестройка всей фигуры
      // TODO нужно проверить всю структуру и исправить
      const minDistance = Earth.distance(pN0, nextPoints[nextPoints.length - 2]) * 1.15
      const p1DA = distanceAzimuth(pN0, pN1)
      if (minDistance > p1DA.distance) {
        p1DA.distance = minDistance
        nextPoints[1] = moveCoordinate(pN0, p1DA)
      }
      return
    }
    if (Array.isArray(changedP)) { // запрос с карты
      if (changedP.length === 1) {
        indChanged = changedP[0] ?? 0
      } else { // или после формы или тащили весь объект
        return
      }
    } else { // запрос из формы
      indChanged = changedP ?? 0
    }
    switch (indChanged) {
      case 0: { // сдвигаем все точки
        const dLng = p0.lng - pN0.lng
        const dLat = p0.lat - pN0.lat
        prevPoints.forEach((elm, i) => {
          nextPoints[i].lat = elm.lat - dLat
          nextPoints[i].lng = elm.lng - dLng
        })
        break
      }
      case 1: { // поворачиваем фигуру по азимуту
        const dAngle = distanceAzimuth(p0, p1).angledeg - distanceAzimuth(p0, pN1).angledeg
        nextPoints[0] = prevPoints[0]
        for (let i = 2; i < prevPoints.length; i += 2) {
          const da1 = distanceAzimuth(p0, prevPoints[i])
          const da2 = distanceAzimuth(p0, prevPoints[i + 1])
          // приведение угла к 0 - 360
          da1.angledeg = alignmentAngle(da1.angledeg, dAngle)
          nextPoints[i] = moveCoordinate(pN0, da1)
          da1.angledeg = alignmentAngle(da2.angledeg, dAngle)
          nextPoints[i + 1] = moveCoordinate(pN0, da1)
        }
        // длины стрелки должна быть больше длина последнего сектора
        const minDistance = Earth.distance(pN0, nextPoints[nextPoints.length - 1]) * 1.15
        const p1DA = distanceAzimuth(pN0, pN1)
        if (minDistance > p1DA.distance) {
          p1DA.distance = minDistance
          nextPoints[1] = moveCoordinate(pN0, p1DA)
        }
        break
      }
      default: { // сектор по азимуту
        // изменяем сектор
        const indCouple = indChanged + 1 - (indChanged % 2) * 2 // индекс парной точки сектора
        let azimuthChanged = distanceAzimuth(pN0, nextPoints[indChanged]).angleRad
        let azimuthCouple = distanceAzimuth(pN0, nextPoints[indCouple]).angleRad
        if (Math.abs(azimuthChanged - azimuthCouple) > Math.PI) {
          azimuthChanged = azimuthChanged < 0 ? azimuthChanged + Math.PI : azimuthChanged - Math.PI
          azimuthCouple = azimuthCouple < 0 ? azimuthCouple + Math.PI : azimuthCouple - Math.PI
        }
        const AngleP1Change = angleBetweenPoints(pN0, pN1, nextPoints[indChanged])
        // блокировка по левая <-> правая и по максимальному углу
        if (AngleP1Change >= Math.PI / 2 ||
            ((indChanged < indCouple) ? -1 : 1) * (azimuthChanged - azimuthCouple) < 0.02) {
          nextPoints[indChanged] = prevPoints[indChanged]
          break
        }
        let tTop = pN1
        const minGapBottom = Earth.distance(pN0, pN1) * 0.05 // расстояние до нижестоящего сектора 5%
        let minGapTop = minGapBottom * 3 // расстояние до стрелки 15%
        if ((indChanged + 2) < nextPoints.length) {
          // не последний сектор
          tTop = nextPoints[indChanged + 2]
          minGapTop = minGapBottom // расстояние до вышестоящего сектора 5%
        }
        const heightNextSector = Earth.distance(pN0, tTop)
        let tBottom = pN0
        if (indChanged > 3) {
          tBottom = nextPoints[indChanged - 2]
        }
        const pChanged = distanceAzimuth(pN0, nextPoints[indChanged])
        const pCouple = distanceAzimuth(pN0, nextPoints[indCouple])
        const heightPrevSector = Earth.distance(pN0, tBottom)
        // радиус сектора должна быть меньше радиуса следующего сектора и больше радиуса предыдущего на 5%
        if (heightNextSector < pChanged.distance + minGapTop || pChanged.distance < heightPrevSector + minGapBottom) {
          // изменяем угол и оставляем высоту
          pChanged.distance = Earth.distance(p0, prevPoints[indChanged])
          nextPoints[indChanged] = moveCoordinate(pN0, pChanged)
          break
        }
        // выравниваем радиусы
        pCouple.distance = pChanged.distance
        nextPoints[indCouple] = moveCoordinate(pN0, pCouple)
      }
    }
  },

  shapeSector: (prevPoints, nextPoints, changed) => {
    const p0 = prevPoints[0]
    const p1 = prevPoints[1]
    const pN0 = nextPoints[0]
    const pN1 = nextPoints[1]
    let indChanged
    if (changed.length === 1) { // изменили одну точку
      indChanged = changed[0] ?? 0
    } else if (changed.length === nextPoints.length) { // изменения всего объекта (или перетянули весь или повернули в форме)
      indChanged = 0
    } else { // изменяем фигуру по первой изменненой точке
      indChanged = changed[0]
    }
    if (indChanged === 0) { // змінюємо опорну
      // зміщуємо усе
      const dP = { x: nextPoints[0].x - prevPoints[0].x, y: nextPoints[0].y - prevPoints[0].y }
      const newPoints = shiftPoints(dP, prevPoints)
      newPoints.forEach((elm, ind) => (nextPoints[ind] = elm))
    } else if (indChanged === 1) { // змінюємо азимут
      // длина последнего сектора должна быть меньше длины стрелки на 15% (сам придумал)
      if (lengthLine(pN0, pN1) * 0.85 < lengthLine(nextPoints[nextPoints.length - 1], pN0)) {
        // поворачивае по углу, длину оставляем минимально допустимую
        const newPointPolar = coordinatesToPolar(p0, p1, pN1)
        newPointPolar.beamLength = lengthLine(p0, p1)
        nextPoints[indChanged] = polarToCoordinates(p0, p1, newPointPolar)
        // return
      }
      // перемещаем сектора за стрелкой
      for (let i = 2; i < prevPoints.length; i += 2) {
        const pL = coordinatesToPolar(p0, p1, nextPoints[i])
        const pR = coordinatesToPolar(p0, p1, nextPoints[i + 1])
        const lengthAverage = (pL.beamLength + pR.beamLength) / 2
        pL.beamLength = lengthAverage
        pR.beamLength = lengthAverage
        nextPoints[i] = polarToCoordinates(pN0, pN1, pL)
        nextPoints[i + 1] = polarToCoordinates(pN0, pN1, pR)
      }
    } else {
      // изменяем сектор
      const indCouple = indChanged + 1 - (indChanged % 2) * 2 // индекс парной точки сектора
      const pChanged = coordinatesToPolar(pN0, pN1, nextPoints[indChanged])
      const pCouple = coordinatesToPolar(pN0, pN1, nextPoints[indCouple])
      // блокировка по левая <-> правая и по максимальному углу
      // eslint-disable-next-line max-len
      if (((indChanged < indCouple) ? -1 : 1) * (pChanged.angle - pCouple.angle) < 0.05 ||
        Math.abs(pChanged.angle) >= Math.PI / 2) {
        nextPoints[indChanged] = prevPoints[indChanged]
        return
      }
      let tTop = pN1
      const minGapBottom = lengthLine(pN0, pN1) * 0.05 // расстояние до нижестоящего сектора 5%
      let minGapTop = minGapBottom * 3 // расстояние до стрелки 15%
      if ((indChanged + 2) < nextPoints.length) {
        // не последний сектор
        tTop = nextPoints[indChanged + 2]
        minGapTop = minGapBottom // расстояние до вышестоящего сектора 5%
      }
      const lengthNextSector = lengthLine(pN0, tTop)
      let tBottom = pN0
      if (indChanged > 3) {
        tBottom = nextPoints[indChanged - 2]
      }
      const lengthPrevSector = lengthLine(pN0, tBottom)
      // радиус сектора должна быть меньше радиуса следующего сектора и больше радиуса предыдущего на 5% (сам придумал)
      if (lengthNextSector < pChanged.beamLength + minGapTop || pChanged.beamLength < lengthPrevSector + minGapBottom) {
        // изменяем угол и оставляем высоту
        const pP = coordinatesToPolar(p0, p1, prevPoints[indChanged])
        pChanged.beamLength = pP.beamLength
        nextPoints[indChanged] = polarToCoordinates(pN0, pN1, pChanged)
        return
      }
      // выравниваем радиусы
      pCouple.beamLength = pChanged.beamLength
      nextPoints[indCouple] = polarToCoordinates(p0, p1, pCouple)
    }
  },

  // перестроювання кругових секторів
  // перша - центр кола
  // наступні точки задають радіус секторів з зовні до середини
  // alignment - прив'язка контрольних точок до горізогнталі або вертикалі
  shapeCircleInvert: (alignment = 'none') => (prevPoints, nextPoints, changed) => {
    const pPoints = [ prevPoints[0], ...prevPoints.slice(1).reverse() ]
    const nPoints = [ nextPoints[0], ...nextPoints.slice(1).reverse() ]
    const maxInd = nextPoints.length
    let changedI = [ 0 ]
    if (changed[0] !== 0) { changedI = [ maxInd - changed[0] ] }
    STRATEGY.shapeCircle(alignment)(pPoints, nPoints, changedI)
    nPoints.forEach((elm, ind) => {
      if (ind === 0) {
        nextPoints[0] = elm
      } else {
        nextPoints[maxInd - ind] = elm
      }
    })
  },

  // перестроювання кругових секторів
  // перша - центр кола
  // наступні точки задають радіус секторів
  // alignment - прив'язка контрольних точок до горізогнталі або вертикалі
  shapeCircle: (alignment = 'none') => (prevPoints, nextPoints, changed) => {
    const pN0 = nextPoints[0]
    const indChanged = changed[0] // зміщуемо тільки одну точку, або увесь об'єкт
    if (indChanged === 0) { // зміщена опорна
      // зміщуємо усе
      const dP = { x: nextPoints[0].x - prevPoints[0].x, y: nextPoints[0].y - prevPoints[0].y }
      const newPoints = shiftPoints(dP, prevPoints)
      newPoints.forEach((elm, ind) => (nextPoints[ind] = elm))
    } else {
      // змінюємо радіус сектора
      const lengthChanged = lengthLine(pN0, nextPoints[indChanged])
      const lBootom = lengthLine(pN0, nextPoints[indChanged - 1])
      let lTop = Infinity
      if (indChanged < nextPoints.length - 1) {
        lTop = lengthLine(pN0, nextPoints[indChanged + 1])
      }
      // радіус сектора повинен бути більше попереднього і менше наступного сектора
      if (lengthChanged <= lBootom + 1 || (lengthChanged >= lTop - 1)) {
        nextPoints[indChanged] = prevPoints[indChanged]
      } else { // радіус відповідає вимогам
        if (alignment === 'left' || alignment === 'right') { // вирівнюємо опорні точки по горизонталі
          nextPoints[indChanged].x = pN0.x + lengthLine(pN0, nextPoints[indChanged]) * (alignment === 'left' ? -1 : 1)
          nextPoints[indChanged].y = pN0.y
        } else if (alignment === 'top' || alignment === 'bottom') { // вирівнюємо опорні точки по вертикалі
          nextPoints[indChanged].y = pN0.y + lengthLine(pN0, nextPoints[indChanged]) * (alignment === 'top' ? -1 : 1)
          nextPoints[indChanged].x = pN0.x
        }
      }
    }
  },

  shapeCircleLL: (alignment = 'none') => (prevPoints, nextPoints, changed) => {
    const pN0 = nextPoints[0]
    const indChanged = changed[0] // зміщуемо тільки одну точку, або увесь об'єкт
    if (!Number.isFinite(indChanged)) {
      return
    }
    const dLng = prevPoints[0].lng - nextPoints[0].lng
    const dLat = prevPoints[0].lat - nextPoints[0].lat
    if (indChanged === 0) { // зміщена опорна
      // зміщуємо усе
      switch (alignment) {
        case 'left':
        case 'right':
          for (let i = 1; i < nextPoints.length; i++) {
            nextPoints[i].lat = nextPoints[0].lat
            nextPoints[i].lng = prevPoints[i].lng - dLng
          }
          break
        case 'top':
        case 'bottom':
          for (let i = 1; i < nextPoints.length; i++) {
            nextPoints[i].lat = prevPoints[i].lat - dLat
            nextPoints[i].lng = nextPoints[0].lng
          }
          break
        default:
          for (let i = 1; i < nextPoints.length; i++) {
            nextPoints[i].lat = prevPoints[i].lat - dLat
            nextPoints[i].lng = prevPoints[i].lng - dLng
          }
      }
    } else {
      // змінюємо радіус сектора
      const lengthChanged = Earth.distance(pN0, nextPoints[indChanged])
      const lBootom = Earth.distance(pN0, nextPoints[indChanged - 1])
      let lTop = Infinity
      if (indChanged < nextPoints.length - 1) {
        lTop = Earth.distance(pN0, nextPoints[indChanged + 1])
      }
      // радіус сектора повинен бути більше попереднього і менше наступного сектора
      if (lengthChanged <= lBootom + 1 || (lengthChanged >= lTop - 1)) {
        nextPoints[indChanged] = prevPoints[indChanged]
      } else { // радіус відповідає вимогам
        let newPoint
        switch (alignment) {
          case 'left':
            newPoint = sphereDirect(nextPoints[0], 270, lengthChanged)
            break
          case 'right':
            newPoint = sphereDirect(nextPoints[0], 90, lengthChanged)
            break
          case 'top':
            newPoint = sphereDirect(nextPoints[0], 0, lengthChanged)
            break
          case 'bottom':
            newPoint = sphereDirect(nextPoints[0], 180, lengthChanged)
            break
          default: return
        }
        nextPoints[indChanged].lat = newPoint.lat
        nextPoints[indChanged].lng = newPoint.lng
      }
    }
  },

  // Центральна точка рухає прямокутник, друга точка задає розміри, третя кут повороту
  shape7: (prevPoints, nextPoints, changed) => {
    if (changed.includes(0)) {
      const translation = getVector(prevPoints[0], nextPoints[0]);
      [ 1, 2 ].map((i) => (nextPoints[i] = applyVector(prevPoints[i], translation)))
    } else if (changed.includes(1)) {
      nextPoints[2] = applyVector(
        nextPoints[1],
        oppositeVector(normalVectorTo(prevPoints[0], prevPoints[2], nextPoints[1])),
      )
    } else if (changed.includes(2)) {
      const len = segmentLength(prevPoints[2], prevPoints[0])
      const angle = angleOf(nextPoints[2], prevPoints[0]) - angleOf(prevPoints[2], prevPoints[0])
      const vector = getVector(prevPoints[0], prevPoints[1])
      nextPoints[1] = applyVector(
        prevPoints[0],
        applyToPoint(rotate(angle), vector),
      )
      nextPoints[2] = applyVector(
        nextPoints[1],
        oppositeVector(normalVectorTo(prevPoints[0], applyVector(
          prevPoints[0],
          setVectorLength(getVector(prevPoints[0], nextPoints[2]), len),
        ), nextPoints[1])),
      )
    }
  },

  // Дві точки в одній
  onePointLine: (prevPoints, nextPoints, changed) => {
    if (changed.includes(1)) {
      nextPoints[0] = nextPoints[1]
    } else {
      nextPoints[1] = nextPoints[0]
    }
  },

  // Остання точка в масиві визначає ширину лінії, знаходится на серединному перпендикулярі між першою і другою точками
  lineWithRegulatedWidth: (shaper) => {
    const slicer = (arr) => [ arr[0], arr[1], arr[arr.length - 1] ]
    return (prevPoints, nextPoints, changed) => {
      const slice = slicer(nextPoints)
      let ch = changed[0]
      if (ch === nextPoints.length - 1) {
        ch = 2
      }
      shaper(slicer(prevPoints), slice, [ ch ])
      nextPoints[0] = slice[0]
      nextPoints[1] = slice[1]
      nextPoints[nextPoints.length - 1] = slice[2]
    }
  },

  // Відрізки не можуть перетинатися
  doNotOverlap: (successively = true) => (prevPoints, nextPoints, changed) => {
    if (nextPoints.length === 4 && prevPoints.length === 4) { // имеем 2 отрезка
      if (changed.length > 3) { // переносим весь объект
        return
      }
      const p = successively ? [ ...nextPoints ] : [ nextPoints[0], nextPoints[2], nextPoints[1], nextPoints[3] ]
      if (pointIntersecSegments(...p)) { // пересечение отрезков, возвращаем точки
        changed.forEach((ind) => { nextPoints[ind] = prevPoints[ind] })
      }
    }
  },
}

export const MIDDLE = {
  // Додавання нових точок не дозволене у будь-якому разі
  none: () => false,

  // Дозволено на будь-якому відрізку
  any: () => true,

  // Дозволено на відрізку, індекс якого більше або дорівнює вказаному
  allowOver: (amount) =>
    (index) => index >= amount,

  // Область
  area: (index1, index2, count, layer) => layer
    ? layer._map.layerPointToLatLng(middlePointBezier(layer._rings[0], index1, index2 % count))
    : true,

  // Область з кількома ампліфікаторми (ампліфікатори в кінці списку)
  areaWithAmplifiers: (amplCount) =>
    (index1, index2, count, layer) => count - index2 >= amplCount
      ? (
        layer
          ? layer._map.layerPointToLatLng(middlePointBezier(layer._rings[0], index1, index2 % (count - amplCount)))
          : true
      )
      : false,

  // дозволено додавання за точками з індексом більшим за startIndex за винятком останього відрізку
  allowOverAndNotEnd: (startIndex) =>
    (index1, index2, total) => index1 >= startIndex - 1 && index2 < total - 1,

  // Лінія з кількома ампліфікаторми (ампліфікатори в кінці списку)
  lineWithAmplifiers: (amplCount) =>
    (index1, index2, total) => total - index2 > amplCount,

  // Дозволено в кінець
  end: (index1, index2, total) => (index1 === total - 1) && (index2 === total),
}

export const DELETE = {
  // Вилучення точки не дозволене у будь-якому разі
  none: () => false,

  // Вилучення точки дозволене за умови, що її індекс більший вказаної мінілмальної кількості точок
  allowOver: (amount) =>
    (index) => index >= amount,

  // Лінія
  line: (index, count) => count > MIN_LINE_POINTS,

  // Область
  area: (index, count) => count > MIN_AREA_POINTS,

  // Область з кількома ампліфікаторми (ампліфікатори в кінці списку)
  areaWithAmplifiers: (amplCount) =>
    (index, count) => (count > MIN_AREA_POINTS + amplCount) && (index < count - amplCount),

  // Вилучення точки дозволене за умови, що
  // їх більше вказаної мінілмальної кількості точок,
  // її індекс не останній та не перший
  allowNotEnd: (amount) =>
    (index, total) => (total > amount) && ((index < (total - 1)) && (index > 0)),
}

export const RENDER = {
  // Заштрихована область з плавною границею, всередині точковий знак
  hatchedAreaWihSymbol: (code, sizeScale,
    hatchingColor = 'yellow', hatchingWidth = 3, hatchingStep = settings.CROSS_SIZE) =>
    (result, points) => {
      if (!Array.isArray(points) || points.length < 3) {
        return
      }
      const sign = points[points.length - 1]
      const area = points.slice(0, -1)

      drawBezierSpline(result, area, true)

      const hf = `url('#hatching${result.layer.id}')`
      const strokeWidth = result.layer._path.getAttribute('stroke-width')
      result.amplifiers += `
        <pattern id="hatching${result.layer.id}" x="${points[0].x}" y="${points[0].y}" width="${hatchingStep}" height="${hatchingStep}" patternUnits="userSpaceOnUse">
          <line stroke-linecap="butt" x1="${hatchingStep}" y1="0" x2="0" y2="${hatchingStep}" stroke="${hatchingColor}" stroke-width="${hatchingWidth}" />
        </pattern>
        <path fill="${hf}" fill-rule="nonzero" stroke-width="${0}" stroke-opacity="1" d="${result.d}"/>`
      const sizeSymbol = getPointSize(result.layer) // учтывается текущий масштаб карты
      const symbol = new Symbol(code, { size: sizeSymbol })
      result.amplifiers += `<g transform="translate(${sign.x - symbol.width / 2}, ${sign.y - symbol.height / 2})">${symbol.asSVG()}</g>`
      console.log('xbrj', strokeWidth)
    },
}

export const SEQUENCE = {
  // Область з кількома ампліфікаторми (ампліфікатори в кінці списку)
  areaWithAmplifiers: (amplCount) => (index, count) => {
    let prev = index - 1
    let next = index + 1
    if (prev < 0) {
      prev = count - amplCount - 1
    }
    if (next > count - amplCount - 1) {
      next = 0
    }
    return [ prev, next ]
  } }
