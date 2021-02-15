import { STRATEGY_ARROW, MIDDLE, DELETE } from '../strategies'
import {
  buildingMainAttack,
} from '../utils'
import lineDefinitions from '../lineDefinitions'

// sign name: MAIN ATTACK
// task code: DZVIN-5769 (part 3)
// hint: 'Напрямок головного удару'

const POINTS = 4
const BINDING_TYPE = 'round'
const LINE_TYPE = 'L'

lineDefinitions['151403'] = {
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
  render: (result, points) => {
    result.d = buildingMainAttack(JSON.stringify(points), LINE_TYPE, BINDING_TYPE)
  },
}
