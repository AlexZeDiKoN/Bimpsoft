(function () {
  /* global lineDefinitions, STRATEGY, MIDDLE, DELETE, segmentLength, applyToPoint, compose, translate, rotate, angleOf,
  drawLine, drawArc, drawMaskedText, rad */

  // sign name: OCCUPY
  // task code: DZVIN-5535

  const POINTS = 2
  const CROSS_LENGTH = 48
  const TEXT = 'O'

  lineDefinitions['341700'] = {
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
      { x: 0.50, y: 0.50 },
      { x: 0.25, y: 0.50 },
    ]),

    // Рендер-функція
    render: (result, points, scale) => {
      const [ p0, p1 ] = points

      const r = segmentLength(p0, p1)

      const ang = (a) => compose(
        translate(p0.x, p0.y),
        rotate(rad(a)),
        translate(-p0.x, -p0.y),
      )

      const p = applyToPoint(ang(330), p1)

      const angle = angleOf(p1, p0)

      const ang2 = (delta) => compose(
        translate(p.x, p.y),
        rotate(angle + Math.PI + rad(delta)),
      )

      drawArc(result, p1, p, r, 0, 1, 1)

      const cross = { x: CROSS_LENGTH * scale, y: 0 }
      drawLine(result, applyToPoint(ang2(-60), cross), applyToPoint(ang2(120), cross))
      drawLine(result, applyToPoint(ang2(0), cross), applyToPoint(ang2(180), cross))

      drawMaskedText(
        result,
        applyToPoint(ang(180), p1),
        angle,
        TEXT,
      )
    },
  }
})()
