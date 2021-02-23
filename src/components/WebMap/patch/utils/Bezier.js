import Bezier from 'bezier-js'
import { epsilon } from './helpers'

// ------------------------ Функції роботи з кривими Безьє -------------------------------------------------------------
export const prepareBezierPath = (ring, locked, skipStart, skipEnd, skipMove) =>
  prepareCurve(ring, locked === true, skipStart === true, skipEnd === true, skipMove === true)
    .join(' ') || (skipMove === true ? '' : 'M 0 0')

function prepareCurve (ring, locked, skipStart, skipEnd, skipMove) {
  const points = ring.map(({ x, y }) => [ x, y ])
  const prevIdx = (idx) => idx > 0 ? idx - 1 : points.length - 1
  const nextIdx = (idx) => idx < points.length - 1 ? idx + 1 : 0
  const pt = (pa) => ({ x: pa[0], y: pa[1] })

  let result, cp1, cp2, last, mem

  if (locked) {
    [ cp1, cp2 ] = calcControlPoint(points[prevIdx(0)], points[0], points[nextIdx(0)])
    ring[0].cp1 = pt(cp1)
    ring[0].cp2 = pt(cp2)
    last = cp1
    mem = cp2
    result = []
    if (!skipMove) {
      result = result.concat([ 'M', ...points[0] ])
    }
    for (let i = 1; i < points.length; i++) {
      [ cp1, cp2 ] = calcControlPoint(points[prevIdx(i)], points[i], points[nextIdx(i)])
      ring[i].cp1 = pt(cp1)
      ring[i].cp2 = pt(cp2)
      result = result.concat([ 'C', ...mem, ...cp1, ...points[i] ])
      mem = cp2
    }
    result = result.concat([ 'C', ...mem, ...last, ...points[0], 'Z' ])
  } else {
    ring[0].cp1 = pt(points[0])
    ring[0].cp2 = pt(points[0])
    mem = points[0]
    result = []
    if (!skipStart && !skipMove) {
      result = result.concat([ 'M', ...points[0] ])
    }
    for (let i = 1; i < points.length - 1; i++) {
      [ cp1, cp2 ] = calcControlPoint(points[i - 1], points[i], points[i + 1])
      ring[i].cp1 = pt(cp1)
      ring[i].cp2 = pt(cp2)
      if (skipStart && i === 1) {
        if (!skipMove) {
          result = result.concat([ 'M', ...points[i] ])
        }
      } else {
        result = result.concat([ 'C', ...mem, ...cp1, ...points[i] ])
      }
      mem = cp2
    }
    ring[points.length - 1].cp1 = pt(points[points.length - 1])
    ring[points.length - 1].cp2 = pt(points[points.length - 1])
    if (!skipEnd) {
      result = result.concat([ 'C', ...mem, ...points[points.length - 1], ...points[points.length - 1] ])
    }
  }
  return result
}

export function calcControlPoint (pp, pc, pn) {
  const eq = (a, b) => Math.abs(a[0] - b[0]) < epsilon && Math.abs(a[1] - b[1]) < epsilon // a[0] === b[0] && a[1] === b[1]
  const sub = (a, b) => [ b[0] - a[0], b[1] - a[1] ]
  const mul = (p, f) => [ p[0] * f, p[1] * f ]
  const add = (a, b) => [ a[0] + b[0], a[1] + b[1] ]
  const len = (p) => Math.hypot(p[0], p[1])
  const norm = (p, f) => len(p) < epsilon ? [ 0, 0 ] : mul([ p[1], -p[0] ], f / len(p)) // === 0

  if (eq(pp, pn)) { // (eq(pp, pc) && eq(pn, pc)) ||
    return [ pc, pc ]
  }
  if (eq(pp, pc)) {
    return [ pc, add(pc, mul(sub(pc, pn), 1 / 3)) ]
  }
  if (eq(pn, pc)) {
    return [ add(pc, mul(sub(pc, pp), 1 / 3)), pc ]
  }
  let dpp = sub(pc, pp)
  let dpn = sub(pc, pn)
  const lp = len(dpp)
  const ln = len(dpn)
  if (eq(dpn, dpp)) {
    return [ norm(sub(pp, pc), lp / 3), norm(dpn, ln / 3) ]
  }
  if (lp > ln) {
    if (ln > epsilon) { // !== 0
      dpn = mul(dpn, lp / ln)
    }
  } else {
    if (lp > epsilon) { // !== 0
      dpp = mul(dpp, ln / lp)
    }
  }
  const dir = sub(dpn, dpp)
  const ld = len(dir)
  const [ cpp, cpn ] = ld < epsilon ? [ [ 0, 0 ], [ 0, 0 ] ] : [ mul(dir, lp / 3 / ld), mul(dir, -ln / 3 / ld) ] // === 0
  return [ add(cpp, pc), add(cpn, pc) ]
}

function bershtainPolynom (p0, p1, p2, p3, t) {
  const ot = 1 - t
  return ot * ot * ot * p0 + 3 * t * ot * ot * p1 + 3 * t * t * ot * p2 + t * t * t * p3
}

export function bezierPoint (p0, p1, p2, p3, t) {
  return {
    x: bershtainPolynom(p0.x, p1.x, p2.x, p3.x, t),
    y: bershtainPolynom(p0.y, p1.y, p2.y, p3.y, t),
  }
}

export function halfPoint (p0, p1, p2, p3) {
  return bezierPoint(p0, p1, p2, p3, 0.5)
}

export const prepareBezierPathToGeometry = (ring, steps = 20) => {
  const points = ring.map(({ x, y }) => [ x, y ])
  const prev = (idx) => idx > 0 ? idx - 1 : points.length - 1
  const next = (idx) => idx < points.length - 1 ? idx + 1 : 0
  const pt = ([ x, y ]) => ({ x, y })

  let result, cp1, cp2, last, mem

  [ cp1, cp2 ] = calcControlPoint(points[prev(0)], points[0], points[next(0)])
  ring[0].cp1 = pt(cp1)
  ring[0].cp2 = pt(cp2)
  last = cp1
  mem = cp2
  result = [ ring[0] ]
  for (let i = 1; i < points.length; i++) {
    [ cp1, cp2 ] = calcControlPoint(points[prev(i)], points[i], points[next(i)])
    ring[i].cp1 = pt(cp1)
    ring[i].cp2 = pt(cp2)
    const i1 = new Bezier([ ...points[prev(i)], ...mem, ...cp1, ...points[i] ]).getLUT(steps)
    result = result.concat(i1)
    mem = cp2
  }
  result = result.concat(new Bezier([ ...mem, ...last, ...points[0] ]).getLUT(steps))
  return result
}
