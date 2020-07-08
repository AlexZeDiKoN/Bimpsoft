import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, applyVector, angleOf, drawText, setVectorLength, getVector, getPointAt, drawLineMark,
} from '../utils'
import { amps } from '../../../../../constants/symbols'
import { MARK_TYPE } from '../../../../../constants/drawLines'

// sign name: ЗАГОРОДЖУВАЛЬНИЙ ВОГОНЬ
// task code: DZVIN-5996
// hint: 'Одинарний нерухомий загороджувальний вогонь'

const EDGE = 4

lineDefinitions['240701'] = {
  // Ампліфікатори, що використовуються на лінії
  useAmplifiers: [ { id: amps.N, name: 'N' }, { id: amps.B, name: 'B' } ],
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.5, y: 0.25 },
    { x: 0.5, y: 0.50 },
  ],

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1 ] = points

    drawLine(result, p0, p1)
    let angle = angleOf(p0, p1)
    const len = drawLineMark(result, MARK_TYPE.SERIF, p0, angleOf(p1, p0)) / 2
    drawLineMark(result, MARK_TYPE.SERIF, p1, angle)

    const top = angle < 0
    angle -= Math.PI / 2

    drawText(
      result,
      applyVector(p0, setVectorLength(getVector(p1, p0), EDGE * scale)),
      angle,
      result.layer?.object?.attributes?.pointAmplifier?.[amps.N] ?? '',
      1,
      'middle',
      'black',
      top ? 'after-edge' : 'before-edge',
    )

    drawText(
      result,
      getPointAt(p1, p0, Math.PI / 2, len),
      angle,
      result.layer?.object?.attributes?.pointAmplifier?.[amps.B] ?? '',
      1,
      top ? 'start' : 'end',
      'black',
      top ? 'before-edge' : 'after-edge',
    )
  },
}
