import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawBezierSpline,
} from '../utils'

// sign name: Район розповсюдження агітаційного матеріалу
// task code: DZVIN-5796
// hint: 'Район розповсюдження агітаційного матеріалу'

const STROKE_WIDTH = 5
const CROSS_SIZE = 48

const CODE = '017018'

lineDefinitions[CODE] = {
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
    { x: 0.75, y: 0.75 }
  ],

  // Рендер-функція
  render: (result, points, scale) => {
    drawBezierSpline(result, points, true)

    const cs = CROSS_SIZE * scale
    const sw = STROKE_WIDTH * scale
    const fillId = `SVG-fill-pattern-${CODE}`
    const fillColor = `url('#${fillId}')`
    const color = result.layer._path.getAttribute('stroke')
    result.layer._path.setAttribute('fill', fillColor)
    result.layer._path.setAttribute('fill-opacity', 1)
    result.layer._path.setAttribute('width', 100)
    result.layer.options.fillColor = fillColor
    result.layer.options.fillOpacity = 1
    result.amplifiers += ` 
      <pattern id="${fillId}" x="0" y="0" width="${cs * 3}" height="${cs * 3}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="${sw}" y1="${sw}" x2=${cs - sw} y2=${cs - sw} stroke="${color}" stroke-width="${sw}" />
        <line x1=${cs - sw} y1="${sw}" x2="${sw}" y2=${cs - sw} stroke="${color}" stroke-width="${sw}" />
      </pattern>`
  },
}
