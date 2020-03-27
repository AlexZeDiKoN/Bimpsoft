import { MIDDLE, DELETE } from '../strategies'
import { STRATEGY_ARROW, buildingAttackHelicopter } from '../arrowLib'
import lineDefinitions from '../lineDefinitions'
import {
  addPathAmplifier,
} from '../utils'

// sign name: ATTACK HELICOPTER
// task code: DZVIN-5769 (part 3)
// hint: 'Напрямок дій вертольотів'

const POINTS = 3
const BINDING_TYPE = 'round'
const LINE_TYPE = 'L'

lineDefinitions['151402'] = {
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
    const allPath = buildingAttackHelicopter(JSON.stringify(points), LINE_TYPE, BINDING_TYPE)
    result.d = allPath.d
    addPathAmplifier(result, { d: allPath.amplifiers }, true)
  },
}
