(function () {
  /* global lineDefinitions,  MIDDLE, DELETE, STRATEGY, drawArrow, segmentLength, angleOf, applyToPoint, 
  translate, compose, rotate, drawLine rad, getPointAt */

  // sign name: ???
  // task code: DZVIN-5990

  const POINTS = 3
  const ARROW_LENGTH = 36
  const ARROW_WIDTH = 18

  lineDefinitions['017063'] = {
    // Кількість точок у лінії (мінімальна)
    POINTS,

    // Відрізки, на яких дозволено додавання вершин лінії
    allowMiddle: MIDDLE.none,

    // Вершини, які дозволено вилучати
    allowDelete: DELETE.allowOver(POINTS),

    // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
    adjust: STRATEGY.shape120,

    // Ініціалізація вершин при створенні нової лінії даного типу
    init: () => ([
      { x: 0.2, y: 0.25 },
      { x: 0.3, y: 0.25 },
      { x: 0.6, y: 0.25 },
    ]),

    // Рендер-функція
    render: (result, points, scale) => {
      const [ p0, p1, p2 ] = points

      const angle = angleOf(p1, p2)

      const ang = (delta, point) => compose(
        translate(point.x, point.y),
        rotate(angle + Math.PI + rad(delta)),
      )

      const len = segmentLength(p0, p1)

      drawLine(result, p1, p2)
      const cross = { x: len, y: 0 }

      const crossPoint = applyToPoint(ang(120, p1), cross)
      drawLine(result, p1, crossPoint)

      const len2 = segmentLength(crossPoint, p1)

      const point1 = getPointAt(p1, crossPoint, Math.PI * 2 / 3, len2)
      drawLine(result, point1, crossPoint)

      const point12 = getPointAt(point1, crossPoint, Math.PI * 2 / 3, len)
      drawArrow(result, point1, point12, ARROW_LENGTH * scale, ARROW_WIDTH * scale)

      const point2 = getPointAt(p1, crossPoint, -Math.PI * 2 / 3, len2)
      drawLine(result, point2, crossPoint)

      const point22 = getPointAt(point2, crossPoint, -Math.PI * 2 / 3, len)
      drawArrow(result, point2, point22, ARROW_LENGTH * scale, ARROW_WIDTH * scale)
    },
  }
})()
