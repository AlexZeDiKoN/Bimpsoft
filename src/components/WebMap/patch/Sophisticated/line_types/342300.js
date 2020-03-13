(function () {
  /* global lineDefinitions, MIDDLE, DELETE, segmentBy, drawMaskedText, segmentLength, angleOf, drawLine,
  setVectorLength, getVector, applyVector, getPointAt, calcControlPoint, Bezier, rad, drawBezier, drawCircle */

  // sign name: SEIZE
  // task code: DZVIN-5771

  const POINTS = 4
  const ARROW_LENGTH = 36
  const TEXT = 'S'

  lineDefinitions['342300'] = {
    // Кількість точок у лінії (мінімальна)
    POINTS,

    // Відрізки, на яких дозволено додавання вершин лінії
    allowMiddle: MIDDLE.none,

    // Вершини, які дозволено вилучати
    allowDelete: DELETE.allowOver(POINTS),

    // Взаємозв'яок розташування вершин (форма "каркасу" лінії)
    adjust: (prevPoints, nextPoints, changed) => {
      if (segmentLength(nextPoints[0], nextPoints[1]) > segmentLength(nextPoints[0], nextPoints[2])) {
        if (changed[0] === 1) {
          const vector = setVectorLength(
            getVector(nextPoints[0], nextPoints[1]),
            segmentLength(nextPoints[0], nextPoints[2]) - 5
          )
          nextPoints[1] = applyVector(prevPoints[0], vector)
        }
        if (changed[0] === 2) {
          const vector = setVectorLength(
            getVector(nextPoints[0], nextPoints[2]),
            segmentLength(nextPoints[0], nextPoints[1]) - 5
          )
          nextPoints[2] = applyVector(prevPoints[0], vector)
        }
        if (changed[0] === 0) {
          nextPoints[0] = prevPoints[0]
        }
      } else {
        if (changed[0] === 0) {
          const vector = setVectorLength(
            getVector(prevPoints[0], prevPoints[1]),
            segmentLength(prevPoints[0], prevPoints[1])
          )
          nextPoints[1] = applyVector(nextPoints[0], vector)

          const prevCenter = segmentBy(prevPoints[0], prevPoints[3], 0.5)
          const k = segmentLength(prevPoints[0], prevPoints[3]) / segmentLength(prevCenter, prevPoints[2])
          const angle = angleOf(prevPoints[2], prevCenter) - angleOf(prevPoints[3], prevCenter)
          const newA = segmentLength(nextPoints[0], nextPoints[3]) / k
          const nextCenter = segmentBy(nextPoints[0], nextPoints[3], 0.5)

          nextPoints[2] = getPointAt(nextPoints[0], nextCenter, angle, newA)
        }
      }
    },

    // Ініціалізація вершин при створенні нової лінії даного типу
    init: () => ([
      { x: 0.33, y: 0.50 },
      { x: 0.38, y: 0.50 },
      { x: 0.42, y: 0.55 },
      { x: 0.40, y: 0.70 },
    ]),

    // Рендер-функція
    render: (result, points, scale) => {
      const [ p0, p1, p2, p3 ] = points
      /* const t = compose(
        translate(p0.x, p0.y),
        rotate(angleOf(applyToPoint(translate(-p0.x, -p0.y), p1)))
      ) */
      const r = segmentLength(p0, p1)
      drawCircle(result, p0, r)

      // drawArc(result, p1, applyToPoint(t, { x: 0 - r, y: 0 }), r)
      // drawArc(result, applyToPoint(t, { x: 0 - r, y: 0 }), p1, r)

      const [ cp0, cp1 ] = calcControlPoint([ p0.x, p0.y ], [ p2.x, p2.y ], [ p3.x, p3.y ])

      const curve = new Bezier(p0.x, p0.y, p0.x, p0.y, cp0[0], cp0[1], p2.x, p2.y)
      const LUT = curve.getLUT(1000)

      let indexOfMin = 0
      LUT.forEach((point, ind) => {
        const curDiff = Math.abs(segmentLength(p0, point) - r)
        const prevDif = Math.abs(segmentLength(p0, LUT[indexOfMin]) - r)
        if (curDiff < prevDif) {
          indexOfMin = ind
        }
      })

      // split curve points
      const scp = curve.split(indexOfMin / 1000, 1).points
      const curve2 = new Bezier(p2.x, p2.y, cp1[0], cp1[1], p3.x, p3.y, p3.x, p3.y)
      const curveDerivative = curve2.derivative(1)
      const aP1 = getPointAt(applyVector(p3, curveDerivative), p3, rad(45), ARROW_LENGTH * scale)
      const aP2 = getPointAt(aP1, p3, rad(90), ARROW_LENGTH * scale)
      drawLine(result, p3, aP1)
      drawLine(result, p3, aP2)
      drawBezier(result, scp[0], scp[1], scp[2], scp[3], { x: cp1[0], y: cp1[1] }, p3, p3)

      drawMaskedText(result, p2, 0, TEXT)
    }
  }
})()
