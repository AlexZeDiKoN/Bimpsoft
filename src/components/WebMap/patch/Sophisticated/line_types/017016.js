import { applyToPoint, applyToPoints, compose, inverse, rotate } from 'transformation-matrix'
import { Cartesian3, Color } from 'cesium'
import { DELETE, MIDDLE } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  angleOf,
  applyVector,
  drawLine,
  drawLineMark,
  drawText, getFontSize,
  getVector,
  normalVectorTo,
  oppositeVector,
  segmentLength,
  setToSegment,
  setVectorLength,
  translateFrom,
  translateTo,
} from '../utils'
import { amps } from '../../../../../constants/symbols'
import {
  distanceAzimuth,
  moveCoordinate,
} from '../../utils/sectors'
import { MARK_TYPE } from '../../../../../constants/drawLines'
import { halfPI } from '../../../../../constants/utils'
import * as mapColors from '../../../../../constants/colors'
import objTypes from '../../../entityKind'
import { LabelType, lengthRatio, marker3D, text3D } from '../3dLib'

// sign name: ПОСЛІДОВНЕ ЗОСЕРЕДЖЕННЯ ВОГНЮ
// task code: DZVIN-5995
// hint: 'Послідовне зосередження вогню'

const NUMBERS_SIZE = 0.75

lineDefinitions['017016'] = {
  // Ампліфікатори на лінії
  useAmplifiers: [
    { id: amps.T, name: 'T', maxRows: 1 },
    { id: amps.N, name: 'Початковий номер', type: 'integer', minNumber: 1 , maxNumber: 999999 },
  ],
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.end,
  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Вершини, які дозволено вилучати на формі налаштування
  // вилучаєм початкову точку блоку зосередження вогню
  // має залишитися мінімум 2 блоки
  allowDeleteForm: (index, count) => ((index < count - 2) && (index % 3 === 1) && (count > 9)),

  // індекси вершин, які треба видалити
  deleteCoordinatesForm: (index, count) => {
    if ((index < count - 2) && (index % 3 === 1) && (count > 9)) {
      return { index, count: 3 }
    }
    return { index, count: 0 }
  },

  // Додавання вершин
  addCoordinatesLL: (coordinates, index) => {
    if (index < 3 || coordinates.length <= index) {
      return []
    }
    return [
      {
        lat: coordinates[index].lat + coordinates[index - 2].lat - coordinates[index - 3].lat,
        lng: coordinates[index].lng + coordinates[index - 2].lng - coordinates[index - 3].lng,
      },
      {
        lat: coordinates[index].lat + coordinates[index - 1].lat - coordinates[index - 3].lat,
        lng: coordinates[index].lng + coordinates[index - 1].lng - coordinates[index - 3].lng,
      },
      {
        lat: coordinates[index].lat + coordinates[index].lat - coordinates[index - 3].lat,
        lng: coordinates[index].lng + coordinates[index].lng - coordinates[index - 3].lng,
      },
    ]
  },

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  // для обробки видалення блоку зосередження вогню
  // Обробка географічних координат
  adjustForm: (prevPoints, nextPoints, changed) => {
    const indEnd = prevPoints.length - 1
    for (const ch of changed) {
      const role = ch % 3
      if ((role === 1) && ((ch + 2) < indEnd)) { // обрабатываем изменение только центральных точек блоков
        // обработка центральной точки блока
        const s1 = prevPoints[ch - 1]
        const p3 = prevPoints[ch + 2]
        const p0 = prevPoints[ch]
        const p1 = prevPoints[ch + 1]
        nextPoints[ch] = { // опорную точку блока перемещаем на середину вновь образованого сегмента
          lat: s1.lat + (p3.lat - s1.lat) / 2,
          lng: s1.lng + (p3.lng - s1.lng) / 2,
        }
        // перенос боковой точки блока
        const move = distanceAzimuth(p0, p1)
        const dAngle = distanceAzimuth(p3, p0).angledeg - distanceAzimuth(p3, nextPoints[ch]).angledeg
        move.angledeg -= dAngle
        nextPoints[ch + 1] = moveCoordinate(nextPoints[ch], move)
      }
    }
  },

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: (prevPoints, nextPoints, changed) => {
    // Варіант для демонстрації
    const indEnd = nextPoints.length - 1
    const c = (indEnd / 3) | 0
    for (const ch of changed) {
      const role = ch % 3
      if (role === 0) {
        const segm = Math.trunc(ch / 3)
        const adjustSegm = (idx1, idx2, idxp, idxc) => {
          nextPoints[idxp] = applyVector(
            nextPoints[idx1],
            setVectorLength(
              getVector(nextPoints[idx1], nextPoints[idx2]),
              segmentLength(prevPoints[idx1], prevPoints[idxp]),
            ),
          )
          const corner = applyToPoint(compose(
            rotate(-angleOf(prevPoints[idx2], prevPoints[idx1])),
            translateFrom(prevPoints[idxp]),
          ), prevPoints[idxc])
          nextPoints[idxc] = applyToPoint(compose(
            translateTo(nextPoints[idxp]),
            rotate(angleOf(nextPoints[Math.max(idx1, idx2)], nextPoints[Math.min(idx1, idx2)])),
          ), {
            x: -Math.abs(corner.x),
            y: -Math.abs(corner.y),
          })
        }
        if (segm > 0) {
          adjustSegm(ch - 3, ch, ch - 2, ch - 1)
        }
        if (segm < c) {
          adjustSegm(ch + 3, ch, ch + 1, ch + 2)
        }
      } else if (role === 1) {
        const s1 = prevPoints[ch - 1]
        const s2 = prevPoints[ch + 2]
        nextPoints[ch] = setToSegment(
          applyVector(nextPoints[ch], oppositeVector(normalVectorTo(s1, s2, nextPoints[ch]))),
          [ s1, s2 ],
        )
        nextPoints[ch + 1] = applyVector(
          prevPoints[ch + 1],
          getVector(prevPoints[ch], nextPoints[ch]),
        )
      } else {
        const corner = applyToPoint(compose(
          rotate(-angleOf(prevPoints[ch + 1], prevPoints[ch - 2])),
          translateFrom(prevPoints[ch - 1]),
        ), nextPoints[ch])
        for (let i = 0; i < c; i++) {
          nextPoints[i * 3 + 2] = applyToPoint(compose(
            translateTo(prevPoints[i * 3 + 1]),
            rotate(angleOf(prevPoints[i * 3 + 3], prevPoints[i * 3])),
          ), {
            x: -Math.abs(corner.x),
            y: -Math.abs(corner.y),
          })
        }
      }
    }
  },

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: (options) => {
    const c = options?.params?.count
    const ih = 0.5 / c
    const result = [
      { x: 0.50, y: 0.25 },
    ]
    for (let i = 0; i < c; i++) {
      result.push(
        { x: 0.50, y: 0.25 + (i + 0.5) * ih },
        { x: 0.50 + ih / 8, y: 0.25 + (i + 0.25) * ih },
        { x: 0.50, y: 0.25 + (i + 1) * ih },
      )
    }
    return result
  },

  // Рендер-функція
  render: (result, points, _, toPrint) => {
    const indEnd = points.length - 1
    const c = (indEnd / 3) | 0
    let start = points[0]
    for (let i = 0; i < c; i++) {
      const t = compose(
        rotate(-angleOf(points[i * 3 + 3], start)),
        translateFrom(points[i * 3 + 1]),
      )
      const inv = inverse(t)
      const corner = applyToPoint(t, points[i * 3 + 2])
      const corners = applyToPoints(inv, [
        { x: corner.x, y: corner.y },
        { x: corner.x, y: -corner.y },
        { x: -corner.x, y: -corner.y },
        { x: -corner.x, y: corner.y },
        { x: corner.x, y: corner.y },
      ])
      drawLine(result, ...corners)
      const middles = applyToPoints(inv, [
        { x: corner.x, y: 0 },
        { x: -corner.x, y: 0 },
      ])
      drawLine(result, start, middles[0])
      start = points[i * 3 + 3]
      drawLine(result, start, middles[1])
    }

    start = points[0]
    drawLineMark(result, MARK_TYPE.SERIF, start, angleOf(points[3], start))
    drawLineMark(result, MARK_TYPE.SERIF, points[indEnd], angleOf(points[indEnd - 3], points[indEnd]))

    if (result.layer?.options?.showAmplifiers || toPrint) {
      const angle = angleOf(start, points[3])
      const top = angle < 0
      const margin = getFontSize(result.layer) / 8

      const text = result.layer?.object?.attributes?.pointAmplifier?.[amps.T] ?? ''
      if (text) {
        drawText(
          result,
          applyVector(start, setVectorLength(getVector(points[3], start), margin)),
          angle - halfPI,
          text,
          1,
          'middle',
          null,
          top ? 'text-after-edge' : 'text-before-edge',
        )
      }

      const number = Number(result.layer?.object?.attributes?.pointAmplifier?.[amps.N] ?? 0)
      if (number >= 0) {
        for (let i = 0; i < c; i++) {
          drawText(
            result,
            points[i * 3 + 1],
            angleOf(points[i * 3 + 3], points[i * 3]) + halfPI,
            (number + i).toFixed(0),
            NUMBERS_SIZE,
          )
        }
      }
    }
  },

  // рендер функция для 3D карты
  build3d: (result, id, points, attributes) => {
    const color = attributes.get('color')
    const amp = attributes.get('pointAmplifier')
    const colorM = Color.fromCssColorString(mapColors.evaluateColor(color))
    const width = attributes.get('strokeWidth')
    const entities = []
    const indEnd = points.length - 1
    const c = (indEnd / 3) | 0
    const { angledeg, distance } = distanceAzimuth(points[0], points[1])
    const angle = angledeg - 90
    const heightBox = distance / lengthRatio
    const number = Number(amp[amps.N] ?? 0)
    entities.push(text3D(points[0], LabelType.GROUND, {
      text: amp[amps.T],
      angle,
      heightBox,
      fillOpacity: '50%',
      overturn: false,
      align: {
        baseline: 'bottom',
        anchor: 'middle',
      },
    }))
    entities.push(marker3D(points[1], points[0], MARK_TYPE.SERIF, { width, color }))
    entities.push(marker3D(points[indEnd - 2], points[indEnd], MARK_TYPE.SERIF, { width, color }))
    let start = null // points[0]
    for (let i = 0; i < c; i++) {
      const corners = []
      const center = points[i * 3 + 1]
      const { angledeg: angle1, angleRad: angleRad1, distance } = distanceAzimuth(center, points[ i * 3 + 2 ])
      const { angledeg: angle2, angleRad: angleRad2 } = distanceAzimuth(center, points[ i * 3 ])
      const difference = angle1 - angle2
      const angleRad = angleRad1 - angleRad2
      start && corners.push(start)
      corners.push(points[i * 3])
      const corner = moveCoordinate(center, { distance: distance * Math.cos(angleRad), angledeg: angle1 - difference })
      corners.push(corner)
      corners.push(moveCoordinate(center, { distance, angledeg: angle1 - difference * 2 }))
      corners.push(moveCoordinate(center, { distance: -distance, angledeg: angle1 }))
      corners.push(moveCoordinate(center, { distance: -distance, angledeg: angle1 - difference * 2 }))
      corners.push(points[i * 3 + 2])
      corners.push(corner)
      start = moveCoordinate(center, { distance: -distance * Math.cos(angleRad), angledeg: angle1 - difference })
      entities.push({
        polyline: {
          positions: corners.map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
          width,
          clampToGround: true,
          followSurface: true,
          material: colorM,
        },
      })
      entities.push(text3D(center, LabelType.GROUND, {
        text: number + i,
        angle: angle2 + 90,
        heightBox,
        fillOpacity: '50%',
        overturn: false,
      }))
    }
    entities.push({
      polyline: {
        positions: [ start, points[indEnd] ].map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
        width,
        clampToGround: true,
        followSurface: true,
        material: colorM,
      },
    })
    result.push({ id, type: objTypes.SOPHISTICATED, entities })
    return result
  },
}
