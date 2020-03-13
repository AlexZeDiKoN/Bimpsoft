(function () {
  /* global lineDefinitions, STRATEGY, MIDDLE, DELETE, normalVectorTo, applyVector, drawLine, angleOf, segmentBy,
  continueLine, drawMaskedText, halfPlane */

  // sign name: CANALIZE
  // task code: DZVIN-5767

  const POINTS = 3
  const TIP_LENGTH = 10
  const TEXT = 'C'

  lineDefinitions['340400'] = {
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
      { x: 0.75, y: 0.33 },
      { x: 0.75, y: 0.66 },
      { x: 0.25, y: 0.50 },
    ]),

    // Рендер-функція
    render: (result, points, scale) => {
      const [ p0, p1, p2 ] = points

      const norm = normalVectorTo(p0, p1, p2)
      const a = applyVector(p0, norm)
      const b = applyVector(p1, norm)
      const hp = 1 - halfPlane(p0, p1, p2) * 2

      drawLine(result, a, b)
      drawLine(result, p0, a)
      drawLine(result, p1, b)

      const len = TIP_LENGTH * scale
      continueLine(result, a, p0, -len, -hp * len)
      continueLine(result, a, p0, len, hp * len)
      continueLine(result, b, p1, len, -hp * len)
      continueLine(result, b, p1, -len, hp * len)

      const c = segmentBy(p0, p1, 0.5)
      drawMaskedText(
        result,
        segmentBy(a, b, 0.5),
        angleOf(p2, c),
        TEXT,
      )
    },
  }
})()
