import Bezier from 'bezier-js'
import {
  normalVectorTo, segmentLength, setVectorLength, applyVector, segmentBy, getVector, findNearest, halfPlane,
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

// Загальні стратегії взаємних залежностей розташування контрольних точок тактичного знаку
export const STRATEGY = {
  // Довільне розташування усіх точок
  empty: () => {},

  // Форма літери "T" (відрізок між двома точками, третя точка на кінці серединного перпендикуляру)
  shapeT: (prevPoints, nextPoints, changed) => {
    nextPoints[2] = applyVector(
      segmentBy(nextPoints[0], nextPoints[1], 0.5),
      adjustedNorm(prevPoints, nextPoints, changed)
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
}

export const MIDDLE = {
  // Додавання нових точок не дозволене у будь-якому разі
  none: () => false,

  // Дозволено на будь-якому відрізку
  any: () => true,

  // Область з кількома ампліфікаторми (ампліфікатори в кінці списку)
  areaWithAmplifiers: (amplCount) => (index1, index2, count, layer) => count - index2 >= amplCount
    ? layer._map.layerPointToLatLng(middlePointBezier(layer._rings[0], index1, index2 % (count - amplCount)))
    : false,

  // Область з кількома ампліфікаторми (ампліфікатори на початку списку) та крім останього
  areaWithAmplifiersNotEnd: (amplCount) => (index1, index2, total) => index1 >= amplCount - 1 && index2 < total - 1,
}

export const DELETE = {
  // Вилучення точки не дозволене у будь-якому разі
  none: () => false,

  // Вилучення точки дозволене за умови, що її індекс більший вказаної мінілмальної кількості точок
  allowOver: (amount) => (index) => index >= amount,

  // Область з кількома ампліфікаторми (ампліфікатори в кінці списку)
  areaWithAmplifiers: (amplCount) => (index, count) => count > MIN_AREA_POINTS + amplCount && count - index > amplCount,
  // Вилучення точки дозволене за умови, що її індекс більший вказаної мінілмальної кількості точок та не останній
  allowNotEnd: (amount) => (index, total) => (index >= amount) && (index < (total - 1)),
}
