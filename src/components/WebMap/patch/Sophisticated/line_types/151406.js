import { STRATEGY_ARROW, MIDDLE, DELETE } from '../strategies'
import {
  buildingArrow,
  buildingDotted,
} from '../utils'
import lineDefinitions from '../lineDefinitions'

// sign name: SUPPORTING ATTACK
// task code: DZVIN-5769 (part 3)
// hint: 'Хибний напрямок наступу'

const POINTS = 4
const BINDING_TYPE = 'round'
const LINE_TYPE = 'L'
const COUNT_DASH = 2

lineDefinitions['151406'] = {
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
    buildingDotted(result, points, COUNT_DASH)
    result.d = buildingArrow(JSON.stringify(points), LINE_TYPE, BINDING_TYPE)
  },
}
