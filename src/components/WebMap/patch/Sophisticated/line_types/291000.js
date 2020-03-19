(function () {
  /* global lineDefinitions, STRATEGY, MIDDLE, DELETE, drawLine, continueLine */

  // sign name: FORTIFIED POSITION
  // task code: DZVIN-5989

  const POINTS = 2
  const EDGE_WIDTH = 140

  lineDefinitions['291000'] = {
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
      { x: 0.33, y: 0.33 },
      { x: 0.50, y: 0.33 },
    ]),

    // Рендер-функція
    render: (result, points, scale) => {
      const [ p0, p1 ] = points

      const edge = EDGE_WIDTH * scale
      drawLine(result, p0, p1)
      continueLine(result, p0, p1, 0, edge)
      continueLine(result, p1, p0, 0, -edge)
    },
  }
})()
