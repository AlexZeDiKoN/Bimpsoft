(function () {
  /* global lineDefinitions, STRATEGY, MIDDLE, DELETE, segmentBy, normalVectorTo, applyVector, drawLine, angleOf,
  drawMaskedText */

  // sign name: BLOCK
  // task code: DZVIN-5522 (part 1)

  const POINTS = 3
  const TEXT = 'B'

  lineDefinitions['340100'] = {
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
    render: (result, points) => {
      const [ p0, p1, p2 ] = points

      const pa = segmentBy(p0, p1, 0.5)
      const norm = normalVectorTo(p0, p1, p2)
      const startPoint = applyVector(pa, norm)
      drawLine(result, startPoint, pa)
      drawLine(result, p0, p1)
      drawMaskedText(
        result,
        segmentBy(startPoint, pa, 0.5),
        angleOf(pa, startPoint),
        TEXT,
      )
    },
  }
})()
