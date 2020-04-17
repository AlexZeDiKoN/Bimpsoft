import Bezier from 'bezier-js'
import * as R from 'ramda'
import { interpolateSize } from '../../components/WebMap/patch/utils/helpers'
import { evaluateColor } from '../../constants/colors'
import { extractSubordinationLevelSVG } from './milsymbol'
import { extractTextSVG } from './text'

export const settings = {
  LINE_WIDTH: 2, // (пікселів) товщина ліній
  AMPLIFIERS_STEP: 144, // (пікселів) крок відображення ампліфікаторів на лініях
  AMPLIFIERS_SIZE: 96, // (пікселів) розмір тактичного знака, з якого знімаємо ампліфікатор рівня підрозділу
  AMPLIFIERS_WINDOW_MARGIN: 6, // (пікселів) ширина ободків навкого ампліфікатора
  AMPLIFIERS_STROKE_WIDTH: 6, // (пікселів) товщина пера (у масштабі), яким наносяться ампліфікатори
  NODES_STROKE_WIDTH: 2, // (пікселів) товщина лінії для зображення вузлових точок
  NODES_SPACE: 36, // (пікселів) відстань очищення ампліфікаторів, надто близьких до вузлових точок
  // NODES_CIRCLE_RADIUS: 12, // (пікселів) радіус перекресленого кола у візлових точках
  // NODES_SQUARE_WIDTH: 24, // (пікселів) сторона квадрата у вузлових точках
  NODES_SIZE: { min: 12, max: 120 }, // (пікселів) розмір вузлової точки (діаметр перекресленого кола, сторона квадрата)
  TEXT_AMPLIFIER_SIZE: { min: 4, max: 64 }, // (пікселів) 'Розмір текстових ампліфікаторів лінійних/площинних знаків'
  GRAPHIC_AMPLIFIER_SIZE: { min: 4, max: 64 }, // (пікселів) 'Розмір графічних ампліфікаторів лінійних/площинних знаків'
  // Важливо! Для кращого відображення хвилястої лінії разом з ампліфікаторами, бажано щоб константа AMPLIFIERS_STEP
  // була строго кратною WAVE_SIZE
  WAVE_SIZE: { min: 6, max: 180 }, // (пікселів) ширина "хвилі" для хвилястої лінії
  CREASE_SIZE: { min: 6, max: 180 }, // (пікселів) ширина "изгиба" для ліній загородження
  WIRE_SIZE: { min: 30, max: 180 }, // (пікселів) ширина шага повтора для ліній загородження з дрота
  BLOCKAGE_SIZE: { min: 6, max: 180 }, // (пікселів) висота знака для ліній "загородження"
  MOAT_SIZE: { min: 6, max: 180 }, // (пікселів) висота знака для ліній "рів"
  ROW_MINE_SIZE: { min: 4, max: 80 }, // (пікселів) висота знака для ліній "ряд мін"
  DOTS_HEIGHT: { min: 4, max: 50 }, // (пікселів) висота знака для ліній "точки"
  LINE_AMPLIFIER_TEXT_SIZE: { min: 6, max: 70 },
  // WAVE_SIZE: 24, // (пікселів) висота "хвилі" для хвилястої лінії
  STROKE_SIZE: { min: 9, max: 36 }, // (пікселів) відстань між "засічками" для лінії з засічками
  // STROKE_SIZE: 18, // (пікселів) висота "засічки" для лінії з засічками
  // TODO потенційно це місце просадки продуктивності:
  // TODO * при маленьких значеннях будуть рвані лінії
  // TODO * при великих може гальмувати відмальовка
  LUT_STEPS: 16000, // максимальна кількість ділянок, на які розбивається сегмент кривої Безьє для обчислення
  // довжин і пропорцій
  DRAW_PARTIAL_WAVES: true,
  MIN_ZOOM: 0,
  MAX_ZOOM: 20,
  STROKE_WIDTH: 5,
  CROSS_SIZE: 48,
}

export const MARK_TYPE = {
  ARROW_90: 'arrow90',
  ARROW_60: 'arrow60',
  ARROW_45: 'arrow45',
  ARROW_30: 'arrow30',
  ARROW_30_FILL: 'arrow30fill',
  SERIF: 'serif',
  SERIF_CROSS: 'serif_cross',
}

class Segment {
  constructor (start, finish) {
    this.start = start
    this.vector = {
      x: finish.x - start.x,
      y: finish.y - start.y,
    }
  }

  length = () => Math.hypot(this.vector.x, this.vector.y)

  get = (part) => ({
    x: this.start.x + this.vector.x * part,
    y: this.start.y + this.vector.y * part,
  })

  normal = () => ({
    x: -this.vector.y,
    y: +this.vector.x,
  })
}

const dist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y)
const vector = (ps, pf) => ({ x: pf.x - ps.x, y: pf.y - ps.y })
const normal = (v) => ({ x: +v.y, y: -v.x })
const length = (v) => Math.hypot(v.x, v.y)
const multiply = (v, k) => ({ x: v.x * k, y: v.y * k })
export const rotateVector = (v, deg) => ({
  x: v.x * Math.cos(deg) + v.y * Math.sin(deg),
  y: v.y * Math.cos(deg) - v.x * Math.sin(deg),
})
const setLength = (v, l) => multiply(v, l / length(v))
const apply = (p, v) => ({ x: p.x + v.x, y: p.y + v.y })
const angle = (v) => Math.atan2(v.y, v.x) / Math.PI * 180
export const roundXY = ({ x, y }) => ({ x: Math.round(x), y: Math.round(y) })

const nextIndex = (points, index, locked) => locked && index === points.length - 1 ? 0 : index + 1

export const bezierArray = (points, index, locked) => {
  const next = nextIndex(points, index, locked)
  return [
    points[index].x,
    points[index].y,
    points[index].cp2.x,
    points[index].cp2.y,
    points[next].cp1.x,
    points[next].cp1.y,
    points[next].x,
    points[next].y,
  ]
}
const lineArray = (points, index, locked) => {
  const next = nextIndex(points, index, locked)
  return [
    points[index],
    points[next],
  ]
}
export const rectToPoints = ({ x, y, width, height = width }) =>
  [ { x, y }, { x, y: y + height }, { x: x + width, y: y + height }, { x: x + width, y } ]

export const circleToD = (r, dx, dy) => `
  M ${dx - r}, ${dy}
  a ${r},${r} 0 1,0 ${r * 2},0
  a ${r},${r} 0 1,0 ${-r * 2},0z
`

export const pointsToD = (points, locked) => {
  points = points.map(({ x, y }) => `${Math.round(x)} ${Math.round(y)}`)
  return `M${points.join('L')}${locked ? 'z' : ''}`
}

const getPart = (steps, lut, pos, start = 0, finish = 0) => {
  if (finish === 0) {
    finish = lut.length - 1
  }
  if (lut[start].al >= pos || start === finish) {
    return start / steps
  }
  if (lut[finish] < pos) {
    return finish / steps
  }
  if (finish - start === 1) {
    const ds = pos - lut[start].al
    const df = lut[finish].al - pos
    return (ds <= df ? start : finish) / steps
  }
  const mid = Math.floor((start + finish) / 2)
  return lut[mid].al > pos
    ? getPart(steps, lut, pos, start, mid)
    : getPart(steps, lut, pos, mid, finish)
}

const prepareLUT = (lut) => {
  let acc = 0
  lut[0].al = 0
  for (let i = 1; i < lut.length; i++) {
    acc += dist(lut[i], lut[i - 1])
    lut[i].al = acc
  }
}

const getLineFromSection = (start, end) => {
  const a = start.y - end.y
  const b = end.x - start.x
  const c = -a * start.x - b * start.y
  const normalizer = Math.hypot(a, b) || 1
  return { a: a / normalizer, b: b / normalizer, c: c / normalizer }
}

const getCrossPoint = (aLine, bLine) => {
  const { a: a1, b: b1, c: c1 } = aLine
  const { a: a2, b: b2, c: c2 } = bLine
  const denominator = a1 * b2 - a2 * b1
  if (denominator) {
    const x = -1 * (c1 * b2 - c2 * b1) / denominator
    const y = -1 * (a1 * c2 - a2 * c1) / denominator
    return { x, y }
  }
  console.warn('Unexpectedly parallel vectors ', aLine, ' and ', bLine)
  return null
}

const getAngleBetween = (v1, v2) => {
  const angle = Math.atan2(v2.y, v2.x) - Math.atan2(v1.y, v1.x)
  return angle < 0 // normalize to [ 0; 2PI ]
    ? angle + 2 * Math.PI
    : angle
}

const shiftPoint = (offset, point, prevPoint, nextPoint, isCurve = false) => {
  if (prevPoint && nextPoint) {
    const v1 = vector(prevPoint, point)
    const v2 = vector(point, nextPoint)
    const n1 = setLength(normal(v1), offset)
    const n2 = setLength(normal(v2), offset)
    const aPointEnd = { x: point.x - n1.x, y: point.y - n1.y }
    const bPointStart = { x: point.x - n2.x, y: point.y - n2.y }

    if (!isCurve) {
      const angle = getAngleBetween(v1, v2)
      if (angle > 3 && angle < 4) { // !!! if angle is bigger than 3rad and lower than 4rad we can get number next to infinity !!!
        // so we get two points which are nearest to the marked one instead of getting crossPoint of two lines
        return [ aPointEnd, bPointStart ]
      }
    }

    const aPointStart = { x: prevPoint.x - n1.x, y: prevPoint.y - n1.y }
    const bPointEnd = { x: nextPoint.x - n2.x, y: nextPoint.y - n2.y }

    const aLine = getLineFromSection(aPointStart, aPointEnd)
    const bLine = getLineFromSection(bPointStart, bPointEnd)
    return getCrossPoint(aLine, bLine) || { x: (aPointEnd.x + bPointStart.x) / 2, y: (aPointEnd.y + bPointStart.y) / 2 }
  }
  const prev = prevPoint || point
  const next = nextPoint || point
  const v = vector(prev, next)
  const n = setLength(normal(v), offset)
  const { x, y } = point
  return { x: x - n.x, y: y - n.y }
}

const getShiftedPoints = (points, offset, locked) => {
  const l = points.length - 1
  const shiftedPoints = []
  points.forEach((point, index) => {
    const prev = index
      ? points[index - 1]
      : locked
        ? points[l]
        : null
    const next = index !== l
      ? points[index + 1]
      : locked
        ? points[0]
        : null
    const shifted = shiftPoint(offset, point, prev, next)
    Array.isArray(shifted) ? shiftedPoints.push(...shifted) : shiftedPoints.push(shifted)
  })
  return shiftedPoints
}

const buildPoints = (points, segments, pointLocationResolver, bezier, locked) => {
  return segments.map((index) => {
    const segment = bezier
      ? new Bezier(...bezierArray(points, index, locked))
      : new Segment(...lineArray(points, index, locked))
    const t = pointLocationResolver(index)
    const point = segment.get(t)
    point.n = segment.normal(t)
    point.t = t
    point.r = (Math.atan2(point.n.y, point.n.x) / Math.PI + 0.5) * 180
    return point
  })
}

const buildPeriodicPoints = (step, verticalOffset, offset, points, bezier, locked, insideMap, skipNodes = false) => {
  const amplPoints = []
  bezier = bezier && points.length > 2
  const makePointsArray = (segment, i) => {
    const length = segment.length()
    const steps = Math.min(Math.round(length), settings.LUT_STEPS) || 1
    let lut = null
    if (bezier) {
      lut = segment.getLUT(steps)
      prepareLUT(lut)
    }
    if (length > 0) {
      let pos = offset + step
      while (pos < length) {
        const part = bezier
          ? getPart(steps, lut, pos)
          : pos / length
        const amplPoint = segment.get(part)
        amplPoint.n = segment.normal(part)
        amplPoint.r = (Math.atan2(amplPoint.n.y, amplPoint.n.x) / Math.PI + 0.5) * 180
        amplPoint.i = insideMap(amplPoint)
        amplPoint.o = (i < last - 1 || length - pos > step / 5) &&
          (!skipNodes || (pos > settings.NODES_SPACE && length - pos > settings.NODES_SPACE))
        amplPoints.push(amplPoint)
        pos += step
      }
      offset = pos - step - length
    }
  }
  const carcassPoints = !verticalOffset || bezier ? points : getShiftedPoints(points, verticalOffset, locked)
  const last = carcassPoints.length - Number(!locked)
  for (let i = 0; i < last; i++) {
    const segment = bezier
      ? verticalOffset
        ? new Bezier(...offsetCurve(bezierArray(carcassPoints, i, locked), verticalOffset))
        : new Bezier(...bezierArray(carcassPoints, i, locked))
      : new Segment(...lineArray(carcassPoints, i, locked))
    makePointsArray(segment, i)
  }
  return amplPoints
}

const duplicate = (elem) => [ elem, elem ]

const offsetCurve = (cPoints, offset) => {
  const [ p1x, p1y, cp1x, cp1y, cp2x, cp2y, p2x, p2y ] = cPoints
  const points = [ { x: p1x, y: p1y } ]
  // get rid of control points, which are located at the same place where the main ones are
  !(p1x === cp1x && p1y === cp1y) && points.push({ x: cp1x, y: cp1y })
  !(p2x === cp2x && p2y === cp2y) && points.push({ x: cp2x, y: cp2y })
  points.push({ x: p2x, y: p2y })
  const next = points.reduce((acc, p, i) => {
    acc.push(shiftPoint(offset, p, points[i - 1] || null, points[i + 1] || null, true))
    return acc
  }, [])
  return next.length < 3 ? R.chain(duplicate, next) : next
}

function getPolygonCentroid (points) {
  const first = points[0]
  const last = points[points.length - 1]
  if (first.x !== last.x || first.y !== last.y) {
    points = [ ...points, first ]
  }
  let twiceArea = 0
  let x = 0
  let y = 0
  let p1
  let p2
  let f
  const pointsLength = points.length
  for (let i = 0, j = pointsLength - 1; i < pointsLength; j = i++) {
    p1 = points[i]
    p2 = points[j]
    f = p1.x * p2.y - p2.x * p1.y
    twiceArea += f
    x += (p1.x + p2.x) * f
    y += (p1.y + p2.y) * f
  }
  f = twiceArea * 3
  return { x: x / f, y: y / f }
}

const getBoundsFunc = ({ min, max }, step) =>
  ({ x, y }) => x > min.x - step && y > min.y - step && x < max.x + step && y < max.y + step

const getLineEnd = (objectAttributes, end) => {
  const res = objectAttributes && objectAttributes[end]
  return res === 'none' ? null : res
}
const getNodes = (nodalPointIcon) => nodalPointIcon === 'none' ? null : nodalPointIcon

const lineLength = (points, locked) => {
  const last = points.length - 1
  return points.reduce((acc, p, index) => {
    const prev = !index
      ? locked
        ? points[last]
        : p
      : points[index - 1]
    const l = length(vector(prev, p))
    return acc + l
  }, 0)
}

const addLineTo = ({ x, y }) => ` L${x} ${y}`

const addWave = (
  inverse,
  waveSize,
  waveStep,
  p1,
  p2,
  halfWave = false,
  part = 'left',
  addLine = false,
  addSize = !inverse,
) => {
  let result = ''
  const v = vector(p1, p2)
  const n = setLength(normal(v), waveSize + (addSize ? waveStep - length(v) : 0))
  const cp1 = apply(p1, n)
  const cp2 = apply(p2, n)
  if (halfWave) {
    const b = new Bezier([ p1.x, p1.y, cp1.x, cp1.y, cp2.x, cp2.y, p2.x, p2.y ])
    const p = b.split(0.5)[part].points
    addLine && (result = addLineTo(p[0]))
    result += ` C${p[1].x} ${p[1].y} ${p[2].x} ${p[2].y} ${p[3].x} ${p[3].y}`
  } else {
    result = ` C${cp1.x} ${cp1.y} ${cp2.x} ${cp2.y} ${p2.x} ${p2.y}`
  }
  return result
}

export const waved = (points, objectAttributes, bezier, locked, bounds, scale = 1, zoom = -1, inverse = false) => {
  if (zoom < 0) {
    zoom = settings.MAX_ZOOM
  }
  const waveStep = interpolateSize(zoom, settings.WAVE_SIZE, scale, settings.MIN_ZOOM, settings.MAX_ZOOM)
  const lineLen = lineLength(points, locked)
  let waves = `M${points[0].x} ${points[0].y}`
  if (lineLen <= waveStep * 3) { // if we have not default line endings on both sides of the line, we need at least 3 waves to c it correctly
    points.forEach((p, i) => i && (waves += addLineTo(p)))
  } else {
    const waveSize = waveStep / 1.5 // settings.WAVE_SIZE * scale
    const insideMap = getBoundsFunc(bounds, waveStep)
    const verticalOffset = inverse ? waveSize * 0.8 : 0 // @TODO: make constant
    const wavePoints = buildPeriodicPoints(waveStep, verticalOffset, -waveStep, points, bezier, locked, insideMap)
    if (!wavePoints.length) {
      return 'M0 0'
    }
    if (!inverse || !getLineEnd(objectAttributes, 'left')) {
      waves = `M${wavePoints[0].x} ${wavePoints[0].y}`
    }
    for (let i = 1; i < wavePoints.length; i++) {
      if (inverse && i === wavePoints.length - 1 && getLineEnd(objectAttributes, 'right')) {
        waves += addWave(inverse, waveSize, waveStep, wavePoints[i - 1], wavePoints[i], true)
      } else if (i === 1 && getLineEnd(objectAttributes, 'left')) {
        waves += inverse
          ? addWave(inverse, waveSize, waveStep, wavePoints[0], wavePoints[1], true, 'right', true)
          : addLineTo(wavePoints[1])
      } else if (!wavePoints[i].i) {
        waves += addLineTo(wavePoints[i])
      } else {
        waves += addWave(inverse, waveSize, waveStep, wavePoints[i - 1], wavePoints[i])
      }
    }
    if (settings.DRAW_PARTIAL_WAVES && wavePoints.length > 0) {
      const p0 = wavePoints[wavePoints.length - 1]
      const p1 = inverse
        ? shiftPoint(verticalOffset, points[points.length - 1], points[points.length - 2])
        : points[points.length - 1]
      const rest = dist(p0, p1)
      if (rest >= 1) {
        if (locked) {
          waves += addWave(inverse, waveSize, waveStep, p0, points[0], false, false, false, false)
        } else {
          if (getLineEnd(objectAttributes, 'right')) {
            waves += ` L${points[points.length - 1].x} ${points[points.length - 1].y}`
          } else {
            const p2 = {
              x: p0.x + (p1.x - p0.x) / rest * waveStep,
              y: p0.y + (p1.y - p0.y) / rest * waveStep,
            }
            const l = Math.hypot(p0.n.x, p0.n.y)
            const cp1 = {
              x: p0.x - p0.n.x / l * waveSize,
              y: p0.y - p0.n.y / l * waveSize,
            }
            const cp2 = {
              x: p2.x + cp1.x - p0.x,
              y: p2.y + cp1.y - p0.y,
            }
            const b = new Bezier([ p0.x, p0.y, cp1.x, cp1.y, cp2.x, cp2.y, p2.x, p2.y ])
            const p = b.split(rest / waveStep).left.points
            waves += ` C${p[1].x} ${p[1].y} ${p[2].x} ${p[2].y} ${p[3].x} ${p[3].y}`
          }
        }
      }
    }
  }
  return `${waves}${locked ? ' Z' : ''}`
}
// ---------------------------------------------------------------------------------------------------
// смещение точек линий или кривых Безье
const shiftPointsToPoints = (points, verticalOffset = 0, bezier = false, locked = false) => {
  let carcassPoints = [] // каркас кривой по всеми точками
  const carcassLines = [] // каркас кривой Безье
  let cp1, cp2
  if (bezier) {
    let last = points.length - Number(!locked)
    for (let i = 0; i < last; i++) {
      const curve = (new Bezier(bezierArray(points, i, locked)).offset(verticalOffset))
      carcassLines.push(...curve.map((elm) => elm.points))
    }
    // конвертируем сегменты кривой в точки кривой
    last = carcassLines.length
    const indEnd = last - 1
    for (let i = 0; i < last; i++) {
      const x = carcassLines[i][0].x
      const y = carcassLines[i][0].y
      if (i === 0) {
        // для замкнутых кривых берем данные из последнего сегмента
        cp1 = locked ? { x: carcassLines[indEnd][2].x, y: carcassLines[indEnd][2].y } : { x, y }
      } else {
        cp1 = { x: carcassLines[i - 1][2].x, y: carcassLines[i - 1][2].y }
      }
      cp2 = { x: carcassLines[i][1].x, y: carcassLines[i][1].y }
      carcassPoints.push({ x, y, cp1, cp2 })
    }
    if (!locked && last > 0) { // для незамкнутых кривых добавляем последнюю точку
      const x = carcassLines[indEnd][3].x
      const y = carcassLines[indEnd][3].y
      cp1 = { x: carcassLines[indEnd][2].x, y: carcassLines[indEnd][2].y }
      cp2 = { x, y }
      carcassPoints.push({ x, y, cp1, cp2 })
    }
  } else {
    carcassPoints = getShiftedPoints(points, verticalOffset, locked) // каркас смещенная ломанной со всеми точками
  }
  return carcassPoints
}
// смещение линии
const shiftLine = (points, verticalOffset = 0, bezier = false, locked = false) => {
  let carcassPoints = points
  const carcassLines = [] // каркас кривой со всеми точками
  let last = carcassPoints.length - Number(!locked)
  if (bezier) {
    for (let i = 0; i < last; i++) {
      if (verticalOffset) {
        const curve = (new Bezier(bezierArray(carcassPoints, i, locked)).offset(verticalOffset))
        carcassLines.push(...curve.map((elm) => elm.points))
      } else {
        carcassLines.push(bezierArray(carcassPoints, i, locked))
      }
    }
  } else {
    if (verticalOffset) {
      carcassPoints = getShiftedPoints(points, verticalOffset, locked) // каркас смещенная ломанной со всеми точками
    }
    last = carcassPoints.length - Number(!locked)
    for (let i = 0; i < last; i++) {
      carcassLines.push(lineArray(carcassPoints, i, locked)) // каркас ломанной со всеми точками
    }
  }
  return carcassLines
}
// построение линии по массиву сегментов
const builderPathLine = (points, bezier = false) => {
  let dAdd = ''
  const carcassLines = points
  const last = carcassLines.length
  if (last) {
    dAdd = `M${carcassLines[0][0].x} ${carcassLines[0][0].y}`
  }
  // збираєм лінію в path
  carcassLines.forEach((segment) => {
    dAdd += bezier ? `C${segment[1].x} ${segment[1].y}, ${segment[2].x} ${segment[2].y},${segment[3].x} ${segment[3].y}` : `L${segment[1].x} ${segment[1].y}`
  })
  return dAdd
}
// ---------------------------------------------------------------------------------------------------------
// построение елемента типовой линии
// отрисовка маркера(елемента) типовой линии
const addUnitLine = (
  markerSize = 1,
  p1,
  p2,
  lineType = 'blockage',
  strokeWidth = 1,
  halfElement = false) => {
  const result = ''
  const v = vector(p1, p2)
  switch (lineType) {
    case 'solidWithDots': {
      const vw = setLength(v, strokeWidth)
      // const r = strokeWidth / 2
      // return ` M${p1.x} ${p1.y} A${r} {r} 0 1 1 ${p1.x + 0.01} ${p1.y + 0.01}`
      return ` M${p1.x} ${p1.y} L${p1.x + vw.x} ${p1.y + vw.y} M${p2.x} ${p2.y} L${p2.x + vw.x} ${p2.y + vw.y}`
    }
    case 'blockage': {
      if (halfElement) {
        const n = setLength(normal(v), markerSize)
        const cp2 = apply({ x: p1.x + v.x / 2, y: p1.y + v.y / 2 }, n)
        return `L${cp2.x} ${cp2.y} L${p2.x} ${p2.y}`
      }
      return `L${p2.x} ${p2.y}`
    }
    case 'trenches' : {
      if (halfElement) {
        const n = setLength(normal(v), markerSize)
        const cp2 = apply(p1, n)
        const cp3 = apply(p2, n)
        return `L${cp2.x} ${cp2.y}L${cp3.x} ${cp3.y}L${p2.x} ${p2.y}`
      }
      return `L${p2.x} ${p2.y}`
    }
    case 'moatAntiTankUnfin':
    case 'moatAntiTank': {
      const n = setLength(normal(v), markerSize * 0.83)
      const cp3 = apply({ x: p1.x + v.x / 2, y: p1.y + v.y / 2 }, n)
      return ` M${p1.x} ${p1.y} L${cp3.x} ${cp3.y} L${p2.x} ${p2.y} Z`
    }
    case 'moatAntiTankMine1': {
      if (halfElement) {
        const n = setLength(normal(v), markerSize * 0.83)
        const cp3 = apply({ x: p1.x + v.x / 2, y: p1.y + v.y / 2 }, n)
        return `M${p2.x} ${p2.y}L${cp3.x} ${cp3.y}L${p1.x} ${p1.y} Z`
      } else {
        const r = markerSize / 4
        const vr = setLength(v, 0.01)
        const nr = setLength(normal(v), markerSize * 0.2)
        const cp1 = apply({ x: p1.x + v.x / 2, y: p1.y + v.y / 2 }, nr)
        const cp2 = apply(cp1, vr)
        return `M${cp1.x} ${cp1.y}A${r} ${r} 0 1 1 ${cp2.x} ${cp2.y}` // M${p1.x} ${p1.y}L${p2.x} ${p2.y}`
      }
    }
    case 'moatAntiTankMine': {
      const r = markerSize / 6
      const vr = setLength(v, 0.01)
      const n = setLength(normal(v), markerSize * 0.83)
      const nr = setLength(normal(v), markerSize * 0.5)
      const cp1 = apply(p2, nr)
      const cp2 = apply(cp1, vr)
      const cp3 = apply({ x: p1.x + v.x / 2, y: p1.y + v.y / 2 }, n)
      return `M${p2.x} ${p2.y}L${cp3.x} ${cp3.y}L${p1.x} ${p1.y}Z M${cp1.x} ${cp1.y}A${r} ${r} 0 1 1 ${cp2.x} ${cp2.y}`
    }
    case 'blockageIsolation': {
      const n = setLength(normal(v), markerSize)
      const cp3 = apply({ x: p1.x + v.x / 2, y: p1.y + v.y / 2 }, n)
      return `M${p1.x} ${p1.y}L${cp3.x} ${cp3.y}L${p2.x} ${p2.y}`
    }
    case 'blockageWireHigh':
    case 'blockageWireLow': {
      // основная линия снизу
      const dx = v.x / 8
      const dy = v.y / 8
      const cp1 = { x: p1.x + dx, y: p1.y + dy }
      const cp2 = { x: p2.x - dx, y: p2.y - dy }
      const n = setLength(normal(v), markerSize)
      const cp3 = apply(cp1, n)
      const cp4 = apply(cp2, n)
      return `M${cp1.x} ${cp1.y} L${cp4.x} ${cp4.y} M${cp3.x} ${cp3.y} L${cp2.x} ${cp2.y}`
    }
    case 'blockageWire':
    case 'blockageWireFence':
    case 'blockageWire1':
    case 'blockageWire2': {
      // основная линия по центру
      const dx = v.x / 8
      const dy = v.y / 8
      const dp1 = { x: p1.x + dx, y: p1.y + dy }
      const dp2 = { x: p2.x - dx, y: p2.y - dy }
      const n = setLength(normal(v), markerSize / 2)
      const nN = setLength(normal(v), -markerSize / 2)
      const cp1 = apply(dp1, n)
      const cp2 = apply(dp1, nN)
      const cp3 = apply(dp2, n)
      const cp4 = apply(dp2, nN)
      return `M${cp1.x} ${cp1.y} L${cp4.x} ${cp4.y} M${cp2.x} ${cp2.y} L${cp3.x} ${cp3.y}`
    }
    case 'blockageSpiral':
    case 'blockageSpiral2':
    case 'blockageSpiral3': {
      // основная линия снизу
      const r1 = markerSize / 3
      const r2 = markerSize / 2
      const cp1 = apply(p1, setLength(v, 0.01))
      const angleLine = angle(v)
      return `M${p1.x} ${p1.y}A${r1} ${r2} ${angleLine} 1 1 ${cp1.x},${cp1.y}`
    }
    case 'rowMinesLand': {
      const r = markerSize / 2
      const cpC = apply(p2, setLength(v, -r))
      const cp1 = apply(p2, setLength(normal(v), markerSize / 1.3)) // верх рога
      const cp2 = apply(cpC, setLength(vector(cpC, cp1), r)) // низ рога
      const cp1d = apply(cp1, setLength(v, -r / 5))
      const cp2d = apply(cp2, setLength(v, -r / 5))

      const cp3 = apply(cp1, setLength(v, -r * 2)) // верх рога
      const cp4 = apply(cpC, setLength(vector(cpC, cp3), r)) // низ рога
      const cp3d = apply(cp3, setLength(v, r / 5))
      const cp4d = apply(cp4, setLength(v, r / 5))
      // const cpA = apply(p2, setLength(v, -r * 2))
      const p2s = apply(p2, setLength(normal(v), 0.01))
      return `M${cp2.x} ${cp2.y}L${cp1.x} ${cp1.y}L${cp1d.x} ${cp1d.y}L${cp2d.x} ${cp2d.y}
        M${cp4.x} ${cp4.y}L${cp3.x} ${cp3.y}L${cp3d.x} ${cp3d.y}L${cp4d.x} ${cp4d.y}
        M${p2.x} ${p2.y}A${r} ${r} 0 1 1 ${p2s.x},${p2s.y}`
    }
    case 'rowMinesAntyTank': {
      // основная линия снизу
      const r = markerSize / 2
      const p2s = apply(p2, setLength(normal(v), 0.01))
      return `M${p2.x} ${p2.y}A${r} ${r} 0 1 1 ${p2s.x},${p2s.y}`
    }
    default:
  }
  return result
}
// -----------------------------------------------------------------------------------------------------------------
// построение типовой линии
export const blockage = (points, objectAttributes, bezier, locked, bounds, scaleOptions, zoom = -1, inverse = false,
  lineType = 'blockage', setEnd = false) => {
  if (zoom < 0) {
    zoom = settings.MAX_ZOOM
  }
  let size
  const strokeWidth = interpolateSize(zoom, scaleOptions, 10.0, 5, 20) * objectAttributes.strokeWidth / 100
  switch (lineType.slice(0, 3)) {
    case 'row':
      size = settings.ROW_MINE_SIZE // для рядів мін
      break
    case 'moa':
      size = settings.MOAT_SIZE // для рвів
      // koefStep = 1
      break
    default:
      size = settings.BLOCKAGE_SIZE // для загороджень
  }
  // шаг интерполяции равен ширене маркера приведеной к маштабу
  const scale = 1
  let markerSize = interpolateSize(zoom, size, scale, settings.MIN_ZOOM, settings.MAX_ZOOM)
  const lineLen = lineLength(points, locked)
  let creases = `M${points[0].x} ${points[0].y}`
  if (lineLen <= markerSize * 3) { // нам нужно по крайней мере 3 маркера, чтобы было видно тип линии
    points.forEach((p, i) => i && (creases += addLineTo(p)))
    return creases
  }
  let dAdd = '' // додаткова лінія
  const insideMap = getBoundsFunc(bounds, markerSize)
  if (lineType === 'blockageWireHigh' || lineType === 'blockageSpiral3') {
    // додаєм додаткову лінію зверху
    const mLine = shiftLine(points, -markerSize, bezier, locked)
    dAdd = builderPathLine(mLine, bezier)
  } else if (lineType === 'blockageSpiral2') {
    // додаєм додаткову лінію по середені
    const mLine = shiftLine(points, -markerSize / 2, bezier, locked)
    dAdd = builderPathLine(mLine, bezier)
  }
  // строим только маркеры к линии
  let markerStep = [ 1 ] // коэфициент шага между маркерами линии (целое число)
  let offsetM = -markerSize / 2 // маркер прорисовываем с отступом в пол символа
  let step = markerSize
  if (lineType === 'blockageWire1') {
    markerStep = [ 5 ]
  } else if (lineType === 'blockageWire2') {
    markerStep = [ 4, 0 ]
  } else if (lineType.slice(0, 4) === 'moat') {
    markerStep = [ 0 ]
    offsetM = -markerSize // маркер прорисовываем с самого начала линии
  } else if (lineType.slice(0, 3) === 'row') {
    markerStep = [ 0 ]
    step = markerSize * 1.25
    offsetM = -step // маркер прорисовываем с самого начала линии
  } else if (lineType === 'trenches') {
    markerStep = [ 0 ]
    offsetM = -markerSize / 2 // маркер прорисовываем с самого начала линии
  } else if (lineType.slice(8, 14) === 'Spiral') {
    markerStep = [ 2 ]
    step = markerSize / 1.5
    offsetM = 0 // маркер прорисовываем отступив шаг
  } else if (lineType === 'blockage') {
    markerStep = [ 0 ]
  }
  let creasePoints
  if (lineType === 'solidWithDots') {
    // смещаем построение точек
    markerSize = markerSize / 2
    const verticalOffset = -markerSize / 1.5
    const shiftPoints = shiftPointsToPoints(points, verticalOffset, bezier, locked)
    creasePoints = buildPeriodicPoints(markerSize, 0, -markerSize, shiftPoints, bezier, locked, insideMap)
  } else {
    creasePoints = buildPeriodicPoints(step, 0, offsetM, points, bezier, locked, insideMap)
  }
  // Начало линии сдвинуто, дотягиваем до начала отрисовки знаков линии
  if (lineType === 'trenches' || lineType === 'blockage') {
    creases += `L${creasePoints[0].x} ${creasePoints[0].y}`
  }
  const kolStep = markerStep.length || 0
  for (let i = 1; i < creasePoints.length; i += (1 + markerStep[i % kolStep])) {
    creases += addUnitLine(markerSize, creasePoints[i - 1], creasePoints[i], lineType, strokeWidth, i % 2)
  }
  // дотягиваемся до конечной точки
  if (setEnd) {
    creases += locked ? `L${points[0].x} ${points[0].y}` : `L${points[points.length - 1].x} ${points[points.length - 1].y}`
  }
  return `${dAdd} ${creases}`
}

export const stroked = (points, objectAttributes, bezier, locked, bounds = null, scale = 1, zoom = 1) => {
  if (zoom < 0) {
    zoom = settings.MAX_ZOOM
  }
  const strokeStep = interpolateSize(zoom, settings.STROKE_SIZE, scale, settings.MIN_ZOOM, settings.MAX_ZOOM)
  const strokeSize = strokeStep // settings.STROKE_SIZE * scale
  const strokes = []
  const insideMap = getBoundsFunc(bounds, strokeStep)
  const strokePoints = buildPeriodicPoints(strokeStep, 0, getLineEnd(objectAttributes, 'left') ? -1 : -strokeStep / 2,
    points, bezier, locked, insideMap, getNodes(objectAttributes.nodalPointIcon)).filter(({ i, o }) => i && o)
  for (let i = 0; i < strokePoints.length; i++) {
    const p = apply(strokePoints[i], setLength(strokePoints[i].n, -strokeSize))
    if (i < strokePoints.length - 1 ||
      dist(strokePoints[i], points[points.length - 1]) > strokeStep / 2
    ) {
      strokes.push(` M${strokePoints[i].x} ${strokePoints[i].y} L${p.x} ${p.y}`)
    }
  }
  return strokes.join(' ')
}

const add = ({ x, y }, dx, dy) => ({ x: x + dx, y: y + dy })
const rotate = ({ x, y }, originX, originY, angle) => {
  angle = angle * Math.PI / 180.0
  return {
    x: Math.cos(angle) * (x - originX) - Math.sin(angle) * (y - originY) + originX,
    y: Math.sin(angle) * (x - originX) + Math.cos(angle) * (y - originY) + originY,
  }
}

const getTextAmplifiers = ({
  points,
  amplifier,
  amplifierType,
  getOffset,
  getRotate,
  level,
  scale,
  zoom,
}) => {
  const fontSize = interpolateSize(zoom, settings.TEXT_AMPLIFIER_SIZE, scale)
  const graphicSize = interpolateSize(zoom, settings.GRAPHIC_AMPLIFIER_SIZE, scale)
  const amplifierMargin = settings.AMPLIFIERS_WINDOW_MARGIN * scale
  const result = {
    maskPath: [],
    group: '',
  }

  if (!amplifier) {
    return result
  }

  points.forEach((point, index) => {
    // const isLast = points[index] === points.length - 1
    const amplifiers = [ ...amplifier.entries() ].map(([ type, value ]) => {
      if (type === 'middle' && amplifierType === 'level' && level) {
        return [ type, [ extractSubordinationLevelSVG(
          level,
          graphicSize,
          settings.AMPLIFIERS_WINDOW_MARGIN * scale,
        ) ] ]
      }

      if (type === 'middle' && (amplifierType === 'arrow' || amplifierType === 'arrowfilled') && level) {
        return [ type, drawIntermediateArrow(amplifierType, graphicSize) ]
      }

      if (!value) {
        return null // canceling render of a text amplifier
      }

      return [ type, extractTextSVG({
        string: value,
        fontSize,
        margin: amplifierMargin,
        scale,
        getOffset: getOffset.bind(null, type, point),
      }) ]
    }).filter(Boolean)

    amplifiers.forEach(([ type, amplifiers ]) => {
      amplifiers.forEach((amplifier) => {
        let { x, y, r } = point
        r = getRotate?.(type, r, amplifierType) ?? r
        if (amplifier.maskRect) {
          result.maskPath.push(
            pointsToD(rectToPoints(amplifier.maskRect).map((point) => {
              const movedPoint = add(point, x, y)
              if (R.isNil(r) || r === 0) {
                return movedPoint
              }
              return rotate(movedPoint, x, y, r)
            }), true),
          )
        }
        result.group += `<g
          stroke-width="${settings.AMPLIFIERS_STROKE_WIDTH}"
          transform="translate(${x},${y}) rotate(${r})"
          font-weight="bold"
       >${amplifier.sign}</g>`
      })
    })
  })

  return result
}

const getOffsetForIntermediateAmplifier = (type, point, lineWidth, lineHeight, numberOfLines) => {
  switch (type) {
    case 'top':
      return { y: -lineHeight * numberOfLines - lineHeight / 2 }
    case 'middle':
      return { y: -lineHeight * numberOfLines / 2 }
    case 'bottom':
      return { y: lineHeight / 2 }
    default:
      break
  }
}

const getOffsetForNodalPointAmplifier = function (type, point, lineWidth, lineHeight, numberOfLines) {
  let t = point.t === 0 ? -1 : 1
  if (Math.abs(point.r) > 90) {
    t = -t
  }
  const half = lineWidth / 2
  const offsetObject = getOffsetForIntermediateAmplifier(...arguments)
  switch (type) {
    case 'top':
      offsetObject.x = half * t
      break
    case 'middle': {
      offsetObject.x = -(half + lineHeight / 3) * t
      break
    }
    case 'bottom':
      offsetObject.x = half * t
      break
    default:
      break
  }
  return offsetObject
}

const getRotateForLineAmplifier = (amplifierType, pointRotate) => {
  if (Math.abs(pointRotate) > 90) {
    return pointRotate - 180
  }
}

const getRotateForIntermediateAmplifier = (amplifierType, pointRotate, intermediateType) => {
  if (amplifierType === 'middle' && (intermediateType === 'arrow' || intermediateType === 'arrowfilled')) {
    return pointRotate
  }
  if (Math.abs(pointRotate) > 90) {
    return pointRotate - 180
  }
}

export const getAmplifiers = ({
  points,
  bezier,
  locked,
  bounds,
  scale = 1,
  zoom = -1,
}, object) => {
  const result = {
    maskPath: [],
    group: '',
  }
  if (!object) {
    return result
  }
  const {
    intermediateAmplifierType,
    intermediateAmplifier,
    shownIntermediateAmplifiers,
    shownNodalPointAmplifiers,
    pointAmplifier,
    nodalPointIcon,
  } = object.attributes
  const { level } = object

  if (zoom < 0) {
    zoom = settings.MAX_ZOOM
  }
  const interpolatedNodeSize = interpolateSize(zoom, settings.NODES_SIZE, scale)
  const insideMap = getBoundsFunc(bounds, settings.AMPLIFIERS_SIZE * scale)

  {
    const segments = [ ...new Array(points.length - Number(!locked)) ].map((_, index) => index)
    const { maskPath, group } = getTextAmplifiers({
      level,
      scale,
      zoom,
      amplifier: intermediateAmplifier,
      amplifierType: intermediateAmplifierType,
      points: buildPoints(
        points,
        segments,
        () => 0.5,
        bezier,
        locked,
      ).filter((point, index) => insideMap(point) && shownIntermediateAmplifiers.has(index)),
      getOffset: getOffsetForIntermediateAmplifier,
      getRotate: getRotateForIntermediateAmplifier,
    })
    result.maskPath.push(...maskPath)
    result.group += group
  }

  {
    const segments = [ 0, points.length - Number(!locked) - 1 ]

    let amplifierOptions

    if (locked) {
      const centroid = getPolygonCentroid(points)
      centroid.r = 0
      amplifierOptions = {
        points: insideMap(centroid) ? [ centroid ] : [],
        getOffset: getOffsetForIntermediateAmplifier,
      }
    } else {
      amplifierOptions = {
        points: buildPoints(
          points,
          segments,
          (index) => index === 0 ? 0 : 1,
          bezier,
          locked,
        ).filter(insideMap),
        getOffset: getOffsetForNodalPointAmplifier,
        getRotate: (amplifierType, pointRotate) => {
          return amplifierType !== 'middle'
            ? getRotateForLineAmplifier(amplifierType, pointRotate)
            : 0
        },
      }
    }

    if (amplifierOptions.points.length) {
      const { maskPath, group } = getTextAmplifiers({
        level,
        scale,
        zoom,
        amplifier: pointAmplifier,
        ...amplifierOptions,
      })
      result.maskPath.push(...maskPath)
      result.group += group
    }
  }

  points = points.filter((point, index) => insideMap(point) && shownNodalPointAmplifiers.has(index))

  switch (nodalPointIcon) {
    case 'cross-circle': {
      const d = Number((interpolatedNodeSize * Math.sqrt(2) * scale / 4).toFixed(2))
      points.forEach(({ x, y }) => {
        result.maskPath.push(circleToD(interpolatedNodeSize * scale / 2, x, y))
        result.group += `<g stroke-width="${settings.NODES_STROKE_WIDTH * scale}" fill="none" transform="translate(${x},${y})">
            <circle cx="0" cy="0" r="${interpolatedNodeSize * scale / 2}" />
            <path d="M${-d} ${-d} l${d * 2} ${d * 2} M${-d} ${d} l${d * 2} ${-d * 2}" />
          </g>`
      })
      break
    }
    case 'square': {
      const d = interpolatedNodeSize * scale / 2
      points.forEach(({ x, y }) => {
        result.maskPath.push(pointsToD(
          rectToPoints({ x: -d, y: -d, width: d * 2 }).map((point) => add(point, x, y)),
          true,
        ))
        result.group += `<g stroke-width="${settings.NODES_STROKE_WIDTH * scale}" fill="none" transform="translate(${x},${y})">
            <rect x="${-d}" y="${-d}" width="${d * 2}" height="${d * 2}" />
          </g>`
      })
      break
    }
    default:
      break
  }
  /* if (result.maskPath.length) {
    result.maskPath.push(`M${bounds.min.x} ${bounds.min.y}H${bounds.max.x}V${bounds.max.y}H${bounds.min.x} z`)
  } */
  return result
}

export const drawLineEnd = (type, { x, y }, angle, scale, strokeWidth = 0, strokeColor = 'black') => {
  let res = `<g stroke-width="2" transform="translate(${x},${y}) rotate(${angle}) scale(${scale})">`
  switch (type) {
    case MARK_TYPE.ARROW_90:
      res += `<path fill="none" d="M8-8 l-8,8 8,8"/>`
      break
    case MARK_TYPE.ARROW_45:
      res += `<path fill="none" d="M10-5 l-10,5 10,5"/>`
      break
    case MARK_TYPE.ARROW_30:
      res += `<path fill="none" d="M12-3 l-12,3 12,3"/>`
      break
    case MARK_TYPE.ARROW_30_FILL:
      res += `<path stroke-width="0" fill="${strokeColor}" d="M${-strokeWidth},0l13-4v8z"/>`
      break
    case 'arrow1':
      res += `<path fill="none" d="M6,-8 l-8,8 8,8"/>`
      break
    case 'arrow2':
      res += `<path d="M9,-6 l-12,6 l12,6 Z"/>`
      break
    case 'arrow3':
      res += `<path fill="none" stroke-width="2" d="M8,-10 l-10,10 10,10 0,5 -15,-15 15,-15 0,5 Z"/>`
      break
    case 'arrow4':
      res += `<path fill="none" stroke-width="2" d="M6,-8 l-8,8 8,8 M6,-12 l-3,3 m-1.5,1.5 l-3,3 m-1.5,1.5 l-3,3 3,3 m1.5,1.5 l3,3 m1.5,1.5 l3,3"/>`
      break
    case 'stroke1':
      res += `<path d="M0,-8 v16"/>`
      break
    case 'stroke2':
      res += `<path d="M-4,-6 l6,12"/>`
      break
    case 'stroke3':
      res += `<path d="M2,-6 l-6,12"/>`
      break
    case 'fork':
      res += `<path fill="none" d="M-8,-8 l8,8 -8,8"/>`
      break
    case 'cross':
      res += `<path fill="none" stroke-width="2" d="M-6,-12 l12,24 m-12,0 l12,-24"/>`
      break
    default:
      break
  }
  return `${res}</g>`
}

export const getStylesForLineType = (type, scale = 1) => {
  const styles = {
    strokeDasharray: null,
  }
  switch (type) {
    case 'chain': {
      styles.strokeDasharray = [ 6, 3, 2, 3 ]
      break
    }
    case 'dashed': {
      styles.strokeDasharray = [ 6, 6 ]
      break
    }
    default: {
      break
    }
  }
  if (styles.strokeDasharray) {
    styles.strokeDasharray = styles.strokeDasharray.map((i) => i * scale).join(' ')
  }
  return styles
}

export const getLineEnds = (points, objectAttributes, bezier, scale, zoom = 1) => {
  const leftEndType = getLineEnd(objectAttributes, 'left')
  const rightEndType = getLineEnd(objectAttributes, 'right')
  const graphicSize = interpolateSize(zoom, settings.GRAPHIC_AMPLIFIER_SIZE, 1) / 12
  if (!leftEndType && !rightEndType) {
    return { left: null, right: null }
  }
  let leftPlus = points[1]
  let rightMinus = points[points.length - 2]
  if (bezier) {
    const bl = new Bezier(...bezierArray(points, 0, false))
    const br = new Bezier(...bezierArray(points, points.length - 2, false))
    const ll = bl.length()
    const lr = br.length()
    const pl = ll > 40 ? 20 / ll : 0.5
    const pr = lr > 40 ? (lr - 20) / lr : 0.5
    leftPlus = bl.get(pl)
    rightMinus = br.get(pr)
  }
  return {
    left: drawLineEnd(
      leftEndType,
      points[0],
      angle(vector(points[0], leftPlus)),
      graphicSize,
    ),
    right: drawLineEnd(
      rightEndType,
      points[points.length - 1],
      angle(vector(points[points.length - 1], rightMinus)),
      graphicSize,
    ),
  }
}

export const drawLineHatch = (layer, scale, hatch) => {
  if (hatch === 'left-to-right') {
    const cs = settings.CROSS_SIZE * scale
    const sw = settings.STROKE_WIDTH * scale
    const code = layer.object.id
    const hatchColor = evaluateColor(layer.object?.attributes?.fill) || 'black'
    const fillId = `SVG-fill-pattern-${code}`
    const fillColor = `url('#${fillId}')`
    // const color = result.layer._path.getAttribute('stroke')
    layer._path.setAttribute('fill', fillColor)
    layer._path.setAttribute('fill-opacity', 1)
    layer._path.setAttribute('width', 100)
    layer.options.fillColor = fillColor
    layer.options.fillOpacity = 1
    return ` 
      <pattern id="${fillId}" x="0" y="0" width="${cs}" height="${cs}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="${0}" y1="${0}" x2=${0} y2=${cs} stroke="${hatchColor}" stroke-width="${sw}" />
      </pattern>`
  } else {
    layer._path.setAttribute('fill', evaluateColor(layer.object?.attributes?.fill) || 'transparent')
    layer._path.setAttribute('fill-opacity', 0.2)
    layer.options.fillColor = layer.object?.attributes?.fill || 'transparent'
    layer.options.fillOpacity = 0.2
  }
  return ''
}

const drawIntermediateArrow = (amplifierType, graphicSize) => {
  const scale = graphicSize / 24
  switch (amplifierType) {
    case 'arrow':
      return [ { sign: `<path fill="none" transform="scale(${scale})" d="M16,16l-16-16l16-16"/>` } ]
    case 'arrowfilled':
      return [ { sign: `<path transform="scale(${scale})" d="M24,8l-24-8l24-8z"/>` } ]
    default:
  }
  return null
}
