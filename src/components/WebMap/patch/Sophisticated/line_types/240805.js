import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, applyVector, angleOf, multiplyVector, getVector, drawText, setVectorLength, getFontSize,
} from '../utils'
import { amps } from '../../../../../constants/symbols'
import { halfPI } from '../../../../../constants/utils'

// sign name: ЗОНА ЦІЛІ
// task code: DZVIN-5994
// hint: 'Зона цілі'

lineDefinitions['240805'] = {
  // Ампліфікатори лінії
  useAmplifiers: [ { id: amps.N, name: 'N', maxRows: 1 } ],
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shape7,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.50, y: 0.50 },
    { x: 0.40, y: 0.25 },
    { x: 0.50, y: 0.25 },
  ],

  // Рендер-функція
  render: (result, points) => {
    const [ p0, p1, p2 ] = points

    const v0 = p1
    const v1 = applyVector(p1, multiplyVector(getVector(p1, p2), 2))
    const v2 = applyVector(p0, getVector(p1, p0))
    const v3 = applyVector(p0, getVector(v1, p0))
    drawLine(result, v0, v1, v2, v3, v0)

    const margin = getFontSize(result.layer) / 8
    const angle = angleOf(p0, p2)

    drawText(
      result,
      applyVector(p2, setVectorLength(getVector(p0, p2), margin)),
      angle + halfPI,
      result.layer?.object?.attributes?.pointAmplifier?.[amps.N] ?? '',
      1,
      'middle',
      angle > 0 ? 'text-after-edge' : 'text-before-edge',
    )
  },
}
