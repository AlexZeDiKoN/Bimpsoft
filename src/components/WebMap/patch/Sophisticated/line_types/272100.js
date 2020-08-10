import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawText,
  drawCircle,
  getStrokeWidth,
  isDefPoint,
  lengthLine,
} from '../utils'
import { evaluateColor } from '../../../../../constants/colors'

// sign name: Зони РХБЗ
// task code: DZVIN-5540 (part 3)
// hint: 'Мінімально безпечні відстані радіаційного забруднення місцевості'

const COLORS = [ 'black', 'blue', 'red', 'green', 'black' ]
const MARKER = [ '', 'А', 'Б', 'В', 'Г' ]
const TEXT_SIZE = 1 // коэффициент размера текстового амплификатора

lineDefinitions['272100'] = {
  // начальные цвета круговых секторов
  presetColor: COLORS,
  // Кількість точок у символа (мінімальна)
  POINTS: 5,

  // Відрізки, на яких дозволено додавання вершин символа
  allowMiddle: MIDDLE.none, // areaWithAmplifiersNotEnd(POINTS),

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none, // allowOver(POINTS),

  // Взаємозв'язок розташування вершин (форма "каркасу" символа)
  adjust: STRATEGY.shapeCircleInvert('right'),

  adjustLL: (prevPoints, nextPoints, changed) => {
    const index = changed[0]
    const coord = nextPoints[index]
    let isGood = false
    switch (index) {
      case 0: { // сдвигаем все точки
        const dLng = prevPoints[0].lng - nextPoints[0].lng
        for (let i = 1; i < nextPoints.length; i++) {
          nextPoints[i].lat = nextPoints[0].lat
          nextPoints[i].lng = prevPoints[i].lng - dLng
        }
      }
        return
      case 1:
        isGood = coord.lng > nextPoints[index + 1].lng
        break
      case 2:
      case 3:
        isGood = (coord.lng > nextPoints[index + 1].lng) && (coord.lng < nextPoints[index - 1].lng)
        break
      case 4:
        isGood = (coord.lng > nextPoints[0].lng) && (coord.lng < nextPoints[index - 1].lng)
        break
      case undefined: // привести координаты к норме
        for (let i = 1; i < nextPoints.length; i++) {
          nextPoints[i].lat = nextPoints[0].lat
        }
        return
      default:
        return
    }
    if (!isGood) {
      nextPoints[index].lng = prevPoints[index].lng
    }
    nextPoints[index].lat = nextPoints[0].lat // выравниваем по горизонтали
  },

  // Ініціалізація вершин при створенні нового символу даного типу
  init: () => [
    { x: 0.50, y: 0.50 },
    { x: 0.75, y: 0.50 },
    { x: 0.70, y: 0.50 },
    { x: 0.65, y: 0.50 },
    { x: 0.60, y: 0.50 },
  ],

  // Рендер-функція
  render: (result, points) => {
    if (points.length < 1) { return }
    const width = getStrokeWidth(result.layer)
    const sectorsInfo = result.layer?.object?.attributes?.sectorsInfo?.toJS()
    const pO = points[0]
    const endIndex = points.length - 1
    points.forEach((point, ind, points) => {
      if (isDefPoint(point)) {
        const radius = lengthLine(pO, point)
        if (ind > 0) {
          // отрисовка круговых секторов в цвете и с заливко
          const color = evaluateColor(sectorsInfo[ind]?.color) ?? COLORS[ind]
          const fillColor = evaluateColor(sectorsInfo[ind]?.fill) ?? 'none'
          const prevPoint = (ind < endIndex) ? points[ind + 1] : pO
          const prevRadius = lengthLine(pO, prevPoint)
          // заливка сектора
          result.amplifiers += `<path fill-rule="evenodd" stroke="transparent" stroke-width="${width}" fill="${fillColor}" fill-opacity="0.22" 
            d="M${point.x} ${point.y} a${radius} ${radius} 90 1 1 0 -0.01z M${prevPoint.x} ${prevPoint.y} a${prevRadius} ${prevRadius} 0 1 1 0 -0.01z"/>`
          // цвет круга
          result.amplifiers += `<circle stroke-width="${width}" stroke="${color}" fill="none" cx="${pO.x}" cy="${pO.y}" r="${radius}"/> `
          // маркер круга
          drawText(
            result,
            { x: (pO.x + lengthLine(pO, point) + 2), y: pO.y },
            0,
            MARKER[ind],
            TEXT_SIZE,
            'start')
        }
        // отрисовка круговых секторов для выбора их на карте
        drawCircle(result, pO, radius + !ind * 2)
      }
    })
  },
}
