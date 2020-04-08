import { Symbol } from '@DZVIN/milsymbol'
import { CODE_MINE_TYPES, MINE_TYPES, CONTROL_TYPES } from '../../../../../constants/symbols'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawRectangleC, drawText,
} from '../utils'
import {
  drawLightning, drawWires, drawDotted,
} from '../arrowLib'

// sign name: Мінне поле (мінне загородження)
// task code: DZVIN-5776
// hint: 'Мінне поле (Мінне загородження)'

const SMALL_TEXT_SIZE = 0.67
const SIZE = 48

lineDefinitions['270701'] = {
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
  render: (result, points, scale) => {
    const mineType = result.layer?.object?.attributes?.params?.mineType ?? MINE_TYPES.ANTI_TANK
    const controlType = result.layer?.object?.attributes?.params?.controlType ?? CONTROL_TYPES.UNCONTROLLED
    const dummy = result.layer?.object?.attributes?.params?.dummy ?? false
    const amplifiers = result.layer?.object?.attributes?.pointAmplifier ?? { top: null, middle: null, bottom: null }
    const pO = points[0]
    // міни
    const d = SIZE * scale / 2
    const symbolScale = mineType >= MINE_TYPES.MARINE ? 0.85 : 1
    const sizeSymbol = SIZE * scale * symbolScale
    let symbol = new Symbol(CODE_MINE_TYPES[mineType], { size: sizeSymbol }).asSVG()
    result.amplifiers += `<g transform="translate(${pO.x - d * 3.2}, ${pO.y - d * 1.05})">${symbol}</g>`
    result.amplifiers += `<g transform="translate(${pO.x + d * 1.15}, ${pO.y - d * 1.05})">${symbol}</g>`
    if (mineType === MINE_TYPES.VARIOUS_TYPES) {
      symbol = new Symbol(CODE_MINE_TYPES[0], { size: sizeSymbol }).asSVG()
    }
    result.amplifiers += `<g transform="translate(${pO.x - d * 1.05}, ${pO.y - d * 1.05})">${symbol}</g>`

    drawRectangleC(result, pO, d * 6.8, d * 2.5)

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
    if (amplifiers.middle && amplifiers.middle.length !== 0) {
      const pAR = { x: pO.x + d * 3.5, y: pO.y }
      const pAL = { x: pO.x - d * 3.5, y: pO.y }
      drawText(result, pAR, 0, amplifiers.middle, 1, 'start')
      drawText(result, pAL, 0, amplifiers.middle, 1, 'end')
    }
    // Ампліфікатор «H1» «H2»
    if (amplifiers.top && amplifiers.top.length !== 0) {
      drawText(
        result,
        { x: pO.x, y: pO.y - d * 1.3 },
        0,
        amplifiers.top ?? '',
        SMALL_TEXT_SIZE,
        'middle',
        null,
        'after-edge',
      )
    }
    if (amplifiers.bottom && amplifiers.bottom.length !== 0) {
      drawText(
        result,
        { x: pO.x, y: pO.y + d * 1.25 },
        0,
        amplifiers.bottom ?? '',
        SMALL_TEXT_SIZE,
        'middle',
        null,
        'before-edge',
      )
    }
  },
}
