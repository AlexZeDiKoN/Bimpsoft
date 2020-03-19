(function () {
  /* global lineDefinitions, STRATEGY, MIDDLE, DELETE, drawLine, segmentBy, normalVectorTo, applyVector, drawArrow,
  angleOf, drawMaskedText */

  // sign name: PENETRATE
  // task code: DZVIN-5536

  const POINTS = 3
  const ARROW_LENGTH = 36
  const ARROW_WIDTH = 18
  const TEXT = 'P'

  lineDefinitions['341800'] = {
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

      const mid = segmentBy(p0, p1, 0.5)
      const norm = normalVectorTo(p0, p1, p2)
      const startPoint = applyVector(mid, norm)
      drawLine(result, p0, p1)
      drawArrow(result, startPoint, mid, ARROW_LENGTH * scale, ARROW_WIDTH * scale)
      drawMaskedText(
        result,
        segmentBy(startPoint, mid, 0.5),
        angleOf(mid, startPoint),
        TEXT,
      )
    },
  }
})()
