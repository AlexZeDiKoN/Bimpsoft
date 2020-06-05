import { MIDDLE, DELETE } from '../strategies'
import { STRATEGY_ARROW, buildingArrow } from '../arrowLib'
import { STATUSES } from '../../../../SelectionForm/parts/WithStatus'
import lineDefinitions from '../lineDefinitions'
import { settings } from '../../../../../utils/svg/lines'

// sign name: SUPPORTING ATTACK
// task code: DZVIN-5769 (part 3)
// hint: 'Інший напрямок удару'

const POINTS = 4
const BINDING_TYPE = 'round'
const LINE_TYPE = 'L'

lineDefinitions['151404'] = {
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
      result.layer.options.dashArray = settings.DASHARRAY * scale
      result.layer._path.setAttribute('stroke-dasharray', settings.DASHARRAY * scale)
    }
    result.d = buildingArrow(JSON.stringify(points), LINE_TYPE, BINDING_TYPE)
  },
}
