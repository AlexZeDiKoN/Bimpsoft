import Bezier from 'bezier-js'

const EPSILON = 1e-12

const isZero = (val) => val >= -EPSILON && val <= EPSILON

// TODO: breaks the work of a quadratic bezier curve. Need to fix
Bezier.prototype.derivative = function (t) {
  // Do not produce results if parameter is out of range or invalid.
  if (t == null || t < 0 || t > 1) {
    return null
  }
  const x0 = this.points[0].x
  const y0 = this.points[0].y

  let x1 = this.points[1].x
  let y1 = this.points[1].y

  let x2 = this.points[2].x
  let y2 = this.points[2].y

  const x3 = this.points[3].x
  const y3 = this.points[3].y
  // If the curve handles are almost zero, reset the control points to the
  // anchors.
  if (isZero(x1 - x0) && isZero(y1 - y0)) {
    x1 = x0
    y1 = y0
  }
  if (isZero(x2 - x3) && isZero(y2 - y3)) {
    x2 = x3
    y2 = y3
  }

  // Calculate the polynomial coefficients.
  const cx = 3 * (x1 - x0)
  const cy = 3 * (y1 - y0)
  const bx = 3 * (x2 - x1) - cx
  const by = 3 * (y2 - y1) - cy
  const ax = x3 - x0 - cx - bx
  const ay = y3 - y0 - cy - by
  let x, y
  const tMin = 1e-8 // CURVETIME_EPSILON
  const tMax = 1 - tMin
  // Prevent tangents and normals of length 0:
  // https://stackoverflow.com/questions/10506868/
  if (t < tMin) {
    x = cx
    y = cy
  } else if (t > tMax) {
    x = 3 * (x3 - x2)
    y = 3 * (y3 - y2)
  } else {
    x = (3 * ax * t + 2 * bx) * t + cx
    y = (3 * ay * t + 2 * by) * t + cy
  }
  // When the tangent at t is zero and we're at the beginning
  // or the end, we can use the vector between the handles,
  // but only when normalizing as its weighted length is 0.
  if (x === 0 && y === 0 && (t < tMin || t > tMax)) {
    x = x2 - x1
    y = y2 - y1
  }

  return { y, x }
}
