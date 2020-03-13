(function () {
  /* global lineDefinitions, STRATEGY, MIDDLE, DELETE, segmentBy, drawLine, getPointAt, segmentLength, addPathAmplifier,
  emptyPath, drawMaskedText, angleOf */

  // sign name: GUARD
  // task code: DZVIN-5770 (part 2)

  const POINTS = 3
  const ARROW_WIDTH = 24
  const Z_WIDTH = 16
  const TEXT = 'G'
  const POINT_SIGN_SIZE = 96

  lineDefinitions['342202'] = {
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
      { x: 0.50, y: 0.45 },
      { x: 0.66, y: 0.55 },
      { x: 0.33, y: 0.55 },
    ]),

    // Рендер-функція
    render: (result, points, scale) => {
      const [ p0, p1, p2 ] = points

      const arrows = emptyPath()

      const drawZArrow = (pStart, pEnd, flip) => {
        const l = segmentLength(pStart, pEnd)
        let p = pStart
        if (l > 2 * Z_WIDTH * scale) {
          const pMid = segmentBy(pStart, pEnd, 0.5)
          const x = Math.asin(Z_WIDTH * scale * Math.sqrt(3) / l)
          const d = 1 - 2 * Number(flip)
          const pm1 = getPointAt(pStart, pMid, d * (x + Math.PI / 3), Z_WIDTH * scale)
          const pm2 = getPointAt(pEnd, pMid, d * (x + Math.PI / 3), Z_WIDTH * scale)
          drawLine(result, pStart, pm1, pm2, pEnd)
          p = pm2
        } else {
          drawLine(result, pStart, pEnd)
        }
        const pa1 = getPointAt(p, pEnd, 5 * Math.PI / 6, ARROW_WIDTH * scale)
        const pa2 = getPointAt(p, pEnd, -5 * Math.PI / 6, ARROW_WIDTH * scale)
        drawLine(arrows, pEnd, pa1, pa2)
      }

      const drawHalf = (p, flip) => {
        const l = segmentLength(p0, p)
        if (l > 0) {
          const fraction = POINT_SIGN_SIZE * scale / l
          if (fraction < 1) {
            const pp = segmentBy(p0, p, fraction)
            drawZArrow(pp, p, flip)
            drawMaskedText(result, pp, angleOf(pp, p), TEXT)
          }
        }
      }

      drawHalf(p1, true)
      drawHalf(p2, false)
      addPathAmplifier(result, arrows, true)
    },
  }
})()
