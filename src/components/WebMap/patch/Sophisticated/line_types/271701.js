import { MIDDLE, DELETE, STRATEGY, RENDER, SEQUENCE } from '../strategies'
import lineDefinitions from '../lineDefinitions'

// sign name: BIOLOGICAL CONTAMINATED AREA - TOXIC INDUSTRIAL MATERIAL
// task code: DZVIN-6163 (part 2)
// hint: 'Район біологічного зараження - токсичні промислові речовини'

const SIZE = 96
const CODE = '10032500002814010000'

lineDefinitions['271701'] = {
  // Спеціальний випадок
  isArea: true,

  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.areaWithAmplifiers(1),

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.areaWithAmplifiers(1),

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Індексація точок замкнутого контуру
  areaSeq: SEQUENCE.areaWithAmplifiers(1),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.25, y: 0.75 },
    { x: 0.50, y: 0.25 },
    { x: 0.75, y: 0.75 },
    { x: 0.50, y: 0.50 },
  ],

  // Рендер-функція
  render: RENDER.hatchedAreaWihSymbol(CODE, SIZE),
}
