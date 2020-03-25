import { Symbol } from '@DZVIN/milsymbol'
import { MINE_TYPES, CONTROL_TYPES } from '../../../../../constants/symbols'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import {
  lineDefinitions, drawRectangleC, drawText, textBBox,
} from '../utils'
import {
  drawLightning, drawWires, drawDotted,
} from '../arrowLib'

// sign name: Міне поле (мінне загородження)
// task code: DZVIN-5776

const SMALL_TEXT_SIZE = 0.67
const SIZE = 48
const CODE = [
  '10032500002803000000',
  '10032500002802000000',
  '10032500002806000000',
  '10032500002802000000',
  '00033600001100000000',
  '00033600001101000000',
  '00033600001102000000',
]

lineDefinitions['270701'] = {
  // Відрізки, на яких дозволено додавання вершин символа
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" символа)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нового символу даного типу
  init: () => [
    { x: 0.50, y: 0.50 },
    { x: 0.50, y: 0.50 }, // Друга точка потрібна лише тому, що Leaflet.PM погано почувається, коли на полі є лінії,
    // що складаються лише з однієї точки
    // TODO: пристосувати для чогось другу точку! все одно приховати її не вдасться (в режимі редагування)
  ],

  // Рендер-функція
  render: (result, points, scale) => {
    const mineType = result.layer?.options?.params?.mineType ?? MINE_TYPES.ANTI_TANK
    const controlType = result.layer?.options?.params?.controlType ?? CONTROL_TYPES.UNCONTROLLED
    const dummy = result.layer?.options?.params?.dummy ?? false
    const pO = points[0]
    // міни
    const d = SIZE * scale / 2
    const symbolScale = mineType >= MINE_TYPES.MARINE ? 0.9 : 1
    let symbol = new Symbol(CODE[mineType], { size: SIZE * scale * symbolScale }).asSVG()
    result.amplifiers += `<g transform="translate(${pO.x - d * 3.2}, ${pO.y - d * 1.05})">${symbol}</g>`
    result.amplifiers += `<g transform="translate(${pO.x + d}, ${pO.y - d * 1.05})">${symbol}</g>`
    if (mineType === MINE_TYPES.VARIOUS_TYPES) {
      symbol = new Symbol(CODE[0], { size: SIZE * scale * symbolScale }).asSVG()
    }
    result.amplifiers += `<g transform="translate(${pO.x - d * 1.1}, ${pO.y - d * 1.05})">${symbol}</g>`
    drawRectangleC(result, pO, d * 6.5, d * 2.5)
    // Керованість
    if (controlType === 1) { // Керованість по радіо
      const pN = { x: pO.x + 2 * d, y: pO.y - d * 5 }
      const pK = { x: pO.x, y: pO.y - d * 1.25 }
      drawLightning(result, pN, pK)
    } else if (controlType === 2) { // Керованість по проводам
      const pN = { x: pO.x, y: pO.y + d * 4.5 }
      const pK = { x: pO.x, y: pO.y + d * 1.25 }
      drawWires(result, pK, pN)
    }
    // Макет/Хибний
    if (dummy) {
      const pN = { x: pO.x - d * 3.2, y: pO.y - d * 1.25 }
      const pS = { x: pO.x, y: pO.y - d * 3.8 }
      const pK = { x: pO.x + d * 3.2, y: pO.y - d * 1.25 }
      drawDotted(result, [ pN, pS, pK ])
    }
    // Ампліфікатор «N»
    const amplN = result.layer?.options?.textAmplifiers?.N ?? ''
    if (amplN) {
      const pAR = { x: pO.x + d * 3.5, y: pO.y }
      const pAL = { x: pO.x - d * 3.5, y: pO.y }
      drawText(result, pAR, 0, amplN, 1, 'start')
      drawText(result, pAL, 0, amplN, 1, 'end')
    }
    // Ампліфікатор «H1» «H2»
    const bb = textBBox('bp', result.layer, SMALL_TEXT_SIZE)
    drawText(
      result,
      { x: pO.x, y: pO.y - d * 1.25 - bb.height * 0.7 },
      0,
      result.layer?.options?.textAmplifiers?.H1 ?? '',
      SMALL_TEXT_SIZE,
      'middle',
    )
    drawText(
      result,
      { x: pO.x, y: pO.y + d * 1.25 + bb.height * 0.85 },
      0,
      result.layer?.options?.textAmplifiers?.H2 ?? '',
      SMALL_TEXT_SIZE,
      'middle',
    )
  }
}
