(function () {
  /* global lineDefinitions, MIDDLE, DELETE, STRATEGY, lengthLine, drawCircle, isDefPoint, drawText */

  // sign name: Дальність дії (кругові)
  // task code: DZVIN-5769 (part 3)

  const POINTS = 4
  // const CODE = '10031000001303010000'
  const SIZE = 96

  lineDefinitions['017019'] = {
    // Кількість точок у символа (мінімальна)
    POINTS,

    // Відрізки, на яких дозволено додавання вершин символа
    allowMiddle: MIDDLE.none, // areaWithAmplifiersNotEnd(POINTS),

    // Вершини, які дозволено вилучати
    allowDelete: DELETE.none, // allowOver(POINTS),

    // Взаємозв'язок розташування вершин (форма "каркасу" символа)
    adjust: STRATEGY.shapeCircle('bottom'),

    // Ініціалізація вершин при створенні нового символу даного типу
    init: () =>
      // Варіант для демонстрації
      [
        { x: 0.50, y: 0.50 },
        { x: 0.50, y: 0.60 },
        { x: 0.50, y: 0.70 },
        { x: 0.50, y: 0.80 },
      ],

    // Рендер-функція
    render: (result, points, scale) => {
      // const arrows = emptyPath()
      const color = [ 'black', 'blue', 'red', 'green' ]
      // const color = result.layer._path.getAttribute('stroke')
      const width = result.layer._path.getAttribute('stroke-width')
      const typMina = document.getElementById('typ_mina').value - 0
      const typControl = document.getElementById('typ_control').value - 0
      if (points.length < 1 || typMina > 6 || typControl > 2 || !isDefPoint(points[0])) return
      const pO = points[0]
      // вставка символа артилерия
      const d = SIZE * scale
      // const symbol = new window.ms.Symbol(CODE, { size: SIZE * scale }).asSVG()
      // result.amplifiers += `<g  transform="translate(${pO.x - d * 0.79}, ${pO.y - d * 0.53})">${symbol}</g>`
      points.forEach((elm, ind) => {
        if (isDefPoint(elm)) {
          const radius = lengthLine(pO, elm)
          drawCircle(result, pO, radius + !ind * 2)
          result.amplifiers += `<circle stroke-width="${width}" stroke="${color[ind]}" fill="transparent" cx="${pO.x}" cy="${pO.y}" r="${radius}"/> `
          if (ind !== 0) {
            const m = Math.round(result.layer._map.layerPointToLatLng(pO)
              .distanceTo(result.layer._map.layerPointToLatLng(elm)))
            drawText(result, { x: elm.x, y: elm.y - d * 0.15 / scale }, 0, m, 0.75)
            drawText(result, { x: elm.x, y: elm.y + d * 0.2 / scale }, 0, `T${ind}`)
          }
        }
      })
    },
  }
})()
