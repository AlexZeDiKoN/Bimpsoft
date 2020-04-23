import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, applyVector, angleOf, multiplyVector, getVector, drawText, setVectorLength,
} from '../utils'
import { amps } from '../../../../../constants/symbols'
import { interpolateSize } from '../../utils/helpers'
import { settings } from '../../../../../utils/svg/lines'

// sign name: ЗОНА ЦІЛІ
// task code: DZVIN-5994
// hint: 'Зона цілі'

lineDefinitions['240805'] = {
  // Ампліфікатори лінії
  useAmplifiers: [ { id: amps.N, name: 'N' } ],
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

    const fontSize = interpolateSize(
      result.layer._map.getZoom(),
      settings.TEXT_AMPLIFIER_SIZE,
      1,
      settings.MIN_ZOOM,
      settings.MAX_ZOOM,
    )
    const angle = angleOf(p0, p2)

    drawText(
      result,
      applyVector(p2, setVectorLength(getVector(p0, p2), fontSize / 10)),
      angle + Math.PI / 2,
      result.layer?.object?.attributes?.pointAmplifier?.[amps.N] ?? '',
      1,
      'middle',
      null,
      angle > 0 ? 'after-edge' : 'before-edge',
    )
  },
}
