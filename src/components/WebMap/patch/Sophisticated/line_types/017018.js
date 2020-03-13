(function () {
  /* global lineDefinitions, STRATEGY, MIDDLE, DELETE, drawBezierSpline */

  // sign name: Район розповсюдження агітаційного матеріалу
  // task code: DZVIN-5796

  const POINTS = 3
  const STROKE_WIDTH = 5
  const CROSS_SIZE = 48
  const CROSS_COLOR = '#3388ff'

  lineDefinitions['017018'] = {
    // Кількість точок у лінії (мінімальна)
    POINTS,

    // Відрізки, на яких дозволено додавання вершин лінії
    allowMiddle: MIDDLE.areaWithAmplifiers(1),

    // Вершини, які дозволено вилучати
    allowDelete: DELETE.areaWithAmplifiers(2),

    // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
    adjust: STRATEGY.empty,

    // Ініціалізація вершин при створенні нової лінії даного типу
    init: () => ([
      { x: 0.25, y: 0.75 },
      { x: 0.50, y: 0.25 },
      { x: 0.75, y: 0.75 }
    ]),

    // Рендер-функція
    render: (result, points, scale) => {
      drawBezierSpline(result, points, true)

      const cs = CROSS_SIZE * scale
      const sw = STROKE_WIDTH * scale
      result.layer._path.setAttribute('fill', "url('#filledCircle')")
      result.layer._path.setAttribute('width', 100)
      result.amplifiers += ` 
      <pattern id="filledCircle" x="0" y="0" width="${cs * 3}" height="${cs * 3}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="${sw}" y1="${sw}" x2=${cs - sw} y2=${cs - sw} stroke="${CROSS_COLOR}" stroke-width="${sw}" />
        <line x1=${cs - sw} y1="${sw}" x2="${sw}" y2=${cs - sw} stroke="${CROSS_COLOR}" stroke-width="${sw}" />
      </pattern>`
    },
  }
})()
