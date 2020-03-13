(function () {
  /* global lineDefinitions, STRATEGY, MIDDLE, DELETE, segmentBy, drawLine, drawArrowDashes, drawMaskedText, angleOf */

  // sign name: DIRECTION OF ATTACK FEINT
  // task code: DZVIN-5519

  const POINTS = 2
  const ARROW_LENGTH = 36
  const ARROW_WIDTH = 36

  lineDefinitions['140605'] = {
    // Кількість точок у лінії (мінімальна)
    POINTS,

    // Відрізки, на яких дозволено додавання вершин лінії
    allowMiddle: MIDDLE.any,

    // Вершини, які дозволено вилучати
    allowDelete: DELETE.allowOver(POINTS),

    // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
    adjust: STRATEGY.empty,

    // Ініціалізація вершин при створенні нової лінії даного типу
    init: () => ([
      { x: 0.75, y: 0.50 },
      { x: 0.50, y: 0.50 },
      { x: 0.25, y: 0.75 },
    ]),

    // Рендер-функція
    render: (result, points, scale) => {
      const [ p0, p1, ...rest ] = points

      drawArrowDashes(result, p1, p0, ARROW_LENGTH * scale, ARROW_WIDTH * scale)

      if (rest.length) {
        drawLine(result, p1, ...rest)
      }

      // Варіант для демонстрації
      const text = document.getElementById('ampl_text').value

      if (text) {
        drawMaskedText(
          result,
          segmentBy(p0, p1, 1 / 3),
          angleOf(p1, p0),
          text,
        )
      }
    },
  }
})()
