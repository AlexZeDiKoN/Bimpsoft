import Bezier from 'bezier-js'
import { Symbol } from '@DZVIN/milsymbol'
import { rotate, applyToPoint } from 'transformation-matrix'
import {
  normalVectorTo, segmentLength, setVectorLength, applyVector, segmentBy, getVector, findNearest, halfPlane,
  angleOf, oppositeVector, drawBezierSpline, getPointAt, neg,
} from './utils'
import {
  shiftPoints, lengthLine, coordinatesToPolar, polarToCoordinates,
} from './arrowLib'

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

// Загальні стратегії взаємних залежностей розташування контрольних точок тактичного знаку
export const STRATEGY = {
  // Довільне розташування усіх точок
  empty: () => {},

  // Форма літери "T" (відрізок між двома точками, третя точка на кінці серединного перпендикуляру)
  shapeT: (factor = 0.5) => (prevPoints, nextPoints, changed) => {
    nextPoints[2] = applyVector(
      segmentBy(nextPoints[0], nextPoints[1], factor),
      adjustedNorm(prevPoints, nextPoints, changed)
    )
  },

  // Форма кута 120 градусів
  shape120: (prevPoints, nextPoints, changed) => {
    nextPoints[0] = getPointAt(
      nextPoints[2],
      nextPoints[1],
      neg(halfPlane(nextPoints[2], nextPoints[1], nextPoints[0])) * Math.PI / 3,
      changed.includes(1) ? segmentLength(prevPoints[0], prevPoints[1]) : segmentLength(nextPoints[0], nextPoints[1])
    )
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
      adjustedNorm(prevPoints, nextPoints, changed, [ 2, 1, 0, 3 ])
    )
    nextPoints[3] = applyVector(
      nextPoints[2],
      adjustedNorm(prevPoints, nextPoints, changed, [ 1, 2, 3, 0 ]),
    )
  },

  // перестроювання секторів
  // перша, друга точки - напрямок секторів
  // наступні пари точок завдають лівий та првий розмах сектора
  shapeSector: (prevPoints, nextPoints, changed) => {
    const p0 = prevPoints[0]
    const p1 = prevPoints[1]
    const pN0 = nextPoints[0]
    const pN1 = nextPoints[1]
    const indChanged = changed[0] ?? 0
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
    const indChanged = changed[0]
    if (!changed[0]) { // змінюємо опорну
      // зміщуємо усе
      const dP = { x: nextPoints[0].x - prevPoints[0].x, y: nextPoints[0].y - prevPoints[0].y }
      const newPoints = shiftPoints(dP, prevPoints)
      newPoints.forEach((elm, ind) => (nextPoints[ind] = elm))
    } else {
      // змінюємо радіус сектора
      const lengthChanged = lengthLine(pN0, nextPoints[indChanged])
      const lBootom = lengthLine(pN0, nextPoints[indChanged - 1])
      let lTop = Infinity
      if (indChanged < nextPoints.length - 1) lTop = lengthLine(pN0, nextPoints[indChanged + 1])
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
  area: (index1, index2, count, layer) =>
    layer._map.layerPointToLatLng(middlePointBezier(layer._rings[0], index1, index2 % count)),

  // Область з кількома ампліфікаторми (ампліфікатори в кінці списку)
  areaWithAmplifiers: (amplCount) =>
    (index1, index2, count, layer) => count - index2 >= amplCount
      ? layer._map.layerPointToLatLng(middlePointBezier(layer._rings[0], index1, index2 % (count - amplCount)))
      : false,

  // Область з кількома ампліфікаторми (ампліфікатори на початку списку) та крім останього
  areaWithAmplifiersNotEnd: (amplCount) =>
    (index1, index2, total) => index1 >= amplCount - 1 && index2 < total - 1,

  // Лінія з кількома ампліфікаторми (ампліфікатори в кінці списку)
  lineWithAmplifiers: (amplCount) =>
    (index1, index2, total) => total - index2 > amplCount,
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

  // Вилучення точки дозволене за умови, що її індекс більший вказаної мінілмальної кількості точок та не останній
  allowNotEnd: (amount) =>
    (index, total) => (index >= amount) && (index < (total - 1)),
}

export const RENDER = {
  // Заштрихована область з плавною границею, всередині точковий знак
  hatchedAreaWihSymbol: (code, size, hatchingColor = 'yellow', hatchingWidth = 3, hatchingStep = 20) =>
    (result, points, scale) => {
      const sign = points[points.length - 1]
      const area = points.slice(0, -1)

      drawBezierSpline(result, area, true)

      const hf = 'url(\'#hatching\')'
      result.layer._path.setAttribute('fill', hf)
      result.layer._path.setAttribute('width', 100)
      result.layer.options.fillColor = hf
      result.amplifiers += ` 
        <pattern id="hatching" x="0" y="0" width="${hatchingStep}" height="${hatchingStep}" patternUnits="userSpaceOnUse">
          <line x1="${hatchingStep}" y1="0" x2="0" y2="${hatchingStep}" stroke="${hatchingColor}" stroke-width="${hatchingWidth}" />
        </pattern>`

      const symbol = new Symbol(code, { size: size * scale }).asSVG()
      const d = size * scale / 2
      result.amplifiers += `<g transform="translate(${sign.x - d * 1.57}, ${sign.y - d * 0.95})">${symbol}</g>`
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
  }
}