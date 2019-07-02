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
  // console.log({ points, index, locked, next })
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

const buildPeriodicPoints = (step, offset, points, bezier, locked, insideMap, skipNodes = false) => {
  const amplPoints = []
  const last = points.length - Number(!locked)
  for (let i = 0; i < last; i++) {
    const segment = bezier
      ? new Bezier(...bezierArray(points, i, locked))
      : new Segment(...lineArray(points, i, locked))
    const length = segment.length()
    const steps = Math.min(Math.round(length), settings.LUT_STEPS)
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
  return amplPoints
}

const getBoundsFunc = ({ min, max }, step) =>
  ({ x, y }) => x > min.x - step && y > min.y - step && x < max.x + step && y < max.y + step

const getLineEnd = (lineEnds, end) => {
  const res = lineEnds && lineEnds[end]
  return res === 'none' ? null : res
}
const getNodes = (lineNodes) => lineNodes === 'none' ? null : lineNodes

export const waved = (points, lineEnds, bezier, locked, bounds, scale = 1, zoom = -1) => {
  if (zoom < 0) {
    zoom = settings.MAX_ZOOM
  }
  const waveStep = interpolateSize(zoom, settings.WAVE_SIZE, scale, settings.MIN_ZOOM, settings.MAX_ZOOM)
  const waveSize = waveStep / 1.5 // settings.WAVE_SIZE * scale
  const insideMap = getBoundsFunc(bounds, waveStep)
  const wavePoints = buildPeriodicPoints(waveStep, -waveStep, points, bezier, locked, insideMap)
  if (!wavePoints.length) {
    return 'M0 0'
  }
  let waves = `M${wavePoints[0].x} ${wavePoints[0].y}`
  const addLineTo = ({ x, y }) => {
    waves += ` L${x} ${y}`
  }
  const addWave = (p1, p2, addSize = true) => {
    const v = vector(p1, p2)
    const n = setLength(normal(v), waveSize + (addSize ? waveStep - length(v) : 0))
    const cp1 = apply(p1, n)
    const cp2 = apply(p2, n)
    waves += ` C${cp1.x} ${cp1.y} ${cp2.x} ${cp2.y} ${p2.x} ${p2.y}`
  }
  for (let i = 1; i < wavePoints.length; i++) {
    if (!wavePoints[i].i || (i === 1 && getLineEnd(lineEnds, 'left'))) {
      addLineTo(wavePoints[i])
    } else {
      addWave(wavePoints[i - 1], wavePoints[i])
    }
  }
  if (settings.DRAW_PARTIAL_WAVES && wavePoints.length > 0) {
    const p0 = wavePoints[wavePoints.length - 1]
    const p1 = points[points.length - 1]
    const rest = dist(p0, p1)
    if (rest >= 1) {
      if (locked) {
        addWave(p0, points[0], false)
      } else {
        if (getLineEnd(lineEnds, 'right')) {
          waves += ` L${p1.x} ${p1.y}`
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
  return `${waves}${locked ? ' Z' : ''}`
}

const buildPeriodicPoints2 = (step, offset, points, bezier, locked, insideMap, skipNodes = false) => {
  // @TODO: make buildPeriodicPoints work with waved2 type
  const amplPoints = []
  const last = points.length - Number(!locked)
  for (let i = 0; i < last; i++) {
    const segment = bezier
      ? new Bezier(...bezierArray(points, i, locked))
      : new Segment(...lineArray(points, i, locked))
    const length = segment.length()
    const steps = Math.min(Math.round(length), settings.LUT_STEPS)
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
        console.log('amplPoint', amplPoint)
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
  return amplPoints
}

// @TODO: вынести addHalfWave в отдельный метод
export const waved2 = (points, lineEnds, bezier, locked, bounds, scale = 1, zoom = -1) => {
  if (zoom < 0) {
    zoom = settings.MAX_ZOOM
  }
  console.log('__________WAVED--2_____________')
  const waveStep = interpolateSize(zoom, settings.WAVE_SIZE, scale, settings.MIN_ZOOM, settings.MAX_ZOOM)
  const waveSize = waveStep / 1.5 // settings.WAVE_SIZE * scale
  const insideMap = getBoundsFunc(bounds, waveStep)
  const wavePoints = buildPeriodicPoints2(waveStep, -waveStep, points, bezier, locked, insideMap)
  console.log('wavePoints', wavePoints)
  console.log('points', points)
  if (!wavePoints.length) {
    return 'M0 0'
  }
  const v = vector(wavePoints[0], wavePoints[1])
  const n = setLength(normal(v), waveSize * 0.75)

  let waves = getLineEnd(lineEnds, 'left') ? `M${wavePoints[0].x} ${wavePoints[0].y}` : `M${wavePoints[0].x - n.x} ${wavePoints[0].y - n.y}`
  const addLineTo = ({ x, y }) => {
    waves += ` L${x} ${y}`
  }
  console.log('waveStep', waveStep)
  const addWave = (p1, p2) => {
    const v = vector(p1, p2)
    length(v) < waveStep && console.log(`${length(v)} is LESS: `, p1, p2)
    length(v) > waveStep && console.log(`${length(v)} is MORE: `, p1, p2)
    const n = setLength(normal(v), waveSize * 0.75)
    const pp2 = { x: p2.x - n.x, y: p2.y - n.y }
    waves += ` C${p1.x + n.x / 3} ${p1.y + n.y / 3} ${p2.x + n.x / 3} ${p2.y + n.y / 3} ${pp2.x} ${pp2.y}`
  }
  for (let i = 1; i < wavePoints.length; i++) {
    if (i === wavePoints.length - 1 && getLineEnd(lineEnds, 'right')) {
      const p2 = {
        x: wavePoints[i - 1].x + (wavePoints[i].x - wavePoints[i - 1].x) * 2,
        y: wavePoints[i - 1].y + (wavePoints[i].y - wavePoints[i - 1].y) * 2,
      }
      const b = new Bezier([ wavePoints[i - 1].x, wavePoints[i - 1].y, wavePoints[i - 1].x, wavePoints[i - 1].y, p2.x, p2.y, p2.x, p2.y ])
      const p = b.split(0.5).left.points
      waves += ` C${p[1].x} ${p[1].y} ${p[2].x} ${p[2].y} ${p[3].x} ${p[3].y}`
    } else if (i === 1 && getLineEnd(lineEnds, 'left')) {
      const v = vector(wavePoints[0], wavePoints[1])
      const n = setLength(normal(v), waveSize * 0.75)
      const b = new Bezier([ wavePoints[0].x - n.x, wavePoints[0].y - n.y, wavePoints[0].x + n.x / 3, wavePoints[0].y + n.y / 3, wavePoints[1].x + n.x / 3, wavePoints[1].y + n.y / 3, wavePoints[1].x - n.x, wavePoints[1].y - n.y ])
      const p = b.split(0.5).right.points
      addLineTo(p[0])
      waves += ` C${p[1].x} ${p[1].y} ${p[2].x} ${p[2].y} ${p[3].x} ${p[3].y}`
    } else if (!wavePoints[i].i) {
      addLineTo(wavePoints[i])
    } else {
      addWave(wavePoints[i - 1], wavePoints[i])
    }
  }
  if (settings.DRAW_PARTIAL_WAVES && wavePoints.length > 0) {
    const p0 = wavePoints[wavePoints.length - 1]
    const p1 = points[points.length - 1]
    const rest = dist(p0, p1)
    if (rest >= 1) {
      if (locked) {
        addWave(p0, points[0], false)
      } else {
        if (getLineEnd(lineEnds, 'right')) {
          waves += ` L${p1.x} ${p1.y}`
        } else {
          const v = vector(p0, p1)
          const n = setLength(normal(v), waveSize * 0.75)
          const p2 = {
            x: p0.x + (p1.x - p0.x) / rest * waveStep,
            y: p0.y + (p1.y - p0.y) / rest * waveStep,
          }
          const b = new Bezier([ p0.x - n.x, p0.y - n.y, p0.x + n.x / 3, p0.y + n.y / 3, p2.x + n.x / 3, p2.y + n.y / 3, p2.x - n.x, p2.y - n.y ])
          const p = b.split(rest / waveStep).left.points
          waves += ` C${p[1].x} ${p[1].y} ${p[2].x} ${p[2].y} ${p[3].x} ${p[3].y}`
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
  const strokePoints = buildPeriodicPoints(strokeStep, getLineEnd(lineEnds, 'left') ? -1 : -strokeStep / 2,
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
      res += `<path fill="none" d="M8,-2 -8,8 8,8"/>`
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
