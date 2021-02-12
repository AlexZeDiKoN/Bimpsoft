import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawBezierSpline,
  // getGraphicSize, getStrokeWidth,
  PATERN_TYPE,
  setPaternToPath,
} from '../utils'
import objTypes from '../../../entityKind'
import {
  curve3D,
  FILL_TYPE,
} from '../3dLib'

// sign name: Район розповсюдження агітаційного матеріалу
// task code: DZVIN-5796
// hint: 'Район розповсюдження агітаційного матеріалу'

const CODE = '017018'

lineDefinitions[CODE] = {
  // Використання в карточыі знаку поля "Статус"
  useStatus: true,

  // Спеціальний випадок
  isPolygon: true,

  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.area,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.area,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.25, y: 0.75 },
    { x: 0.50, y: 0.25 },
    { x: 0.75, y: 0.75 },
  ],

  // Рендер-функція
  render: (result, points) => {
    drawBezierSpline(result, points, true)
    setPaternToPath(result, PATERN_TYPE.CROSS)
  },

  build3d: (result, id, points, attributes) => {
    result.push({
      id,
      type: objTypes.SOPHISTICATED,
      entities: [ curve3D(points, 'area', true, FILL_TYPE.CROSS, attributes) ],
    })
    return result
  },

}
