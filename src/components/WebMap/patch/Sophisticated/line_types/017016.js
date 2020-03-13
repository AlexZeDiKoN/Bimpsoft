(function () {
  /* global lineDefinitions, MIDDLE, DELETE, drawLine, angleOf, compose, inverse, rotate, translateFrom, translateTo,
  applyToPoint, applyToPoints, getPointAt, drawText, applyVector, setVectorLength, getVector, setToSegment,
  oppositeVector, normalVectorTo, segmentLength */

  // sign name: ПОСЛІДОВНЕ ЗОСЕРЕДЖЕННЯ ВОГНЮ
  // task code: DZVIN-5995

  const DEF_COUNT = 3
  const EDGE = 32
  const BORDER = 48
  const NUMBERS_SIZE = 0.75

  lineDefinitions['017016'] = {
    // Кількість точок у лінії (мінімальна)
    POINTS: () => Number(document.getElementById('elem_count').value) * 3 + 1,

    // Відрізки, на яких дозволено додавання вершин лінії
    allowMiddle: MIDDLE.none,

    // Вершини, які дозволено вилучати
    allowDelete: DELETE.none,

    // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
    adjust: (prevPoints, nextPoints, changed) => {
      // Варіант для демонстрації
      const c = Number(document.getElementById('elem_count').value || DEF_COUNT)
      for (const ch of changed) {
        const role = ch % 3
        if (role === 0) {
          const segm = Math.trunc(ch / 3)
          const adjustSegm = (idx1, idx2, idxp, idxc) => {
            nextPoints[idxp] = applyVector(
              nextPoints[idx1],
              setVectorLength(
                getVector(nextPoints[idx1], nextPoints[idx2]),
                segmentLength(prevPoints[idx1], prevPoints[idxp]),
              ),
            )
            const corner = applyToPoint(compose(
              rotate(-angleOf(prevPoints[idx2], prevPoints[idx1])),
              translateFrom(prevPoints[idxp]),
            ), prevPoints[idxc])
            nextPoints[idxc] = applyToPoint(compose(
              translateTo(nextPoints[idxp]),
              rotate(angleOf(nextPoints[Math.max(idx1, idx2)], nextPoints[Math.min(idx1, idx2)])),
            ), {
              x: -Math.abs(corner.x),
              y: -Math.abs(corner.y),
            })
          }
          if (segm > 0) {
            adjustSegm(ch - 3, ch, ch - 2, ch - 1)
          }
          if (segm < c) {
            adjustSegm(ch + 3, ch, ch + 1, ch + 2)
          }
        } else if (role === 1) {
          const s1 = prevPoints[ch - 1]
          const s2 = prevPoints[ch + 2]
          nextPoints[ch] = setToSegment(
            applyVector(nextPoints[ch], oppositeVector(normalVectorTo(s1, s2, nextPoints[ch]))),
            [ s1, s2 ],
          )
          nextPoints[ch + 1] = applyVector(
            prevPoints[ch + 1],
            getVector(prevPoints[ch], nextPoints[ch])
          )
        } else {
          const corner = applyToPoint(compose(
            rotate(-angleOf(prevPoints[ch + 1], prevPoints[ch - 2])),
            translateFrom(prevPoints[ch - 1]),
          ), nextPoints[ch])
          for (let i = 0; i < c; i++) {
            nextPoints[i * 3 + 2] = applyToPoint(compose(
              translateTo(prevPoints[i * 3 + 1]),
              rotate(angleOf(prevPoints[i * 3 + 3], prevPoints[i * 3])),
            ), {
              x: -Math.abs(corner.x),
              y: -Math.abs(corner.y),
            })
          }
        }
      }
    },

    // Ініціалізація вершин при створенні нової лінії даного типу
    init: () => {
      // Варіант для демонстрації
      const c = Number(document.getElementById('elem_count').value || DEF_COUNT)
      const ih = 0.5 / c
      const result = [
        { x: 0.50, y: 0.25 }
      ]
      for (let i = 0; i < c; i++) {
        result.push(
          { x: 0.50, y: 0.25 + (i + 0.5) * ih },
          { x: 0.50 + ih / 8, y: 0.25 + (i + 0.25) * ih },
          { x: 0.50, y: 0.25 + (i + 1) * ih },
        )
      }
      return result
    },

    // Рендер-функція
    render: (result, points, scale) => {
      // Варіант для демонстрації
      const c = Number(document.getElementById('elem_count').value || DEF_COUNT)
      let start = points[0]
      for (let i = 0; i < c; i++) {
        const t = compose(
          rotate(-angleOf(points[i * 3 + 3], start)),
          translateFrom(points[i * 3 + 1]),
        )
        const inv = inverse(t)
        const corner = applyToPoint(t, points[i * 3 + 2])
        const corners = applyToPoints(inv, [
          { x: corner.x, y: corner.y },
          { x: corner.x, y: -corner.y },
          { x: -corner.x, y: -corner.y },
          { x: -corner.x, y: corner.y },
          { x: corner.x, y: corner.y },
        ])
        drawLine(result, ...corners)
        const middles = applyToPoints(inv, [
          { x: corner.x, y: 0 },
          { x: -corner.x, y: 0 },
        ])
        drawLine(result, start, middles[0])
        start = points[i * 3 + 3]
        drawLine(result, start, middles[1])
      }

      const drawBorder = (idx1, idx2) => drawLine(
        result,
        getPointAt(points[idx1 * 3], points[idx2 * 3], Math.PI / 2, BORDER * scale),
        getPointAt(points[idx1 * 3], points[idx2 * 3], -Math.PI / 2, BORDER * scale),
      )

      drawBorder(1, 0)
      drawBorder(c - 1, c)

      // Варіант для демонстрації
      const text = document.getElementById('ampl_text').value
      if (text) {
        drawText(
          result,
          applyVector(points[0], setVectorLength(getVector(points[3], points[0]), EDGE * scale)),
          angleOf(points[3], points[0]) + Math.PI / 2,
          text,
        )
      }

      // Варіант для демонстрації
      const number = Number(document.getElementById('elem_number').value)
      if (number >= 0) {
        for (let i = 0; i < c; i++) {
          drawText(
            result,
            points[i * 3 + 1],
            angleOf(points[i * 3 + 3], points[i * 3]) + Math.PI / 2,
            number + i,
            NUMBERS_SIZE,
          )
        }
      }
    },
  }
})()
