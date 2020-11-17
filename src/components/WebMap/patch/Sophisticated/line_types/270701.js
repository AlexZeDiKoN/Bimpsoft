import { Symbol } from '@C4/milsymbol'
import { CODE_MINE_TYPES, MINE_TYPES, CONTROL_TYPES } from '../../../../../constants/symbols'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawRectangleCz,
  drawText,
  getPointSize,
  drawLightning,
  drawWires,
  drawDotted, getFontSize,
} from '../utils'

// sign name: Мінне поле (мінне загородження)
// task code: DZVIN-5776
// hint: 'Мінне поле (Мінне загородження)'

const SMALL_TEXT_SIZE = 0.67
const MINE_SIZE = 0.65 // коэффициент размера мин по отношению к точечным знакам
const KF_WIDTH = 3.4
const KF_HEIGHT = 1.6
const COUNT_DASH = 6

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
  render: (result, points, _, toPrint) => {
    const mineType = result.layer?.object?.attributes?.params?.mineType ?? MINE_TYPES.ANTI_TANK
    const controlType = result.layer?.object?.attributes?.params?.controlType ?? CONTROL_TYPES.UNCONTROLLED
    const dummy = result.layer?.object?.attributes?.params?.dummy ?? false
    const pO = points[0]
    // міни
    const mineSize = getPointSize(result.layer) * MINE_SIZE
    const widthR = mineSize * KF_WIDTH
    const heightR = mineSize * KF_HEIGHT
    const size = mineSize * (mineType >= MINE_TYPES.MARINE ? 0.85 : 1)
    const mine = new Symbol(CODE_MINE_TYPES[mineType], { size })
    let symbol = mine.asSVG()
    let anchor = mine.getAnchor()
    result.amplifiers += `<g transform="translate(${pO.x - widthR / 3 - anchor.x}, ${pO.y - anchor.y})">${symbol}</g>`
    result.amplifiers += `<g transform="translate(${pO.x + widthR / 3 - anchor.x}, ${pO.y - anchor.y})">${symbol}</g>`
    if (mineType === MINE_TYPES.VARIOUS_TYPES) {
      const mine = new Symbol(CODE_MINE_TYPES[0], { size })
      symbol = mine.asSVG()
      anchor = mine.getAnchor()
    }
    result.amplifiers += `<g transform="translate(${pO.x - anchor.x}, ${pO.y - anchor.y})">${symbol}</g>`

    drawRectangleCz(result, pO, widthR, heightR)

    const offsetX = widthR / 2
    const offsetY = heightR / 2
    // Керованість
    if (controlType === 1) {
      // Керованість по радіо
      const pN = { x: pO.x + offsetX / 2, y: pO.y - offsetY * 3 }
      const pK = { x: pO.x, y: pO.y - offsetY }
      drawLightning(result, pN, pK)
    } else if (controlType === 2) {
      // Керованість по проводам
      const pN = { x: pO.x, y: pO.y + offsetY * 3 }
      const pK = { x: pO.x, y: pO.y + offsetY }
      drawWires(result, pK, pN)
    }
    // Макет/Хибний
    if (dummy) {
      const pN = { x: pO.x - offsetX, y: pO.y - offsetY }
      const pS = { x: pO.x, y: pO.y - offsetX - offsetY }
      const pK = { x: pO.x + offsetX, y: pO.y - offsetY }
      drawDotted(result, [ pN, pS ], [ 1, 1 ], COUNT_DASH)
      drawDotted(result, [ pS, pK ], [ 1, 1 ], COUNT_DASH)
    }

    if (result.layer?.options?.showAmplifiers || toPrint) {
      const amplifiers = result.layer?.object?.attributes?.pointAmplifier ?? { top: null, middle: null, bottom: null }
      // Ампліфікатор «N»
      const margin = getFontSize(result.layer) / 8
      if (amplifiers.middle && amplifiers.middle.length !== 0) {
        const offset = offsetX + margin
        const pAR = { x: pO.x + offset, y: pO.y }
        const pAL = { x: pO.x - offset, y: pO.y }
        drawText(result, pAR, 0, amplifiers.middle, 1, 'start')
        drawText(result, pAL, 0, amplifiers.middle, 1, 'end')
      }
      // Ампліфікатор «H1» «H2»
      const offset = offsetY + margin * SMALL_TEXT_SIZE
      if (amplifiers.top && amplifiers.top.length !== 0) {
        drawText(
          result,
          { x: pO.x, y: pO.y - offset },
          0,
          amplifiers.top ?? '',
          SMALL_TEXT_SIZE,
          'middle',
          null,
          'text-after-edge',
        )
      }
      if (amplifiers.bottom && amplifiers.bottom.length !== 0) {
        drawText(
          result,
          { x: pO.x, y: pO.y + offset },
          0,
          amplifiers.bottom ?? '',
          SMALL_TEXT_SIZE,
          'middle',
          null,
          'text-before-edge',
        )
      }
    }
  },
}
