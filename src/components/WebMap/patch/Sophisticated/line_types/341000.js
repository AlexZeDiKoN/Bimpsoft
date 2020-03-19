(function () {
  /* global lineDefinitions, STRATEGY, MIDDLE, DELETE, drawLine, segmentBy, normalVectorTo, applyVector, drawArrow,
  oppositeVector, segmentsBy, drawMaskedText, angleOf */

  // sign name: DISRUPT
  // task code: DZVIN-5531

  const POINTS = 3
  const ARROW_LENGTH = 36
  const ARROW_WIDTH = 18
  const TEXT = 'D'

  lineDefinitions['341000'] = {
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
      { x: 0.25, y: 0.33 },
      { x: 0.25, y: 0.66 },
      { x: 0.75, y: 0.66 },
    ]),

    // Рендер-функція
    render: (result, points, scale) => {
      const [ p0, p1, p2 ] = points

      drawLine(result, p0, p1)
      const pa = segmentsBy(p0, p1, [ 1, 0.5, 0 ])
      const norm = normalVectorTo(p0, p1, p2)
      const antiNorm = oppositeVector(norm)
      pa.forEach((point, index) => {
        const p = applyVector(point, norm)
        let endPoint = segmentBy(point, p, (4 - index) / 4)
        drawArrow(result, point, endPoint, ARROW_LENGTH * scale, ARROW_WIDTH * scale)
        if (index === 1) {
          drawMaskedText(
            result,
            segmentBy(point, endPoint, 0.5),
            angleOf(point, endPoint),
            TEXT,
          )
          endPoint = segmentBy(point, applyVector(point, antiNorm), 0.25)
          drawLine(result, point, endPoint)
        }
      })
    },
  }
})()
