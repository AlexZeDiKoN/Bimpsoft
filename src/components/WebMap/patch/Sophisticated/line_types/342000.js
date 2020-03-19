(function () {
  /* global lineDefinitions, STRATEGY, MIDDLE, DELETE, drawArrow, angleOf, normalVectorTo, applyVector, segmentLength,
  drawArc, segmentBy, drawMaskedText, halfPlane */

  // sign name: RETIRE/RETIREMENT
  // task code: DZVIN-5769 (part 2)

  const POINTS = 3
  const ARROW_LENGTH = 36
  const ARROW_WIDTH = 18
  const TEXT = 'R'

  lineDefinitions['342000'] = {
    // Кількість точок у лінії (мінімальна)
    POINTS,

    // Відрізки, на яких дозволено додавання вершин лінії
    allowMiddle: MIDDLE.none,

    // Вершини, які дозволено вилучати
    allowDelete: DELETE.allowOver(POINTS),

    // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
    adjust: STRATEGY.shapeL,

    // Ініціалізація вершин при створенні нової лінії даного типу
    init: () => ([
      { x: 0.25, y: 0.66 },
      { x: 0.75, y: 0.66 },
      { x: 0.75, y: 0.33 },
    ]),

    // Рендер-функція
    render: (result, points, scale) => {
      const [ p0, p1, p2 ] = points

      drawArrow(result, p1, p0, ARROW_LENGTH * scale, ARROW_WIDTH * scale)
      const norm = normalVectorTo(p0, p1, p2)
      const a = applyVector(p1, norm)
      const r = segmentLength(p1, a) / 2
      drawArc(result, p1, a, r, 0, 0, halfPlane(p0, p1, p2))
      drawMaskedText(
        result,
        segmentBy(p0, p1, 0.5),
        angleOf(p0, p1),
        TEXT,
      )
    },
  }
})()
