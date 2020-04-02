/* global L */
import { utils } from '@DZVIN/CommonComponents'
import { Earth } from 'leaflet/src/geo/crs/CRS.Earth'
const { Coordinates: Coord } = utils

export function angleDegCheck (angle) {
  return Number.isFinite(Number(angle)) && (Math.abs(angle) < 360)
}

/* Вращение вокруг координатной оси
 * Аргументы: x - входной/выходной 3-вектор
 *            a - угол вращения
 *            i - номер координатной оси (0..2) */
function rotate (x, a, i) {
  const j = (i + 1) % 3
  const k = (i - 1) % 3
  const c = Math.cos(a)
  const s = Math.sin(a)
  const xj = x[j] * c + x[k] * s
  x[k] = -x[j] * s + x[k] * c
  x[j] = xj
  return [ ...x ]
}

/* Преобразование сферических координат в вектор
 * Аргументы исходные:  y - {широта, долгота}
 * Аргументы определяемые:   x - вектор {x, y, z} */
function spherToCart (y) {
  const p = Math.cos(y[0])
  return [ p * Math.cos(y[1]), p * Math.sin(y[1]), Math.sin(y[0]) ]
}

/* Преобразование вектора в сферические координаты
 * Аргументы исходные:  x - {x, y, z}
 * Аргументы возвращаемые:  y - {широта, долгота}
 * не возвращаем пока: длину вектора
 */
function cartToSpher (x) {
  const p = Math.sqrt(x[0] * x[0] + x[1] * x[1])
  // const dist = Math.sqrt(p * p + x[2] * x[2])
  return [ Math.atan2(x[2], p), Math.atan2(x[1], x[0]) ]
}
/* Решение прямой геодезической задачи
 * Аргументы исходные:
 *     pt1  - {широта, долгота} точки Q1
 *     azi  - азимут начального направления
 *     dist - расстояние 'м' метрах, переводим в сферическое
 * возвращаем  - {широта, долгота} точки Q2 */
export function sphereDirect (pt0, angledeg, distM) {
  let x
  const dist = distM / Earth.R
  const azi = angledeg * Math.PI / 180 // в радианы
  const lat = pt0.lat * Math.PI / 180
  const lng = pt0.lng * Math.PI / 180
  const pt = [ Math.PI / 2 - dist, Math.PI - azi ]
  x = spherToCart(pt) // сферические -> декартовы
  x = rotate(x, lat - Math.PI / 2, 1) // первое вращение
  x = rotate(x, -lng, 2) // второе вращение
  const pt1 = cartToSpher(x) // декартовы -> сферические
  return { lat: (pt1[0] * 180 / Math.PI), lng: (pt1[1] * 180 / Math.PI) }
}

export function moveCoordinate (pt0, distM, angleDeg) {
  let x
  const dist = distM / Earth.R
  const GtoR = Math.PI / 180
  const azi = angleDeg * GtoR // в радианы
  const lat = pt0.lat * GtoR
  const lng = pt0.lng * GtoR
  const pt = [ Math.PI / 2 - dist, Math.PI - azi ]
  x = spherToCart(pt) // сферические -> декартовы
  x = rotate(x, lat - Math.PI / 2, 1) // первое вращение
  x = rotate(x, -lng, 2) // второе вращение
  const ptNew = cartToSpher(x) // декартовы -> сферические
  return { lat: (ptNew[0] * 180 / Math.PI), lng: (ptNew[1] * 180 / Math.PI) }
}

//
// function sphereInverse (pt1, pt2) {
//   let x = spherToCart(pt2)
//   x = rotate(x, pt1[1], 2)
//   x = rotate(x, Math.PI / 2 - pt1[0], 1)
//   const pt = cartToSpher(x)
//   const azi = Math.PI - pt[1]
//   const dist = Math.PI / 2 - pt[0]
//
//   return { azi, dist }
// }
//
// function sphereLinear (pt1, pt2, dist13, dist23, clockwise) {
//   if (dist13 === 0) { // Решение - точка Q1.
//     return [ pt1[0], pt1[1] ]
//   } else if (dist23 === 0) { // Решение - точка Q2.
//     return [ pt2[0], pt2[1] ]
//   }
//   const si = sphereInverse(pt1, pt2)
//   const azi12 = si.azi
//   const dist12 = si.dist
//
//   const cosBeta1 = (Math.cos(dist23) - Math.cos(dist12) * Math.cos(dist13)) / (Math.sin(dist12) * Math.sin(dist13))
//   if (Math.abs(cosBeta1) > 1.0) { // Решение не существует.
//     return null
//   }
//   const azi13 = clockwise ? azi12 + Math.acos(cosBeta1) : azi12 - Math.acos(cosBeta1)
//   return sphereDirect(pt1, azi13, dist13)
// }
//
// function sphereAngular (pt1, pt2, azi13, azi23) {
//   let dist12
//   let sphereInv = sphereInverse(pt2, pt1)
//   let pt3 = []
//   const azi21 = sphereInv.azi
//   dist12 = sphereInv.dist
//   sphereInv = sphereInverse(pt1, pt2)
//   const azi12 = sphereInv.azi
//   dist12 = sphereInv.dist
//   let cosBeta1 = Math.cos(azi13 - azi12)
//   let sinBeta1 = Math.sin(azi13 - azi12)
//   let cosBeta2 = Math.cos(azi21 - azi23)
//   let sinBeta2 = Math.sin(azi21 - azi23)
//   const cosDist12 = Math.cos(dist12)
//   const sinDist12 = Math.sin(dist12)
//
//   if (sinBeta1 === 0 && sinBeta2 === 0) { // Решение - любая точка
//     return pt3
//   } else if (sinBeta1 === 0.0) { // на большом круге Q1-Q2.
//     return [ pt2[0], pt2[1] ] // Решение - точка Q2.
//   } else if (sinBeta2 === 0) { // Решение - точка Q1.
//     return [ pt1[0], pt1[1] ]
//   } else if (sinBeta1 * sinBeta2 < 0.0) { // Лучи Q1-Q3 и Q2-Q3 направлены
//     if (Math.abs(sinBeta1) >= Math.abs(sinBeta2)) { //   в разные полусферы.
//       cosBeta2 = -cosBeta2 // Выберем ближайшее решение:
//       sinBeta2 = -sinBeta2 //   развернём луч Q2-Q3 на 180°;
//     } else { //     иначе
//       cosBeta1 = -cosBeta1 //   развернём луч Q1-Q3 на 180°.
//       sinBeta1 = -sinBeta1
//     }
//   }
//   const dist13 = Math.atan2(Math.abs(sinBeta2) * sinDist12,
//     cosBeta2 * Math.abs(sinBeta1) + Math.abs(sinBeta2) * cosBeta1 * cosDist12)
//   pt3 = sphereDirect(pt1, azi13, dist13)
//   return pt3
// }
// --------------------------------------------------------------------------------

export function distanceBetweenCoord (coord1, coord2) { // rad - радиус сферы (Земли)
  const rad = Earth.R
  if (!Coord.check(coord1) || !Coord.check(coord2)) {
    return undefined
  }
  const lat1 = coord1.lat * Math.PI / 180.0
  const lat2 = coord2.lat * Math.PI / 180.0
  const long1 = coord1.lng * Math.PI / 180.0
  const long2 = coord2.lng * Math.PI / 180.0
  const cl1 = Math.cos(lat1)
  const cl2 = Math.cos(lat2)
  const sl1 = Math.sin(lat1)
  const sl2 = Math.sin(lat2)
  const delta = long2 - long1
  const cdelta = Math.cos(delta)
  const sdelta = Math.sin(delta)

  const y = Math.sqrt(Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2))
  const x = sl1 * sl2 + cl1 * cl2 * cdelta
  const ad = Math.atan2(y, x)
  return ad * rad
}

export function distanceAngle (coord1, coord2) { // rad - радиус сферы (Земли)
  // const rad = 6372795
  const rad = Earth.R
  if (!Coord.check(coord1) || !Coord.check(coord2)) {
    return { angledeg: 0, distance: 0 }
  }
  const lat1 = coord1.lat * Math.PI / 180.0
  const lat2 = coord2.lat * Math.PI / 180.0
  const long1 = coord1.lng * Math.PI / 180.0
  const long2 = coord2.lng * Math.PI / 180.0
  const cl1 = Math.cos(lat1)
  const cl2 = Math.cos(lat2)
  const sl1 = Math.sin(lat1)
  const sl2 = Math.sin(lat2)
  const delta = long2 - long1
  const cdelta = Math.cos(delta)
  const sdelta = Math.sin(delta)

  let y = Math.sqrt(Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2))
  let x = sl1 * sl2 + cl1 * cl2 * cdelta
  const ad = Math.atan2(y, x)
  const distance = ad * rad

  // вычисление  начального  азимута
  x = (cl1 * sl2) - (sl1 * cl2 * cdelta)
  y = sdelta * cl2
  const zr = Math.atan2(-y, x)
  const z = zr * 180.0 / Math.PI // перевод в градусы
  return { angledeg: ((z < 0) ? -z : (360.0 - z)), distance }
  // if (x < 0) {
  //   z = z + 180.0
  // }
  // let z2 = (z + 180.0) % 360.0 - 180.0
  // z2 = -(z2 * Math.PI / 180) // перевод в радианы
  // const anglerad2 = z2 - ((2 * Math.PI) * Math.floor((z2 / (2 * Math.PI))))
  // const angledeg = (anglerad2 * 180.0) / Math.PI
  // return { angledeg, distance }
  // let zr2 = (zr + Math.PI) % (Math.PI * 2) - Math.PI
  // zr2 = -zr2
  // const angleradR2 = zr2 - ((2 * Math.PI) * Math.floor((zr2 / (2 * Math.PI))))
  // return { angledeg: (angleradR2 * 180.0) / Math.PI, distance }
}
//
// function getazimut (coordinatesArray) {
//   const coord1 = coordinatesArray[1]
//   const coord2 = coordinatesArray[0]
//   const pi = Math.PI
//   const pi2 = Math.PI / 2
//   const long1 = coord1.lng * pi / 180
//   const long2 = coord2.lng * pi / 180
//   const lat1 = coord1.lat * pi / 180
//   const lat2 = coord2.lat * pi / 180
//   let dlonW = (long2 - long1) - (2 * pi * Math.floor((long2 - long1) / (2 * pi)))
//   const dlonE = (long1 - long2) - (2 * pi * Math.floor((long1 - long2) / (2 * pi)))
//   const dphi = Math.log(Math.tan((lat2 / 2) + (pi / 4)) / Math.tan(lat1 / 2 + pi / 4))
//   let q, sign, atn2, dlon
//   if (Math.abs(lat2 - lat1) < 0.00000001) {
//     q = Math.cos(lat1)
//   } else {
//     q = (lat2 - lat1) / dphi
//   }
//   if (dlonW < dlonE) {
//     dlonW = -dlonW
//     if (dlonW >= 0) {
//       sign = 1
//     } else {
//       sign = -1
//     }
//     if (Math.abs(dlonW) >= Math.abs(dphi)) {
//       atn2 = (sign * pi2) - Math.atan2(dphi, dlonW)
//     } else {
//       if (dphi > 0) {
//         atn2 = Math.atan2(dlonW, dphi)
//       } else {
//         if ((-1 * dlonW) >= 0) {
//           atn2 = pi + Math.atan2(dlonW, dphi)
//         } else {
//           atn2 = (-1 * pi) + Math.atan2(dlonW, dphi)
//         }
//       }
//     }
//     dlon = -dlonW
//   } else {
//     if (dlonW >= 0) {
//       sign = 1
//     } else {
//       sign = -1
//     }
//     if (Math.abs(dlonE) >= Math.abs(dphi)) {
//       atn2 = sign * pi2 - Math.atan2(dphi, dlonE)
//     } else {
//       if (dphi > 0) {
//         atn2 = Math.atan2(dlonE, dphi)
//       } else {
//         if ((dlonE) >= 0) {
//           atn2 = pi + Math.atan2(dlonE, dphi)
//         } else {
//           atn2 = (-1 * pi) + Math.atan2(dlonE, dphi)
//         }
//       }
//     }
//     dlon = dlonE
//   }
//   const tc = atn2 - (2 * pi * Math.floor((atn2) / (2 * pi)))
//   const dist = Math.sqrt((q * q) * (dlon * dlon) + ((lat2 - lat1) * (lat2 - lat1)))
//   // результат - угол в градусах
//   const tcdeg = (tc * 180) / pi
//   // результат - расстояние в метрах
//   const distm = dist * 6372795
//   const reslist = { tcdeg, distm }
//   return reslist
// }

export function radiusFromCoordinates (coordinatesArray) {
  const coord1 = coordinatesArray[0]
  let radius = 0
  if (Coord.check(coord1)) {
    const coord2 = coordinatesArray[1]
    if (Coord.check(coord2)) {
      const corner1 = L.latLng(coord1)
      const corner2 = L.latLng(coord2)
      // const angle = corner1.angle()
      radius = Math.round(corner1.distanceTo(corner2))
    }
  }
  return radius
}
