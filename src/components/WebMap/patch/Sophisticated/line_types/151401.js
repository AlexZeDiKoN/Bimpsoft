import lineDefinitions from '../lineDefinitions'
import {
  buildingAirborne,
  getDashSize,
} from '../utils'
import { STRATEGY_ARROW, MIDDLE, DELETE } from '../strategies'
import { STATUSES } from '../../../../SelectionForm/parts/WithStatus'
// sign name: SUPPORTING ATTACK
// task code: DZVIN-5769 (part 3)
// hint: 'Напрямок дій авіації / повітряного десанту'

const POINTS = 4
const BINDING_TYPE = 'round'
const LINE_TYPE = 'L'

lineDefinitions['151401'] = {
  useStatus: true,

  // Відрізки, на яких дозволено додавання вершин символа
  allowMiddle: MIDDLE.allowOverAndNotEnd(POINTS - 2),

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.allowNotEnd(POINTS),

  // Взаємозв'язок розташування вершин (форма "каркасу" символа)
  adjust: STRATEGY_ARROW.supportingAttack,

  // Ініціалізація вершин при створенні нового символу даного типу
  init: () => [
    { x: 0.85, y: 0.35 },
    { x: 0.50, y: 0.35 },
    { x: 0.15, y: 0.75 },
    { x: 0.65, y: 0.15 },
  ],

  // Рендер-функція
  render: (result, points, scale) => {
    const status = result.layer?.object?.attributes?.status ?? STATUSES.EXISTING
    if (status === STATUSES.PLANNED) {
      const dash = getDashSize(result.layer, scale)
      result.layer.options.dashArray = dash
      result.layer._path.setAttribute('stroke-dasharray', dash)
    }
    result.d = buildingAirborne(JSON.stringify(points), LINE_TYPE, BINDING_TYPE)
  },
}
