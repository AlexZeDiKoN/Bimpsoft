/* global L */

import { rotate, translate, compose, applyToPoint } from 'transformation-matrix'
import { prepareBezierPath } from '../utils/Bezier'
import { CONFIG } from '.'

const textSizeCache = {}

export const lineDefinitions = {}

// === Math ===

// Квадрат (для зручності просто)
export const square = (x) => x * x

// Підгонка кута для текстових блоків (щоб текст не перевертався ногами вгору)
export const cropAngle = (x) => x > Math.PI / 2 ? x - Math.PI
  : x < -Math.PI / 2 ? x + Math.PI
    : x

// Розв'язок квадратного рівняння
export const sqEq = (a, b, c) => {
  const d = Math.sqrt(square(b) - 4 * a * c)
  return [
    (-b + d) / 2 / a,
    (-b - d) / 2 / a,
  ]
}

// Генерація UUID
export const uuid = () => ([ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g,
  // eslint-disable-next-line no-mixed-operators
  (c) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))

// Радіани -> Градуси
export const deg = (x) => x / Math.PI * 180

// Градуси -> Радіани
export const rad = (x) => x * Math.PI / 180

// === Geometry ===

// Нульовий вектор
export const ZERO = { x: 0, y: 0 }

// Довжина відрізка
export const segmentLength = (p1, p2 = ZERO) => Math.sqrt(square(p1.x - p2.x) + square(p1.y - p2.y))

// Частина відрізка
export const segmentBy = (p1, p2, factor) => ({
  x: p1.x + (p2.x - p1.x) * factor,
  y: p1.y + (p2.y - p1.y) * factor,
})

// Масив частин відрізка
export const segmentsBy = (p1, p2, factors) => factors.map((factor) => segmentBy(p1, p2, factor))

// Кут за двома точками (між відрізком, що сполучає ці точки, та віссю абсцис)
export const angleOf = (p2, p1 = ZERO) => Math.atan2(p2.y - p1.y, p2.x - p1.x)

// Знайти вектор нормалі від відрізка до точки
export const normalVectorTo = (p1, p2, p) => {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  if (dx === 0 && dy === 0) {
    return {
      x: 0,
      y: 0,
    }
  } else if (dx === 0) {
    return {
      x: p.x - p1.x,
      y: 0,
    }
  } else if (dy === 0) {
    return {
      x: 0,
      y: p.y - p1.y,
    }
  } else {
    const k = dy / dx
    const b = p1.y - p1.x * k
    const kn = -1 / k
    const bn = p.y - p.x * kn
    const x = (bn - b) / (k - kn)
    const y = k * x + b
    return {
      x: p.x - x,
      y: p.y - y,
    }
  }
}

// Обчислити вектор, що із точки point1 приводить у точку point2
export const getVector = (point1, point2) => ({
  x: point2.x - point1.x,
  y: point2.y - point1.y,
})

// Застосувати вектор до точки (трансляція)
export const applyVector = (point, vector) => ({
  x: point.x + vector.x,
  y: point.y + vector.y,
})

// Множення вектора на скаляр
export const multiplyVector = (vector, value) => ({
  x: vector.x * value,
  y: vector.y * value,
})

// Протилежний вектор
export const oppositeVector = (vector) => multiplyVector(vector, -1)

// Встановлення довжини ветокра
export const setVectorLength = (vector, length) => {
  const oldLength = segmentLength(vector)
  if (oldLength === 0) {
    return ZERO
  }
  return multiplyVector(vector, length / oldLength)
}

// Індекс півплощини (відносно прямої, що проходить черех перших дві точки), у яку потрапить третя точка
export const halfPlane = (p0, p1, p2) => {
  const tCheck = compose(
    rotate(-angleOf(p1, p0)),
    translate(-p0.x, -p0.y),
  )
  const pCheck = applyToPoint(tCheck, p2)
  return Number(pCheck.y > 0)
}

// Обчислити координати точки, яку отримаємо, якщо рухаючись із точки p1 до p2
// повернемо на вказаний кут і пройдемо ще вказану відстань
export const getPointAt = (p1, p2, angle, length) => applyToPoint(
  compose(
    translate(p2.x, p2.y),
    rotate(angleOf(p2, p1) + angle),
  ),
  { x: length, y: 0 },
)

export const translateTo = (p) => translate(p.x, p.y)

// Пошук у масиві точки, найближчої до вказаної
export const findNearest = (point, list) => {
  let index = -1
  let value = Infinity
  for (let i = 0; i < list.length; i++) {
    const dist = segmentLength(point, list[i])
    if (dist < value) {
      index = i
      value = dist
    }
  }
  return index
}

export const drawBezierSpline = (result, points, locked) => (result.d += prepareBezierPath(points, locked))

// === Utils ===

// Визначення піксельних розмірів текстового блоку
export const textBBox = (text, layer, sizeFactor = 1) => {
  const element = L.SVG.create('text')
  element.setAttribute('font-family', CONFIG.FONT_FAMILY)
  element.setAttribute('font-size', `${Math.round(Number(CONFIG.FONT_SIZE) * sizeFactor)}em`)
  element.setAttribute('font-weight', CONFIG.FONT_WEIGHT)
  element.innerHTML = text
  layer._renderer._rootGroup.appendChild(element)
  const result = element.getBBox()
  element.remove()
  return result
}

// === Draw ===

// Переміститися у вказану точку
export const moveTo = (result, p) => (result.d += ` M${p.x} ${p.y}`)

// Провести лінію до вкааної точки
export const lineTo = (result, p) => (result.d += ` L${p.x} ${p.y}`)

export const bezierTo = (result, cp1, cp2, p) => (result.d += ` C${cp1.x} ${cp1.y} ${cp2.x} ${cp2.y} ${p.x} ${p.y}`)

// Лінія між двома вказаними точками (відрізок)
export const drawLine = (result, p1, p2) => {
  moveTo(result, p1)
  lineTo(result, p2)
}

// Ломана лінія між трьома вказаними точками
export const drawLine2 = (result, p1, ...rest) => {
  moveTo(result, p1)
  rest.forEach((point) => lineTo(result, point))
}

// Дуга кола до вказаної точки // (rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y)
export const arcTo = (result, p, rx, ry, ar = 0, la = 0, sf = 0) =>
  (result.d += ` A${rx} ${ry} ${ar} ${la} ${sf} ${p.x} ${p.y}`)

// Дуга кола між вказаними точками
export const drawArc = (result, p1, p2, r, ar = 0, la = 0, sf = 0) => {
  moveTo(result, p1)
  arcTo(result, p2, r, r, ar, la, sf)
}

export const drawCircle = (result, center, radius) => {
  const p1 = {
    x: center.x + radius,
    y: center.y,
  }
  const p2 = {
    x: center.x - radius,
    y: center.y,
  }
  moveTo(result, p1)
  arcTo(result, p2, radius, radius)
  arcTo(result, p1, radius, radius)
}

export const drawBezier = (result, p1, ...rest) => {
  moveTo(result, p1)
  for (let i = 0; i < rest.length; i += 3) {
    bezierTo(result, rest[i], rest[i + 1], rest[i + 2])
  }
}

export const emptyPath = () => ({ d: '' })

// Малювання відрізка зі стрілкою на кінці (вказуються розміри катетів виносних елементів стрілки)
export const drawArrow = (result, p1, p2, dL, dW) => {
  drawLine(result, p1, p2)
  const l = segmentLength(p1, p2)
  if (l > 0) {
    const t = compose(
      translate(p1.x, p1.y),
      rotate(angleOf(applyToPoint(translate(-p1.x, -p1.y), p2))),
    )
    drawLine2(
      result,
      applyToPoint(t, {
        x: l - dL,
        y: -dW,
      }),
      p2,
      applyToPoint(t, {
        x: l - dL,
        y: +dW,
      }),
    )
  }
}

// Стрілка з подвійної лінії
export const drawArrowOutline = (result, p1, p2, dL, dW, ddL, ddW, drawArrowLine = true) => {
  ddL = ddL === undefined ? dL / 3 : ddL
  ddW = ddW === undefined ? dW / 3 : ddW
  if (drawArrowLine) {
    drawLine(result, p1, p2)
  }
  const l = segmentLength(p1, p2)
  if (l > 0) {
    const t = compose(
      translate(p1.x, p1.y),
      rotate(angleOf(applyToPoint(translate(-p1.x, -p1.y), p2))),
    )
    drawLine2(
      result,
      applyToPoint(t, {
        x: l - dL,
        y: -dW,
      }),
      p2,
      applyToPoint(t, {
        x: l - dL,
        y: dW,
      }),
      applyToPoint(t, {
        x: l - dL,
        y: dW + ddW,
      }),
      segmentBy(p1, p2, 1 + ddL / l),
      applyToPoint(t, {
        x: l - dL,
        y: -dW - ddW,
      }),
      applyToPoint(t, {
        x: l - dL,
        y: -dW,
      }),
    )
  }
}

// Стрілка з пунктирною лінією
export const drawArrowDashes = (result, p1, p2, dL, dW, ddL, ddW) => {
  ddL = ddL === undefined ? dL / 3 : ddL
  ddW = ddW === undefined ? dW / 3 : ddW
  drawLine(result, p1, p2)
  const l = segmentLength(p1, p2)
  if (l > 0) {
    const t = compose(
      translate(p1.x, p1.y),
      rotate(angleOf(applyToPoint(translate(-p1.x, -p1.y), p2))),
    )
    drawLine2(
      result,
      applyToPoint(t, {
        x: l - dL,
        y: -dW,
      }),
      p2,
      applyToPoint(t, {
        x: l - dL,
        y: dW,
      }),
    )
    const pd = applyToPoint(t, {
      x: l - dL,
      y: dW + ddW,
    })
    const pc = segmentBy(p1, p2, 1 + ddL / l)
    const pu = applyToPoint(t, {
      x: l - dL,
      y: -dW - ddW,
    })
    drawLine(
      result,
      pd,
      segmentBy(pd, pc, 0.2),
    )
    drawLine(
      result,
      segmentBy(pd, pc, 0.4),
      segmentBy(pd, pc, 0.6),
    )
    drawLine2(
      result,
      segmentBy(pd, pc, 0.8),
      pc,
      segmentBy(pu, pc, 0.8),
    )
    drawLine(
      result,
      segmentBy(pu, pc, 0.6),
      segmentBy(pu, pc, 0.4),
    )
    drawLine(
      result,
      segmentBy(pu, pc, 0.2),
      pu,
    )
  }
}

// Продовження відрізку засічкою вказаного розміру
export const continueLine = (result, p1, p2, x, y) => {
  const t = compose(
    translate(p2.x, p2.y),
    rotate(angleOf(applyToPoint(translate(-p1.x, -p1.y), p2)))
  )
  return drawLine(result, p2, applyToPoint(t, { x, y }))
}

// Виведення тексту у прямокутнику, вирізаному маскою з основного зображення
export const drawMaskedText = (result, textPoint, textAngle, text, sizeFactor = 1) => {
  // Обчислення розміру
  const key = `${sizeFactor}:${text}`
  let box = textSizeCache[key]
  if (!box) {
    box = textBBox(text, result.layer, sizeFactor)
    textSizeCache[key] = box
  }
  textAngle = deg(cropAngle(textAngle))

  // Ампліфікатор
  let w = box.width / 2
  let h = box.height / 2
  result.amplifiers += `<text 
    fill="${result.layer._path.getAttribute('stroke')}" 
    text-anchor="middle" 
    font-family="${CONFIG.FONT_FAMILY}"
    font-size="${Math.round(CONFIG.FONT_SIZE * sizeFactor)}em"
    font-weight="${CONFIG.FONT_WEIGHT}"
    alignment-baseline="middle" 
    x="${0}" 
    y="${0}" 
    transform="translate(${textPoint.x},${textPoint.y}) rotate(${textAngle})"
  >${text}</text>`

  // Маска
  w += CONFIG.TEXT_EDGE
  h += CONFIG.TEXT_EDGE
  result.mask += `<g transform="translate(${textPoint.x},${textPoint.y}) rotate(${textAngle})">
    <rect x="-${w}" y="-${h}" width="${w * 2}" height="${h * 2}" />
  </g>`
}

export const addPathAmplifier = (result, amplifier, closed, dash) => {
  const color = result.layer._path.getAttribute('stroke')
  const width = result.layer._path.getAttribute('stroke-width')
  result.amplifiers += `<path stroke="${color}"${closed ? ` fill="${color}"` : ` stroke-width="${width}"`}${dash ? ` stroke-dasharray="${dash}"` : ''} d="${amplifier.d}" />`
}
