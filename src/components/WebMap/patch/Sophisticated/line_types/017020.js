import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  addPathAmplifier, drawCircle, drawText, emptyPath, drawLine,
} from '../utils'
import { interpolateSize } from '../../utils/helpers'

// sign name: Ракетний удар
// task code: DZVIN-6009
// hint: 'Ракетний удар'

const TEXT_SIZE = 1
const TEXT_COLOR = 'black'

lineDefinitions['017020'] = {
  // Відрізки, на яких дозволено додавання вершин символа
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" символа)
  adjust: STRATEGY.onePointLine,

  // Ініціалізація вершин при створенні нового символу даного типу
  init: () => [
    { x: 0.50, y: 0.50 },
    { x: 0.50, y: 0.50 }, // Друга точка потрібна лише тому, що Leaflet.PM погано почувається, коли на полі є лінії,
    // що складаються лише з однієї точки
  ],

  // Рендер-функція
  render: (result, points) => {
    const [ p0 ] = points

    // Кола
    const r = interpolateSize(result.layer._map.getZoom(), result.layer.scaleOptions?.pointSizes)
    drawCircle(result, p0, r)
    const amplifier = emptyPath()
    drawCircle(amplifier, p0, r / 4)
    addPathAmplifier(result, amplifier, true)

    // Ампліфікатори
    const [ , b1 ] = drawText(
      result,
      { x: p0.x - r * 1.2, y: p0.y - r / 5 },
      0,
      result.layer?.options?.pointAmplifier?.middle ?? '',
      TEXT_SIZE,
      'end',
      TEXT_COLOR,
      'after-edge',
    )
    const [ , b2 ] = drawText(
      result,
      { x: p0.x - r * 1.2, y: p0.y + r / 5 },
      0,
      result.layer?.options?.pointAmplifier?.top ?? '',
      TEXT_SIZE,
      'end',
      TEXT_COLOR,
      'before-edge',
    )
    const [ , b3 ] = drawText(
      result,
      { x: p0.x + r * 1.2, y: p0.y - r / 5},
      0,
      result.layer?.options?.pointAmplifier?.bottom ?? '',
      TEXT_SIZE,
      'start',
      TEXT_COLOR,
      'after-edge',
    )
    const [ , b4 ] = drawText(
      result,
      { x: p0.x + r * 1.2, y: p0.y + r / 5 },
      0,
      result.layer?.options?.pointAmplifier?.additional ?? '',
      TEXT_SIZE,
      'start',
      TEXT_COLOR,
      'before-edge',
    )
    const leftLine = Math.max(b1.width, b2.width)
    const rightLine = Math.max(b3.width, b4.width)
    console.log({ leftLine, rightLine })
    drawLine(result, { x: p0.x - r * 1.2, y: p0.y }, { x: p0.x - r * 1.2 - leftLine, y: p0.y })
    drawLine(result, { x: p0.x + r * 1.2, y: p0.y }, { x: p0.x + r * 1.2 + rightLine, y: p0.y })
  },
}
