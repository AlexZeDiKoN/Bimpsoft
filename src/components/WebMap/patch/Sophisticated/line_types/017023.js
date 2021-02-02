import { Symbol } from '@C4/milsymbol'
import * as R from 'ramda'
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
  deg,
} from '../utils'
import { settings } from '../../../../../constants/drawLines'
import { amps } from '../../../../../constants/symbols'
import { extractSubordinationLevelSVG, simpleLevelSymbolCode } from '../../../../../utils/svg/milsymbol'
import { FONT_WEIGHT } from '../../../../../utils'
import { pointsToD, rectToPoints } from '../../../../../utils/svg/lines'

// sign name:
// task code: C4-477
// hint: 'Зона детальної розвідки бригади'

const SYMBOL_SCALE = 0.5

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
    // const hp = 1 - halfPlane(p0, p1, p2) * 2

    drawLine(result, p0, a, b, p1)

    const amplifierMargin = settings.AMPLIFIERS_WINDOW_MARGIN
    const level = 18
    const size = getPointSize(result.layer) * SYMBOL_SCALE
    const subordinationLevel = extractSubordinationLevelSVG(
      level,
      size,
      amplifierMargin,
    )
    const fillColor = 'black'
    const amplifier = subordinationLevel
    console.log('level', subordinationLevel)
    const angle = angleOf(a, p0)
    const rotate = ({ x, y }, originX, originY, angle) => {
      const angleRad = angle
      return {
        x: Math.cos(angleRad) * (x - originX) - Math.sin(angleRad) * (y - originY) + originX,
        y: Math.sin(angleRad) * (x - originX) + Math.cos(angleRad) * (y - originY) + originY,
      }
    }
    const add = ({ x, y }, dx, dy) => ({ x: x + dx, y: y + dy })

    levelPoints.forEach((point) => {
      const { x, y } = point
      const r = angle
      if (amplifier.maskRect) {
        result.mask += (
          pointsToD(rectToPoints(amplifier.maskRect).map((point) => {
            const movedPoint = add(point, x, y)
            if (R.isNil(r) || r === 0) {
              return movedPoint
            }
            return rotate(movedPoint, x, y, r)
          }), true)
        )
      }
      result.amplifiers += `<g
       stroke-width="${settings.AMPLIFIERS_STROKE_WIDTH}"
          transform="translate(${x},${y}) rotate(${deg(angle)})"
          font-weight="${FONT_WEIGHT}"
          ${fillColor}
       >${amplifier.sign}</g>`
    })
    const symbol = new Symbol(simpleLevelSymbolCode(level), { size }).asSVG()
    const d = size / 2
    result.amplifiers += `<g transform="translate(${a.x - d}, ${a.y - d})">${symbol}</g>`
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
