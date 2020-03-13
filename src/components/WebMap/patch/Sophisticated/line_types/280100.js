(function () {
  /* global lineDefinitions, STRATEGY, MIDDLE, DELETE, drawLine, angleOf, applyToPoint, translate, compose, rotate */

  // sign name: ABATIS
  // task code: DZVIN-5780

  const POINTS = 2
  const EDGE_WIDTH = 20
  const EDGE_HEIGHT = 30

  lineDefinitions['280100'] = {
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
      { x: 0.33, y: 0.50 },
      { x: 0.66, y: 0.50 },
    ]),

    // Рендер-функція
    render: (result, points, scale) => {
      const [ p0, p1 ] = points

      const a0 = angleOf(applyToPoint(translate(-p0.x, -p0.y), p1))
      let t = compose(
        translate(p0.x, p0.y),
        rotate(a0)
      )
      const q1 = applyToPoint(t, { x: EDGE_WIDTH * scale, y: -EDGE_HEIGHT * scale })
      t = compose(
        translate(q1.x, q1.y),
        rotate(a0)
      )
      const q2 = applyToPoint(t, { x: EDGE_WIDTH * scale, y: EDGE_HEIGHT * scale })
      drawLine(result, p0, q1)
      drawLine(result, q1, q2)
      drawLine(result, q2, p1)
    }
  }
})()
