import Bezier from 'bezier-js'
import subordinationLevels from '../../constants/SubordinationLevel'
import { interpolateSize } from '../../components/WebMap/patch/utils/helpers'
import { extractSubordinationLevelSVG } from './milsymbol'

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
  // Важливо! Для кращого відображення хвилястої лінії разом з ампліфікаторами, бажано щоб константа AMPLIFIERS_STEP
  // була строго кратною WAVE_SIZE
  WAVE_SIZE: { min: 6, max: 180 }, // (пікселів) ширина "хвилі" для хвилястої лінії
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
}

const dist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y)
const vector = (ps, pf) => ({ x: pf.x - ps.x, y: pf.y - ps.y })
const normal = (v) => ({ x: +v.y, y: -v.x })
const length = (v) => Math.hypot(v.x, v.y)
const multiply = (v, k) => ({ x: v.x * k, y: v.y * k })
const setLength = (v, l) => multiply(v, l / length(v))
const apply = (p, v) => ({ x: p.x + v.x, y: p.y + v.y })
const angle = (v) => Math.atan2(v.y, v.x) / Math.PI * 180
export const roundXY = ({ x, y }) => ({ x: Math.round(x), y: Math.round(y) })

const nextIndex = (points, index, locked) => locked && index === points.length - 1 ? 0 : index + 1

const bezierArray = (points, index, locked) => {
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
  throw new RangeError('Unexpectedly parallel vectors')
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
    return getCrossPoint(aLine, bLine)
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

const offsetCurve = (cPoints, offset) => {
  const [ p1x, p1y, cp1x, cp1y, cp2x, cp2y, p2x, p2y ] = cPoints
  const points = [ { x: p1x, y: p1y } ]
  // get rid of control points, which are located at the same place where the main ones are
  !(p1x === cp1x && p1y === cp1y) && points.push({ x: cp1x, y: cp1y })
  !(p2x === cp2x && p2y === cp2y) && points.push({ x: cp2x, y: cp2y })
  points.push({ x: p2x, y: p2y })
  return points.reduce((acc, p, i) => {
    const shifted = shiftPoint(offset, p, points[i - 1] || null, points[i + 1] || null, true)
    acc.push(shifted.x, shifted.y)
    return acc
  }, [])
}

const getBoundsFunc = ({ min, max }, step) =>
  ({ x, y }) => x > min.x - step && y > min.y - step && x < max.x + step && y < max.y + step

const getLineEnd = (lineEnds, end) => {
  const res = lineEnds && lineEnds[end]
  return res === 'none' ? null : res
}
const getNodes = (lineNodes) => lineNodes === 'none' ? null : lineNodes

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
  inverse, waveSize, waveStep,
  p1, p2,
  halfWave = false, part = 'left', addLine = false,
  addSize = !inverse
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

export const waved = (points, lineEnds, bezier, locked, bounds, scale = 1, zoom = -1, inverse = false) => {
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
    if (!inverse || !getLineEnd(lineEnds, 'left')) {
      waves = `M${wavePoints[0].x} ${wavePoints[0].y}`
    }
    for (let i = 1; i < wavePoints.length; i++) {
      if (inverse && i === wavePoints.length - 1 && getLineEnd(lineEnds, 'right')) {
        waves += addWave(inverse, waveSize, waveStep, wavePoints[i - 1], wavePoints[i], true)
      } else if (i === 1 && getLineEnd(lineEnds, 'left')) {
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
          if (getLineEnd(lineEnds, 'right')) {
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

export const stroked = (points, lineEnds, lineNodes, bezier, locked, bounds = null, scale = 1, zoom = 1) => {
  if (zoom < 0) {
    zoom = settings.MAX_ZOOM
  }
  const strokeStep = interpolateSize(zoom, settings.STROKE_SIZE, scale, settings.MIN_ZOOM, settings.MAX_ZOOM)
  const strokeSize = strokeStep // settings.STROKE_SIZE * scale
  const strokes = []
  const insideMap = getBoundsFunc(bounds, strokeStep)
  const strokePoints = buildPeriodicPoints(strokeStep, 0, getLineEnd(lineEnds, 'left') ? -1 : -strokeStep / 2,
    points, bezier, locked, insideMap, getNodes(lineNodes)).filter(({ i, o }) => i && o)
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

const getAmpSigns = (scale = 1) => subordinationLevels.list.reduce((res, { value }) => ({
  ...res,
  [value]: extractSubordinationLevelSVG(value, settings.AMPLIFIERS_SIZE * scale,
    settings.AMPLIFIERS_WINDOW_MARGIN * scale),
}), {})

export const getAmplifiers = (points, lineAmpl, level, lineNodes, bezier, locked, bounds, scale = 1, zoom = -1) => {
  if (zoom < 0) {
    zoom = settings.MAX_ZOOM
  }
  const nodeStep = interpolateSize(zoom, settings.NODES_SIZE, scale, settings.MIN_ZOOM, settings.MAX_ZOOM)
  const insideMap = getBoundsFunc(bounds, settings.AMPLIFIERS_SIZE * scale)
  const amplifiers = {
    maskPath: [],
    group: '',
  }
  if (lineAmpl === 'show-level' && level) {
    const amp = getAmpSigns(scale)[level]
    const amplPoints = buildPeriodicPoints(
      settings.AMPLIFIERS_STEP * scale,
      0,
      -settings.AMPLIFIERS_STEP / 2 * scale,
      points,
      bezier,
      locked,
      insideMap,
      getNodes(lineNodes)).filter(({ i, o }) => i && o
    )
    amplifiers.maskPath.push(...amplPoints.map(({ x, y, r }) =>
      pointsToD(rectToPoints(amp.maskRect).map((point) => rotate(add(point, x, y), x, y, r)), true)
    ))
    amplifiers.group += amplPoints.map(({ x, y, r }) =>
      `<g stroke-width="${settings.AMPLIFIERS_STROKE_WIDTH}" fill="none" transform="translate(${x},${y}) rotate(${r})">${amp.sign}</g>`
    ).join('')
  }
  switch (lineNodes) {
    case 'cross-circle': {
      const d = Number((nodeStep * Math.sqrt(2) * scale / 4).toFixed(2))
      points.filter(insideMap).forEach(({ x, y }) => {
        amplifiers.maskPath.push(circleToD(nodeStep * scale / 2, x, y))
        amplifiers.group += `<g stroke-width="${settings.NODES_STROKE_WIDTH * scale}" fill="none" transform="translate(${x},${y})">
            <circle cx="0" cy="0" r="${nodeStep * scale / 2}" />
            <path d="M${-d} ${-d} l${d * 2} ${d * 2} M${-d} ${d} l${d * 2} ${-d * 2}" />
          </g>`
      })
      break
    }
    case 'square': {
      const d = nodeStep * scale / 2
      points.filter(insideMap).forEach(({ x, y }) => {
        amplifiers.maskPath.push(pointsToD(
          rectToPoints({ x: -d, y: -d, width: d * 2 }).map((point) => add(point, x, y)),
          true
        ))
        amplifiers.group += `<g stroke-width="${settings.NODES_STROKE_WIDTH * scale}" fill="none" transform="translate(${x},${y})">
            <rect x="${-d}" y="${-d}" width="${d * 2}" height="${d * 2}" />
          </g>`
      })
      break
    }
    default:
      break
  }
  if (amplifiers.maskPath.length) {
    amplifiers.maskPath.push(`M${bounds.min.x} ${bounds.min.y}H${bounds.max.x}V${bounds.max.y}H${bounds.min.x} z`)
  }
  return amplifiers
}

const drawLineEnd = (type, { x, y }, angle) => {
  let res = `<g stroke-width="3" transform="translate(${x},${y - 6}) rotate(${angle},0,6)">`
  switch (type) {
    case 'arrow1':
      res += `<path fill="none" d="M8,-2 l-8,8 8,8"/>`
      break
    case 'arrow2':
      res += `<path d="M12,0 l-12,6 l12,6 z"/>`
      break
    case 'arrow3':
      res += `<path fill="none" stroke-width="2" d="M10,-4 l-10,10 10,10 0,5 -15,-15 15,-15 0,5"/>`
      break
    case 'arrow4':
      res += `<path fill="none" stroke-width="2" d="M8,-2 l-8,8 8,8 M8,-6 l-3,3 m-1.5,1.5 l-3,3 m-1.5,1.5 l-3,3 3,3 m1.5,1.5 l3,3 m1.5,1.5 l3,3"/>`
      break
    case 'stroke1':
      res += `<path d="M0,-2 v16"/>`
      break
    case 'stroke2':
      res += `<path d="M-3,0 l6,12"/>`
      break
    case 'stroke3':
      res += `<path d="M3,0 l-6,12"/>`
      break
    case 'fork':
      res += `<path fill="none" d="M-8,-2 l8,8 -8,8"/>`
      break
    case 'cross':
      res += `<path fill="none" stroke-width="2" d="M-6,-6 l12,24 m-12,0 l12,-24"/>`
      break
    default:
      break
  }
  return `${res}</g>`
}

export const getLineEnds = (points, lineEnds, bezier) => {
  const result = { left: null, right: null }
  const leftEndType = getLineEnd(lineEnds, 'left')
  const rightEndType = getLineEnd(lineEnds, 'right')
  if (!leftEndType && !rightEndType) {
    return result
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
    left: drawLineEnd(leftEndType, points[0], angle(vector(points[0], leftPlus))),
    right: drawLineEnd(rightEndType, points[points.length - 1], angle(vector(points[points.length - 1], rightMinus))),
  }
}
