(function () {
  /* global lineDefinitions, STRATEGY, MIDDLE, DELETE, drawArrow, angleOf, normalVectorTo, applyVector, segmentLength,
  drawArc, segmentBy, drawMaskedText, halfPlane */

  // sign name: Relief in Place (RIP)
  // task code: DZVIN-5537

  const POINTS = 4
  const ARROW_LENGTH = 36
  const ARROW_WIDTH = 18
  const TEXT = 'RIP'

  lineDefinitions['341900'] = {
    // Кількість точок у лінії (мінімальна)
    POINTS,

    // Відрізки, на яких дозволено додавання вершин лінії
    allowMiddle: MIDDLE.none,

    // Вершини, які дозволено вилучати
    allowDelete: DELETE.allowOver(POINTS),

    // Взаємозв'яок розташування вершин (форма "каркасу" лінії)
    adjust: STRATEGY.shapeU,

    // Ініціалізація вершин при створенні нової лінії даного типу
    init: () => ([
      { x: 0.40, y: 0.25 },
      { x: 0.60, y: 0.25 },
      { x: 0.60, y: 0.75 },
      { x: 0.40, y: 0.75 },
    ]),

    // Рендер-функція
    render: (result, points, scale) => {
      const [ p0, p1, p2, p3 ] = points

      const norm = normalVectorTo(p1, p2, p0)
      const a = applyVector(p1, norm)
      drawArrow(result, p1, a, ARROW_LENGTH * scale, ARROW_WIDTH * scale)

      const norm1 = normalVectorTo(p1, p2, p3)
      const a1 = applyVector(p2, norm1)
      drawArrow(result, a1, p2, ARROW_LENGTH * scale, ARROW_WIDTH * scale)

      const r = segmentLength(p1, p2) / 2
      drawArc(result, p1, p2, r, 0, 0, halfPlane(p0, p1, p2))

      drawMaskedText(
        result,
        segmentBy(segmentBy(p2, a, 0.5), segmentBy(p1, a1, 0.5), 0.5),
        angleOf(a1, p2),
        TEXT,
      )
    },
  }
})()
