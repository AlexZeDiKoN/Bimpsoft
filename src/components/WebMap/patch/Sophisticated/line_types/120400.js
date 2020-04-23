import { Symbol } from '@DZVIN/milsymbol'
import { MIDDLE, DELETE, STRATEGY, SEQUENCE } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawBezierSpline, drawMaskedText,
} from '../utils'
import { amps } from '../../../../../constants/symbols'

// sign name: AIRFIELD ZONE
// task code: DZVIN-5791
// hint: 'Район базування військової частини, підрозділу авіації'

const CODE = '10032500001319000000'
const SIZE = 96

lineDefinitions['120400'] = {
  // амплификатор
  useAmplifiers: [ { id: amps.N, name: 'H' } ],
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
  render: (result, points, scale) => {
    const sign = points[points.length - 2]
    const ampl = points[points.length - 1]
    const area = points.slice(0, -2)

    drawBezierSpline(result, area, true)

    const symbol = new Symbol(CODE, { size: SIZE * scale }).asSVG()
    const d = SIZE * scale / 2
    result.amplifiers += `<g transform="translate(${sign.x - d * 1.57}, ${sign.y - d * 0.95})">${symbol}</g>`

    drawMaskedText(result, ampl, 0, result.layer?.object?.attributes?.pointAmplifier?.[amps.N] ?? '')
  },
}
