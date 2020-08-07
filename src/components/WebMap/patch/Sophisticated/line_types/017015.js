import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, normalVectorTo, applyVector, segmentBy, drawText, setVectorLength, getVector,
  angleOf, drawLineMark, getFontSize,
  angle3Points,
} from '../utils'
import { amps } from '../../../../../constants/symbols'
import { MARK_TYPE } from '../../../../../constants/drawLines'

// sign name: ЗАГОРОДЖУВАЛЬНИЙ ВОГОНЬ
// task code: DZVIN-5996
// hint: 'Рухомий загороджувальний вогонь із зазначенням найменування вогню.'

lineDefinitions['017015'] = {
  // Ампліфікатори, що використовуються на лінії
  useAmplifiers: [
    { id: amps.T, name: 'T', maxRows: 1 },
    { id: amps.N, name: 'N', maxRows: 1 },
    { id: amps.B, name: 'B', maxRows: 1 },
  ],

  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeT(),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.25, y: 0.20 },
    { x: 0.25, y: 0.60 },
    { x: 0.75, y: 0.40 },
  ],

  // Рендер-функція
  render: (result, points) => {
    const [ p0, p1, p2 ] = points

    drawLine(result, p0, p1)

    const mid = segmentBy(p0, p1, 0.5)

    const graphicSize = drawLineMark(result, MARK_TYPE.SERIF, p0, angleOf(p1, p0), 1)
    drawLineMark(result, MARK_TYPE.SERIF, p1, angleOf(p0, p1), 1)

    const norm = normalVectorTo(p0, p1, p2)
    const a = applyVector(mid, norm)
    drawLineMark(result, MARK_TYPE.ARROW_45, a, angleOf(mid, a), 1)
    drawLine(result, mid, a)

    const angle = angleOf(p0, p1) - Math.PI / 2
    const angleArrow = angle3Points(mid, p0, p2)
    const top = angleOf(p0, p1) < 0
    const left = top ? angleArrow < 0 : angleArrow >= 0
    const fontSize = getFontSize(result.layer)

    drawText(
      result,
      applyVector(p0, setVectorLength(getVector(p1, p0), fontSize / 10)),
      angle,
      result.layer?.object?.attributes?.pointAmplifier?.[amps.N] ?? '',
      1,
      'middle',
      null,
      top ? 'after-edge' : 'before-edge',
    )

    const len = graphicSize / 2
    drawText(
      result,
      applyVector(p0, setVectorLength(getVector(mid, p2), -len)),
      angle,
      result.layer?.object?.attributes?.pointAmplifier?.[amps.B] ?? '',
      1,
      left ? 'start' : 'end',
      null,
      top ? 'before-edge' : 'after-edge',
    )

    drawText(
      result,
      applyVector(mid, setVectorLength(getVector(mid, p2), fontSize / 10)),
      angle,
      result.layer?.object?.attributes?.pointAmplifier?.[amps.T] ?? '',
      1,
      left ? 'end' : 'start',
      null,
      top ? 'after-edge' : 'before-edge',
    )
  },
}
