(function () {
  /* global lineDefinitions, STRATEGY, MIDDLE, DELETE, segmentLength, segmentBy, drawLine, drawArrow, drawMaskedText,
  angleOf, compose, translate, rotate, applyToPoint */

  // sign name: FIX
  // task code: DZVIN-5532

  const POINTS = 2
  const ARROW_LENGTH = 24
  const ARROW_WIDTH = 24
  const SPRING_LENGTH = 18
  const TEXT = 'F'

  lineDefinitions['341100'] = {
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
      { x: 0.25, y: 0.50 },
      { x: 0.75, y: 0.50 },
    ]),

    // Рендер-функція
    render: (result, points, scale) => {
      const [ p0, p1 ] = points

      const l = segmentLength(p0, p1)
      if (l <= 0) {
        return
      }
      if (l > (ARROW_LENGTH * 5 + SPRING_LENGTH) * scale) {
        const p2 = segmentBy(p0, p1, ARROW_LENGTH * scale * 3 / l)
        const fixL = ARROW_LENGTH * scale * 5
        const num = Math.trunc((l - fixL) / SPRING_LENGTH / scale)
        const p3 = segmentBy(p0, p1, scale * (ARROW_LENGTH * 3 + num * SPRING_LENGTH) / l)
        drawLine(result, p0, p2)
        drawArrow(result, p3, p1, ARROW_LENGTH * scale, ARROW_WIDTH * scale)
        const t = compose(
          translate(p0.x, p0.y),
          rotate(angleOf(p0, p1)),
        )
        for (let i = 0; i < num; i++) {
          drawLine(
            result,
            applyToPoint(t, {
              x: -scale * (ARROW_LENGTH * 3 + SPRING_LENGTH * i),
              y: 0,
            }),
            applyToPoint(t, {
              x: -scale * (ARROW_LENGTH * 3 + SPRING_LENGTH * (0.5 + i)),
              y: ARROW_WIDTH * scale * ((i % 2) * 2 - 1),
            }),
            applyToPoint(t, {
              x: -scale * (ARROW_LENGTH * 3 + SPRING_LENGTH * (1 + i)),
              y: 0,
            }),
          )
        }
      } else {
        drawArrow(result, p0, p1, ARROW_LENGTH * scale, ARROW_WIDTH * scale)
      }
      drawMaskedText(
        result,
        segmentBy(p0, p1, ARROW_LENGTH * scale * 1.5 / l),
        angleOf(p1, p0),
        TEXT,
      )
    },
  }
})()
