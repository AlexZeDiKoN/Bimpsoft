(function () {
  /* global lineDefinitions, STRATEGY, MIDDLE, DELETE, normalVectorTo, applyVector, drawLine, oppositeVector */

  // sign name: INFILTRATION LANE
  // task code: DZVIN-5525

  const POINTS = 3

  lineDefinitions['140800'] = {
    // Кількість точок у лінії (мінімальна)
    POINTS,

    // Відрізки, на яких дозволено додавання вершин лінії
    allowMiddle: MIDDLE.none,

    // Вершини, які дозволено вилучати
    allowDelete: DELETE.allowOver(POINTS),

    // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
    adjust: STRATEGY.shapeT(),

    // Ініціалізація вершин при створенні нової лінії даного типу
    init: () => ([
      { x: 0.25, y: 0.50 },
      { x: 0.75, y: 0.50 },
      { x: 0.50, y: 0.45 },
    ]),

    // Рендер-функція
    render: (result, points) => {
      const [ p0, p1, p2 ] = points

      const norm = normalVectorTo(p0, p1, p2)
      const antiNorm = oppositeVector(norm)
      drawLine(result, applyVector(p0, norm), applyVector(p1, norm))
      drawLine(result, applyVector(p0, antiNorm), applyVector(p1, antiNorm))
    },
  }
})()
