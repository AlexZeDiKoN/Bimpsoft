(function () {
  /* global lineDefinitions, STRATEGY, MIDDLE, DELETE, drawLine, continueLine */

  // sign name: ASSAULT CROSSING
  // task code: DZVIN-5765

  const POINTS = 4
  const EDGE_WIDTH = 60

  lineDefinitions['271300'] = {
    // Кількість точок у лінії (мінімальна)
    POINTS,

    // Відрізки, на яких дозволено додавання вершин лінії
    allowMiddle: MIDDLE.none,

    // Вершини, які дозволено вилучати
    allowDelete: DELETE.allowOver(POINTS),

    // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
    adjust: STRATEGY.empty,

    // Ініціалізація вершин при створенні нової лінії даного типу
    init: () => ([
      { x: 0.60, y: 0.25 },
      { x: 0.40, y: 0.25 },
      { x: 0.60, y: 0.75 },
      { x: 0.40, y: 0.75 },
    ]),

    // Рендер-функція
    render: (result, points, scale) => {
      const [ p0, p1, p2, p3 ] = points

      drawLine(result, p0, p2)
      drawLine(result, p1, p3)
      const width = EDGE_WIDTH * scale
      continueLine(result, p0, p2, width, -width)
      continueLine(result, p2, p0, width, width)
      continueLine(result, p1, p3, width, width)
      continueLine(result, p3, p1, width, -width)
    },
  }
})()
