import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, normalVectorTo, segmentBy, drawArc, angleOf, segmentLength, getPointAt, calcFactor, ptEq, hasIntersection,
  drawText, textBBox, getStrokeWidth,
} from '../utils'
import { amps } from '../../../../../constants/symbols'
import { halfPI } from '../../../../../constants/utils'

// sign name: AIR CORRIDOR
// task code: DZVIN-5539
// hint: 'Коридор прольоту авіації через зону вогню військової частини ЗРВ'

const LARGE_TEXT_SIZE = 1.5
const SMALL_TEXT_SIZE = 0.67
const INTERLINE = 1.2

lineDefinitions['170100'] = {
  // Ампліфікатори лінії
  useAmplifiers: [ { id: amps.T, name: 'T', maxRows: 1 }, { id: amps.A, name: 'N', maxRows: 6 } ],
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.lineWithAmplifiers(1),

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.allowNotEnd(3),

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.lineWithRegulatedWidth(STRATEGY.shapeT()),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.25, y: 0.50 },
    { x: 0.75, y: 0.50 },
    { x: 0.50, y: 0.45 },
  ],

  // Рендер-функція
  render: (result, points, _, toPrint) => {
    const sw = segmentLength(normalVectorTo(points[0], points[1], points[points.length - 1]))

    const calcSegmentPoints = (index, side) => {
      const p1 = getPointAt(points[index], points[index + 1], side * halfPI, sw)
      const p2 = getPointAt(points[index + 1], points[index], -side * halfPI, sw)
      return [ p1, p2 ]
    }

    const adjustSegmentPoints = (index, side) => {
      let [ p1, p2 ] = calcSegmentPoints(index, side)
      let i = index - 1
      while (i >= 0) {
        const [ l1, l2 ] = calcSegmentPoints(i, side)
        const [ inside, point ] = hasIntersection(p1, p2, l1, l2)
        if (inside && point) {
          const f = calcFactor(point, [ p2, p1 ])
          if (f >= 1) {
            p2 = p1
          } else if (f > 0) {
            p2 = point
          }
        }
        i--
      }
      i = index + 1
      while (i < points.length - 2) {
        const [ l1, l2 ] = calcSegmentPoints(i, side)
        const [ inside, point ] = hasIntersection(p1, p2, l1, l2)
        if (inside && point) {
          const f = calcFactor(point, [ p1, p2 ])
          if (f >= 1) {
            p1 = p2
          } else if (f > 0) {
            p1 = point
          }
        } else if (i === index + 1) {
          drawArc(result, p1, l2, sw, 0, 0, 0.5 - side / 2)
        }
        i++
      }
      return [ p1, p2 ]
    }

    const isOutAmplifiers = result.layer?.options?.showAmplifiers || toPrint
    const text = result.layer?.object?.attributes?.pointAmplifier?.[amps.T] || ''
    for (let i = 0; i < points.length - 2; i++) {
      let p1, p2
      [ p1, p2 ] = adjustSegmentPoints(i, 1)
      if (!ptEq(p1, p2)) {
        drawLine(result, p1, p2)
      }
      [ p1, p2 ] = adjustSegmentPoints(i, -1)
      if (!ptEq(p1, p2)) {
        drawLine(result, p1, p2)
      }
      isOutAmplifiers && drawText(
        result,
        segmentBy(points[i], points[i + 1]),
        angleOf(points[i], points[i + 1]),
        text,
        LARGE_TEXT_SIZE,
      )
    }

    if (isOutAmplifiers) {
      const amplifierA = (result.layer?.object?.attributes?.pointAmplifier?.[amps.A] || '').split('\n', 6)
      const offsetTop = -textBBox('bp', result.layer, SMALL_TEXT_SIZE).height
      const p0 = points[0]
      const p1 = points[1]
      const tspans = []
      amplifierA.forEach((line, index) => {
        tspans.push(`<tspan x = "${0}" dy="${index === 0 ? offsetTop / 8 : offsetTop * INTERLINE}">${line}</tspan>`)
      })
      drawText(
        result,
        getPointAt(p1, p0, halfPI, sw + getStrokeWidth(result.layer) / 2),
        angleOf(p0, p1),
        tspans.join(''),
        SMALL_TEXT_SIZE,
        'start',
        'text-after-edge',
      )
    }
  },
}
