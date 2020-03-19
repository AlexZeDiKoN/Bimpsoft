// import {postrArrow} from "arrowLib.js"

(function () {
/* global lineDefinitions, MIDDLE, DELETE, STRATEGY_ARROW, buildingArrow, */

  // sign name: SUPPORTING ATTAC
  // task code: DZVIN-5769 (part 3)

  const POINTS = 3

  lineDefinitions['151404'] = {
  // Кількість точок у символа (мінімальна)
    POINTS,

    // Відрізки, на яких дозволено додавання вершин символа
    allowMiddle: MIDDLE.areaWithAmplifiersNotEnd(POINTS - 1),

    // Вершини, які дозволено вилучати
    allowDelete: DELETE.allowNotEnd(POINTS),

    // Взаємозв'язок розташування вершин (форма "каркасу" символа)
    adjust: STRATEGY_ARROW.supportingAttack,

    // Ініціалізація вершин при створенні нового символу даного типу
    init: () => ([
      { x: 0.25, y: 0.25 },
      { x: 0.5, y: 0.25 },
      { x: 0.65, y: 0.55 },
      { x: 0.45, y: 0.65 },
      { x: 0.35, y: 0.35 },
    ]),

    // Рендер-функція
    render: (result, points, scale) => {
      const bindingType = document.getElementById('line_join').value
      const typeLine = document.getElementById('line_shape').value
      result.d = buildingArrow(JSON.stringify(points), typeLine, bindingType)
    },
  }
})()
