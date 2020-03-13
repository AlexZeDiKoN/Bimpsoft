(function () {
  /* global lineDefinitions, MIDDLE, DELETE, STRATEGY, drawArc, segmentBy, normalVectorTo, applyVector,
  drawArrow, segmentLength, angleOf, applyToPoint, translate, compose, rotate, drawLine, rad, square, halfPlane */

  // sign name: AMBUSH
  // task code: DZVIN-5521

  const POINTS = 3
  const ARROW_LENGTH = 36
  const ARROW_WIDTH = 18

  lineDefinitions['141700'] = {
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
      { x: 0.33, y: 0.25 },
      { x: 0.33, y: 0.75 },
      { x: 0.66, y: 0.50 },
    ]),

    // Рендер-функція
    render: (result, points, scale) => {
      const [ p0, p1, p2 ] = points

      const defAngle = rad(90) // deg, 2pi/3 rad
      const startPoint = segmentBy(p0, p1, 0.5)
      const norm = normalVectorTo(p0, p1, p2)
      const centerPoint = applyVector(startPoint, norm)
      const bLength = segmentLength(p0, p1) / 2
      const r = Math.sqrt(square(bLength) / (1 - square(Math.cos(defAngle / 2))))
      const aLength = r * (1 - Math.cos(defAngle / 2))
      const h = aLength / 2
      drawArc(result, p1, p0, r, 0, 0, halfPlane(p0, p1, p2))
      const t = compose(
        translate(startPoint.x, startPoint.y),
        rotate(angleOf(p2, startPoint))
      )
      const move = r * Math.cos(defAngle / 2)
      if (aLength < segmentLength(startPoint, centerPoint)) {
        drawArrow(result, startPoint, centerPoint, ARROW_LENGTH * scale, ARROW_WIDTH * scale)
      } else {
        drawArrow(result, startPoint, applyToPoint(t, { x: aLength, y: 0 }), ARROW_LENGTH * scale, ARROW_WIDTH * scale)

      }
      const count = Math.trunc(bLength / h) + 1
      for (let i = 0; i < count; i++) {
        const y = h * i
        const x = Math.sqrt(square(r) - square(y))
        const p00 = applyToPoint(t, { x: x - move, y })
        const p01 = applyToPoint(t, { x: x - aLength - move, y })
        const p10 = applyToPoint(t, { x: x - move, y: -y })
        const p11 = applyToPoint(t, { x: x - aLength - move, y: -y })
        drawLine(result, p00, p01)
        drawLine(result, p10, p11)
      }
    }
  }
})()
