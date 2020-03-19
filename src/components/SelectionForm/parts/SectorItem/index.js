/* global L */
import React, { Fragment } from 'react'
import { Input, Select } from 'antd'
import PropTypes from 'prop-types'
import { components, utils } from '@DZVIN/CommonComponents'
import './style.css'
import { Earth } from 'leaflet/src/geo/crs/CRS.Earth'
import { colors } from '../../../../constants'
import ColorPicker from '../../../common/ColorPicker'
import { colorOption } from '../render'

import i18n from '../../../../i18n'

const {
  icons: { IconHovered, names: IconNames },
  form: { FormItem, InputWithSuffix },
} = components

const PRESET_COLORS = Object.values(colors.values)
const COLOR_PICKER_Z_INDEX = 2000
const { Coordinates: Coord } = utils

const COORDINATE_PATH = [ 'geometry' ]

function getRadiusFromCoordinatesArray (coordinatesArray) {
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

// ---------------------------------------------------------------------------------
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
 *     dist - расстояние (сферическое)
 * возвращаем  - {широта, долгота} точки Q2 */
function sphereDirect (pt1, azi, dist) {
  let x
  const pt = [ Math.PI / 2 - dist, Math.PI - azi ]
  x = spherToCart(pt) // сферические -> декартовы
  x = rotate(x, pt1[0] - Math.PI / 2, 1) // первое вращение
  x = rotate(x, -pt1[1], 2) // второе вращение
  return cartToSpher(x) // декартовы -> сферические
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

function distanceAngle (coord) { // rad - радиус сферы (Земли)
  // const rad = 6372795
  const rad = Earth.R

  const lat1 = coord[0].lat * Math.PI / 180.0
  const lat2 = coord[1].lat * Math.PI / 180.0
  const long1 = coord[0].lng * Math.PI / 180.0
  const long2 = coord[1].lng * Math.PI / 180.0

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
  let z = Math.atan2(-y, x) * 180.0 / Math.PI

  if (x < 0) { z = z + 180 }

  let z2 = (z + 180.0) % 360.0 - 180.0
  z2 = -(z2 * Math.PI / 180)
  const anglerad2 = z2 - ((2 * Math.PI) * Math.floor((z2 / (2 * Math.PI))))
  const angledeg = (anglerad2 * 180.0) / Math.PI
  return { angledeg, distance }
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

function getCoordinatesFromRadius (coordinatesArray, radius) {
  // const coord1 = coordinatesArray[0]
  const coord2 = coordinatesArray[1]
  // if (Coord.check(coord1) && Coord.check(coord2)) {
  //   const corner1 = L.latLng(coord1)
  //   const corner2 = L.latLng(coord2)
  //   const radiusNew = Math.round(corner1.distanceTo(corner2))
  // }
  return coord2
}

export default class SectorItem extends React.Component {
  static propTypes = {
    index: PropTypes.number,
    beginCoordinate: PropTypes.object,
    coordinate1: PropTypes.object,
    coordinate2: PropTypes.object,
    sectorInfo: PropTypes.object,
    canRemove: PropTypes.bool,
    readOnly: PropTypes.bool,
    onChangeProps: PropTypes.func,
    onRemove: PropTypes.func,
  }

  removeSectorClickHandler = () => {
    const { onRemove, index } = this.props
    onRemove && onRemove(index)
  }

  sectorAmplifierChangeHandler = ({ target: { name, value } }) => {
    const { onChangeProps, index } = this.props
    onChangeProps && onChangeProps({ name, index, value })
  }

  sectorColorChangeHandler = (color) => {
    const { onChangeProps, index } = this.props
    const name = 'color'
    const value = color
    onChangeProps && onChangeProps({ name, index, value })
  }

  sectorFillChangeHandler = (fill) => {
    const { onChangeProps, index } = this.props
    const name = 'fill'
    const value = fill
    onChangeProps && onChangeProps({ name, index, value })
  }

  // обработка изменения радиуса
  radiusChangeHandler = () => (radiusText) => {
    const { index } = this.props
    // console.log(JSON.stringify(index), JSON.stringify(radiusText))
    this.setResult((result) => {
      const radius = Number(radiusText)
      if (Number.isFinite(radius)) {
        const coordinatesArray = result.getIn(COORDINATE_PATH)
        const coord1 = coordinatesArray.get(0)
        const coord2 = coordinatesArray.get(index)
        const coord3 = coordinatesArray.get(index + 1)
        if (Coord.check(coord1) && Coord.check(coord2) && Coord.check(coord3)) {
          // const coord3 = L.CRS.Earth.calcPairRight(coord1, radius)
          const coordN2 = getCoordinatesFromRadius([ coord1, coord2 ], radius)
          result = result.updateIn(COORDINATE_PATH, (coordinates) => coordinates.set(index, coordN2))
          const coordN3 = getCoordinatesFromRadius([ coord1, coord3 ], radius)
          result = result.updateIn(COORDINATE_PATH, (coordinates) => coordinates.set(index, coordN3))
        }
      }
      return result
    })
    this.setState({ radiusText })
  }

  render () {
    const { beginCoordinate = {}, coordinate1 = {}, coordinate2 = {}, index, sectorInfo, readOnly } = this.props
    if (index === undefined) { return }
    const radius = getRadiusFromCoordinatesArray([ beginCoordinate, coordinate1 ])
    const radiusIsWrong = !Number.isFinite(Number(radius))
    const da1 = distanceAngle([ beginCoordinate, coordinate1 ])
    const da2 = distanceAngle([ beginCoordinate, coordinate2 ])
    const azimut1 = da1.angledeg.toFixed(0)
    const azimut2 = da2.angledeg.toFixed(0)
    // const newCoord = sphereDirect([ beginCoordinate.lat * Math.PI / 180, beginCoordinate.lng * Math.PI / 180 ],
    //   da1.angledeg * Math.PI / 180, da1.distance / Earth.R)
    // const newCoordR = { lat: newCoord[0] * 180 / Math.PI, lng: newCoord[1] * 180 / Math.PI }
    // console.log(JSON.stringify({ coordinate1, newCoordR }))
    const amplifierT = sectorInfo?.amplifier || ''
    const color = sectorInfo?.color || colors.BLACK
    const fill = sectorInfo?.fill || colors.TRANSPARENT

    return (
      <Fragment key={`${coordinate1.lat}/${coordinate1.lng}`}>
        <tr>
          <td>
            <InputWithSuffix
              key = 'r'
              readOnly={readOnly}
              value={radius}
              onChange={!readOnly ? this.radiusChangeHandler : null }
              onBlur={!readOnly ? this.radiusBlurHandler : null}
              suffix={i18n.ABBR_METERS}
              error={radiusIsWrong}
            />
          </td>
          <td>
            <InputWithSuffix
              key = 'a1'
              readOnly={readOnly}
              value={azimut1}
              onChange={!readOnly ? this.radiusChangeHandler : null }
              onBlur={!readOnly ? this.radiusBlurHandler : null}
              suffix={i18n.ABBR_GRADUS}
              error={radiusIsWrong}
            />
          </td>
          <td>
            <InputWithSuffix
              key = 'a2'
              readOnly={readOnly}
              value={ azimut2}
              onChange={!readOnly ? this.radiusChangeHandler : null }
              onBlur={!readOnly ? this.radiusBlurHandler : null}
              suffix={i18n.ABBR_GRADUS}
              error={radiusIsWrong}
            />
          </td>
          <td>
            <Input.TextArea
              value={amplifierT}
              name={'amplifier'}
              onChange={this.sectorAmplifierChangeHandler}
              disabled={readOnly}
              rows={1}
            />
          </td>
          <td>
            <ColorPicker
              color={color}
              disabled={readOnly}
              onChange={this.sectorColorChangeHandler}
              zIndex={COLOR_PICKER_Z_INDEX}
              presetColors={PRESET_COLORS}
            />
          </td>
          <td>
            <Select
              value={fill}
              disabled={readOnly}
              onChange={this.sectorFillChangeHandler}
            >
              {colorOption(colors.TRANSPARENT)}
              {colorOption(colors.BLUE)}
              {colorOption(colors.RED)}
              {colorOption(colors.BLACK)}
              {colorOption(colors.GREEN)}
              {colorOption(colors.YELLOW)}
              {colorOption(colors.WHITE)}
            </Select>
          </td>
          <td>
            <FormItem className={'sectorItems'}>
              { !readOnly && (<IconHovered
                icon={IconNames.DELETE_24_DEFAULT}
                hoverIcon={IconNames.DELETE_24_HOVER}
                onClick={this.removeSectorClickHandler}
              />)}
            </FormItem>
          </td>
        </tr>
      </Fragment>)
  }
}
