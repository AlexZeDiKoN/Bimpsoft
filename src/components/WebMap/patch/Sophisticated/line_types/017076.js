(function () {
  /* global lineDefinitions, MIDDLE, DELETE, STRATEGY, emptyPath, drawLine, addPathAmplifier,
  getPointAt, lengthLine, drawArc, angle3Points, isDefPoint, pointsToSegment */

  // sign name: WEAPON/SENSOR RANGE FAN, SECTOR
  // task code: DZVIN-5769 (part 3)

  const DEF_COUNT = 2

  lineDefinitions['017076'] = {
    // Кількість точок у символа (мінімальна)
    POINTS: 2,
    // Відрізки, на яких дозволено додавання вершин символа
    allowMiddle: MIDDLE.none, // areaWithAmplifiersNotEnd(POINTS),

    // Вершини, які дозволено вилучати
    allowDelete: DELETE.none, // allowOver(POINTS),

    // Взаємозв'язок розташування вершин (форма "каркасу" символа)
    adjust: STRATEGY.shapeSector,

    // Ініціалізація вершин при створенні нового символу даного типу
    init: () => {
      // Варіант для демонстрації
      let c = Number(document.getElementById('elem_count').value || DEF_COUNT)
      const um = { offsetHeight: 1, offsetWidth: 1 }
      const dmap = document.getElementById('map') || um
      const scale = dmap.offsetHeight / dmap.offsetWidth
      if (c < 1) { c = 1 }
      if (c > 10) { c = 9 }
      const ih = 0.80 / c
      const result = [
        { x: 0.50, y: 0.75 },
        { x: 0.50, y: 0.25 },
      ]
      const sa = Math.sin(Math.PI / 6.0)
      const ca = Math.cos(Math.PI / 6.0)
      for (let i = 1; i <= c; i++) {
        result.push(
          { x: 0.50 - i * 0.50 * ih * sa * scale, y: 0.75 - i * 0.50 * ih * ca },
          { x: 0.50 + 0.50 * ih * sa * i * scale, y: 0.75 - 0.50 * ih * ca * i },
        )
      }
      return result
    },

    // Рендер-функція
    render: (result, points, scale) => {
      const pO = points[0]
      const pE = points[1]
      // вывод азимута
      if (!isDefPoint(pO) || !isDefPoint(pE)) {
        return
      }
      const arrows = emptyPath()
      drawLine(result, pO, pE)
      // const pDownArrow = segmentDivision(points[1], points[0], 0.1)
      const lengthArrow = lengthLine(pE, pO) * 0.075
      const pa1 = getPointAt(pO, pE, Math.PI / 12, -lengthArrow)
      const pa2 = getPointAt(pO, pE, -Math.PI / 12, -lengthArrow)
      // стрелка азимута
      drawLine(arrows, pE, pa1, pa2)
      addPathAmplifier(result, arrows, true)
      if (points.length < 4) return
      // построения секторов
      // бока первого сектора
      let s1top = points[2]
      let s2top = points[3]
      if (!isDefPoint(s1top) || !isDefPoint(s2top)) {
        return
      }
      drawLine(result, pO, s1top)
      drawLine(result, pO, s2top)
      let s1topPrev, s2topPrev
      // построения последующих секторов
      for (let i = 4; i < points.length; i += 2) {
        const heightPreviousSector = lengthLine(pO, s1top) // heightSector
        if (!isDefPoint(points[i]) || !isDefPoint(points[i + 1])) {
          continue
        }
        s1topPrev = s1top
        s2topPrev = s2top
        s1top = points[i]
        s2top = points[i + 1]
        const s1botton = pointsToSegment(pO, s1top, heightPreviousSector)
        const s2botton = pointsToSegment(pO, s2top, heightPreviousSector)
        // бока сектора
        drawLine(result, s1botton, s1top)
        drawLine(result, s2botton, s2top)
        // построение верха секторов
        const mP = [ s1topPrev, s2topPrev, s1botton, s2botton ]
        // сортировка точек
        mP.sort((elm1, elm2) => (angle3Points(pO, pE, elm1) - angle3Points(pO, pE, elm2)))
        drawArc(result, mP[0], mP[1], heightPreviousSector, 0, 0, 1)
        drawArc(result, mP[1], mP[2], heightPreviousSector, 0, 0, 1)
        drawArc(result, mP[2], mP[3], heightPreviousSector, 0, 0, 1)
      }
      drawArc(result, s1top, s2top, lengthLine(pO, s1top), 0, 0, 1)
    },
  }
})()
