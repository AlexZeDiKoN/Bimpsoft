(function () {
  /* global lineDefinitions, MIDDLE, DELETE, STRATEGY, drawRectangleC, drawLightning, drawWires, drawDotted, drawText */

  // sign name: Міне поле (мінне загородження)
  // task code: DZVIN-5769 (part 3)

  const POINTS = 1

  const CODE = [
    '10032500002803000000',
    '10032500002802000000',
    '10032500002806000000',
    '10032500002802000000',
    '00033600001100000000',
    '00033600001101000000',
    '00033600001102000000'

  ]
  const SIZE = 48

  lineDefinitions['270701'] = {
    // Кількість точок у символа (мінімальна)
    POINTS,

    // Відрізки, на яких дозволено додавання вершин символа
    allowMiddle: MIDDLE.none, // areaWithAmplifiersNotEnd(POINTS),

    // Вершини, які дозволено вилучати
    allowDelete: DELETE.none, // allowOver(POINTS),

    // Взаємозв'язок розташування вершин (форма "каркасу" символа)
    adjust: STRATEGY.empty,

    // Ініціалізація вершин при створенні нового символу даного типу
    init: () =>
      // Варіант для демонстрації
      [
        { x: 0.50, y: 0.50 }
      ],

    // Рендер-функція
    render: (result, points, scale) => {
      const typMina = document.getElementById('typ_mina').value - 0
      const typControl = document.getElementById('typ_control').value - 0
      const maquette = document.getElementById('maquetteCB').checked
      if (points.length < 1 || typMina > 6 || typMina < 0 || typControl > 2 || typControl < 0) {
        return
      }
      const pO = points[0]
      let symbol
      // міни
      const d = SIZE * scale / 2
      if (typMina < 4) {
        symbol = new window.ms.Symbol(CODE[typMina], { size: SIZE * scale }).asSVG()
      } else { // морські
        symbol = new window.ms.Symbol(CODE[typMina], { size: SIZE * 0.9 * scale }).asSVG()
      }
      result.amplifiers += `<g transform="translate(${pO.x - d * 3.2}, ${pO.y - d * 1.05})">${symbol}</g>`
      result.amplifiers += `<g transform="translate(${pO.x + d}, ${pO.y - d * 1.05})">${symbol}</g>`
      if (typMina === 3) { // різних типів
        symbol = new window.ms.Symbol(CODE[0], { size: SIZE * scale }).asSVG()
      }
      result.amplifiers += `<g transform="translate(${pO.x - d * 1.1}, ${pO.y - d * 1.05})">${symbol}</g>`
      drawRectangleC(result, pO, d * 6.5, d * 2.5)
      // Керованість
      if (typControl === 1) { // Керованість по радіо
        const pN = { x: pO.x + 2 * d, y: pO.y - d * 5 }
        const pK = { x: pO.x, y: pO.y - d * 1.25 }
        drawLightning(result, pN, pK)
      } else if (typControl === 2) { // Керованість по проводам
        const pN = { x: pO.x, y: pO.y + d * 4.5 }
        const pK = { x: pO.x, y: pO.y + d * 1.25 }
        drawWires(result, pK, pN)
      }
      // Макет/Хибний
      if (maquette) {
        const pN = { x: pO.x - d * 3.2, y: pO.y - d * 1.25 }
        const pS = { x: pO.x, y: pO.y - d * 3.8 }
        const pK = { x: pO.x + d * 3.2, y: pO.y - d * 1.25 }
        drawDotted(result, [ pN, pS, pK ])
      }
      // Ампліфікатор «N»
      const amplN = document.getElementById('ampl_text').value
      if (amplN) {
        const pAR = { x: pO.x + d * 3.5, y: pO.y }
        const pAL = { x: pO.x - d * 3.5, y: pO.y }
        drawText(result, pAR, 0, amplN, 1, 'start')
        drawText(result, pAL, 0, amplN, 1, 'end')
      }
      // Ампліфікатор «H1» «H2»
      const amplH = document.getElementById('multiline_text').value
      if (amplH) {
        const mAmplH = amplH.split('\n', 2)
        const h = SIZE * scale * 0.9
        const pATop = { x: pO.x, y: pO.y - h }
        const pABottom = { x: pO.x, y: pO.y + h }
        drawText(result, pATop, 0, mAmplH[0], 1, 'middle')
        drawText(result, pABottom, 0, mAmplH[1], 1, 'middle')
      }
    }
  }
})()
