import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine,
  normalVectorTo,
  applyVector,
  angleOf,
  drawMaskedText,
  getPointSize,
  cropAngle,
  multiplyVector,
} from '../utils'
import { settings } from '../../../../../constants/drawLines'
import { amps } from '../../../../../constants/symbols'
import { subordinationLevelSVG } from '../../../../../utils/svg/milsymbol'

// sign name:
// task code: C4-477
// hint: 'Зона детальної розвідки бригади'

const SYMBOL_SCALE = 0.75

lineDefinitions['017023'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeT(),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.75, y: 0.33 },
    { x: 0.75, y: 0.66 },
    { x: 0.25, y: 0.50 },
  ],

  // Рендер-функція
  render: (result, points) => {
    const [ p0, p1, p2 ] = points

    const norm = normalVectorTo(p0, p1, p2)
    const halfnorm = multiplyVector(norm, 0.5)
    const a = applyVector(p0, norm)
    const b = applyVector(p1, norm)
    const levelPoints = [ applyVector(p0, halfnorm), applyVector(p1, halfnorm) ]

    drawLine(result, p0, a, b, p1)

    const amplifierMargin = settings.AMPLIFIERS_WINDOW_MARGIN
    const level = 18
    const angle = angleOf(a, p0)
    const size = getPointSize(result.layer) * SYMBOL_SCALE
    const subordinationLevel = subordinationLevelSVG(levelPoints, angle, level, size, amplifierMargin)
    result.mask += subordinationLevel.mask
    result.amplifiers += subordinationLevel.amplifiers

    const revert = angle !== cropAngle(angle)
    drawMaskedText(
      result,
      p0,
      angle,
      result.layer?.object?.attributes?.pointAmplifier?.[amps.N] ?? '',
      1,
      revert ? 'start' : 'end',
      'middle',
    )
  },
}
