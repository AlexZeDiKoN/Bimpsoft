import { Symbol } from '@C4/milsymbol'
import { MIDDLE, DELETE, STRATEGY, SEQUENCE } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawBezierSpline, drawMaskedText, getPointSize,
} from '../utils'
import { amps } from '../../../../../constants/symbols'

// sign name: AIRFIELD ZONE
// task code: DZVIN-5791
// hint: 'Район базування військової частини, підрозділу авіації'

const CODE = '10032500001319000000'
const SYMBOL_SCALE = 1.25

lineDefinitions['120400'] = {
  // амплификатор
  useAmplifiers: [ { id: amps.N, name: 'H', maxRows: 1 } ],
  // Спеціальний випадок
  isArea: true,

  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.areaWithAmplifiers(2),

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.areaWithAmplifiers(2),

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.snapNearest1,

  // Індексація точок замкнутого контуру
  areaSeq: SEQUENCE.areaWithAmplifiers(2),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.25, y: 0.75 },
    { x: 0.50, y: 0.25 },
    { x: 0.75, y: 0.75 },
    { x: 0.50, y: 0.50 },
    { x: 0.55, y: 0.20 },
  ],

  // Рендер-функція
  render: (result, points, _, toPrint) => {
    const sign = points[points.length - 2]
    const ampl = points[points.length - 1]
    const area = points.slice(0, -2)

    drawBezierSpline(result, area, true)
    const size = getPointSize(result.layer) * SYMBOL_SCALE
    const symbol = new Symbol(CODE, { size }).asSVG()
    const d = size / 2
    result.amplifiers += `<g transform="translate(${sign.x - d}, ${sign.y - d})">${symbol}</g>`
    if (result.layer?.options?.showAmplifiers || toPrint) {
      drawMaskedText(result, ampl, 0, result.layer?.object?.attributes?.pointAmplifier?.[amps.N] ?? '')
    }
  },
}
