(function () {
  /* global lineDefinitions, MIDDLE, DELETE, STRATEGY, lengthLine, drawCircle, drawText, isDef */

  // sign name: Зони РХБЗ
  // task code: DZVIN-5769 (part 3)

  lineDefinitions['272100'] = {
    // Кількість точок у символа (мінімальна)
    POINTS: 5,
    // Відрізки, на яких дозволено додавання вершин символа
    allowMiddle: MIDDLE.none, // areaWithAmplifiersNotEnd(POINTS),

    // Вершини, які дозволено вилучати
    allowDelete: DELETE.none, // allowOver(POINTS),

    // Взаємозв'язок розташування вершин (форма "каркасу" символа)
    adjust: STRATEGY.shapeCircleInvert('right'),

    // Ініціалізація вершин при створенні нового символу даного типу
    init: () =>
      // Варіант для демонстрації
      [
        { x: 0.50, y: 0.50 },
        { x: 0.75, y: 0.50 },
        { x: 0.70, y: 0.50 },
        { x: 0.65, y: 0.50 },
        { x: 0.60, y: 0.50 },
      ],

    // Рендер-функція
    render: (result, points, scale) => {
      // const arrows = emptyPath()
      const color = [ 'black', 'blue', 'red', 'green', 'black' ]
      const marker = [ '', 'А', 'Б', 'В', 'Г' ]
      // const color = result.layer._path.getAttribute('stroke')
      const width = result.layer._path.getAttribute('stroke-width')
      if (points.length < 1) return
      const pO = points[0]
      points.forEach((elm, ind) => {
        if (isDef(elm.x) && isDef(elm.y)) {
          drawCircle(result, pO, lengthLine(pO, elm) + !ind * 2)
          drawText(
            result,
            { x: (pO.x + lengthLine(pO, elm) + 2), y: pO.y },
            0,
            marker[ind],
            undefined,
            'start')
          result.amplifiers += `<circle stroke-width="${width}" stroke="${color[ind]}" fill="transparent" cx="${pO.x}" cy="${pO.y}" r="${(lengthLine(pO, elm))}"/> `
        }
      })
    },
  }
})()
