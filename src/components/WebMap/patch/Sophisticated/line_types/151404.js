import { MIDDLE, DELETE } from '../strategies'
import { STRATEGY_ARROW, buildingArrow } from '../arrowLib'
import lineDefinitions from '../lineDefinitions'

// sign name: SUPPORTING ATTACK
// task code: DZVIN-5769 (part 3)
// hint: 'Інший напрямок удару'

const POINTS = 3
const BINDING_TYPE = 'round'
const LINE_TYPE = 'L'

lineDefinitions['151404'] = {
  // Відрізки, на яких дозволено додавання вершин символа
  allowMiddle: MIDDLE.areaWithAmplifiersNotEnd(POINTS - 1),

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.allowNotEnd(POINTS),

  // Взаємозв'язок розташування вершин (форма "каркасу" символа)
  adjust: STRATEGY_ARROW.supportingAttack,

  // Ініціалізація вершин при створенні нового символу даного типу
  init: () => ([
    { x: 0.25, y: 0.25 },
    { x: 0.50, y: 0.25 },
    { x: 0.65, y: 0.55 },
    { x: 0.45, y: 0.65 },
    { x: 0.35, y: 0.35 },
  ]),

  // Рендер-функція
  render: (result, points, scale) => {
    result.d = buildingArrow(JSON.stringify(points), LINE_TYPE, BINDING_TYPE)
  },
}