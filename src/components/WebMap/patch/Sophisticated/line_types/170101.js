import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, normalVectorTo, segmentBy, drawArc, angleOf, segmentLength, getPointAt, calcFactor, ptEq, hasIntersection,
  drawText, textBBox,
} from '../utils'
import { amps } from '../../../../../constants/symbols'

// sign name: AIR CORRIDOR
// task code: DZVIN-5539
// hint: 'Коридор прольоту авіації через зону вогню військової частини ЗРВ'

const LARGE_TEXT_SIZE = 1.5
const SMALL_TEXT_SIZE = 0.67
const INTERLINE = 1.3

lineDefinitions['170101'] = {
  // Ампліфікатори лінії
  useAmplifiers: [ { id: amps.T, name: 'T' }, { id: amps.A, name: 'N' } ],
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.lineWithAmplifiers(1),

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.allowNotEnd(1),

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.lineWithRegulatedWidth(STRATEGY.shapeT()),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.25, y: 0.50 },
    { x: 0.75, y: 0.50 },
    { x: 0.50, y: 0.45 },
  ],

  // Рендер-функція
  render: (result, points, scale) => {
    const sw = segmentLength(normalVectorTo(points[0], points[1], points[points.length - 1]))

    const calcSegmentPoints = (index, side) => {
      const p1 = getPointAt(points[index], points[index + 1], side * Math.PI / 2, sw)
      const p2 = getPointAt(points[index + 1], points[index], -side * Math.PI / 2, sw)
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
      drawText(
        result,
        segmentBy(points[i], points[i + 1]),
        angleOf(points[i], points[i + 1]),
        result.layer?.object?.attributes?.pointAmplifier?.[amps.T] || '',
        LARGE_TEXT_SIZE,
      )
    }

    const amplifierA = (result.layer?.object?.attributes?.pointAmplifier?.[amps.A] || '').split('\n', 6)
    const bb = textBBox('bp', result.layer, SMALL_TEXT_SIZE)
    const p0 = points[0]
    const p1 = points[1]
    amplifierA.forEach((line, index, array) => {
      if (line) {
        drawText(
          result,
          getPointAt(p1, p0, Math.PI / 2, sw + (array.length - index) * bb.height * INTERLINE - bb.height / 2),
          angleOf(p0, p1),
          line,
          SMALL_TEXT_SIZE,
          'start',
        )
      }
    })
  },
}
