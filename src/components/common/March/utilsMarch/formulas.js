import L from 'leaflet'
import convertUnits from './convertUnits'

const { hoursToMs } = convertUnits

const defaultReferenceData = {
  time: 0,
  distance: 0,
}

const defaultSegmentData = () => ({
  time: 0,
  distance: 0,
  children: [],
  reference: {
    time: 0,
    distance: 0,
  },
  untilNextSegment: { time: 0, distance: 0 },
  untilPrevious: { time: 0, distance: 0 },
})

const getDistance = (from, to) => {
  if (!from || !to || !from.lat || !from.lng || !to.lat || !to.lng) {
    return 0
  }
  const fromLatlng = L.latLng(from.lat, from.lng)
  const toLatlng = L.latLng(to.lat, to.lng)

  return (fromLatlng.distanceTo(toLatlng)).toFixed(0) / 1000
}

const getColumnLength = (dataMarch) => {
  const {
    vehiclesLength: lOvt,
    distanceVehicle: dVhc,
    distanceRots: dRot,
    distanceBats: dBat,
    distanceBrg: dBrg,
    distanceGslz: dGslz,
    vehiclesCount,
    rotsCount,
    batsCount,
    brgCount,
  } = dataMarch

  const nOvt = vehiclesCount || 1
  const nRot = rotsCount || 1
  const nBat = batsCount || 1
  const nBrg = brgCount || 1

  let columnLength
  if (dVhc <= 25) {
    columnLength = lOvt + (nOvt - 1) * dVhc + (nRot - 1) * (dRot - dVhc) + (nBat - 1) * (dBat - dRot) + (nBrg - 1) *
      (dBrg - dBat) + (dGslz - dVhc)
  } else {
    columnLength = nOvt * dVhc + (nRot - 1) * dRot + (nBat - 1) * (dBat - dRot) + (nBrg - 1) * (dBrg - dBat) + dGslz
  }

  return columnLength / 1000
}

const getTruckSegmentDetails = (startingPoint, nextPoint, dataMarch, reference = defaultReferenceData) => {
  const { velocity, children = [] } = startingPoint

  let s = 0
  let time = 0
  let distance = 0
  let currentCoord = startingPoint.coordinate
  const childSegments = []
  const { extractionInColumnFactor, extractionColumnFactor } = dataMarch

  for (let index = 0; index < children.length; index++) {
    s = getDistance(currentCoord, children[index].coordinate)
    let v = 0

    if (s === 0) {
      childSegments.push({
        distance: +distance.toFixed(1),
        time: +time,
      })
      if (Object.keys(currentCoord).length === 0) {
        currentCoord = children[index].coordinate
      }
      continue
    }

    if (index === 0) {
      v = extractionInColumnFactor * velocity
    } else {
      v = velocity
    }

    const t = hoursToMs(s / v)

    time += t
    distance += s

    childSegments.push({
      distance: +distance.toFixed(1),
      time: +time,
    })

    time += children[index].restTime
    currentCoord = children[index].coordinate
  }

  s = getDistance(currentCoord, nextPoint.coordinate)

  const t = s === 0 ? 0 : hoursToMs(s / velocity)

  const columnLength = getColumnLength(dataMarch)
  const vFinish = extractionColumnFactor * velocity
  const tFinish = hoursToMs(columnLength / vFinish)

  distance += s

  const fixedTime = s === 0 ? 0 : t + tFinish
  time = distance === 0 ? 0 : time + fixedTime

  const untilPrevious = {
    time: 0,
    distance: 0,
  }
  const untilNextSegment = {
    time: fixedTime,
    distance: s,
  }

  return {
    time,
    distance,
    children: childSegments,
    reference,
    untilPrevious,
    untilNextSegment,
  }
}

const getLoadUnloadTime = (data) => {
  const {
    loadUploadTimes: T,
    timeIncreaseFactor: Kv,
    timeCorrectionFactor: Kpl,
    mountingFactor: Kkr,
    workInDarkFactor: Ktc,
    workInGasMasksFactor: Kpr,
  } = data

  const loadUnloadVehiclesTime = T.reduce((totalSpentTime, time) => totalSpentTime + time, 0) / 60

  return loadUnloadVehiclesTime * (Kv * Kpl * Kkr * Ktc * Kpr)
}

const getVehiclesSegmentDetails = (startingPoint, nextPoint, dataMarch, reference = defaultReferenceData) => {
  const { velocity, children = [] } = startingPoint
  const {
    loadingTimes = [],
    uploadingTimes = [],
    intervalEchelon: ti,
    numberEchelons: k,
    timeIncreaseFactor,
    timeCorrectionFactor,
    mountingFactor,
    workInDarkFactor,
    workInGasMasksFactor,
  } = dataMarch

  const loadUnloadData = {
    timeIncreaseFactor,
    timeCorrectionFactor,
    mountingFactor,
    workInDarkFactor,
    workInGasMasksFactor,
  }

  let s = 0
  let t = 0
  const childSegments = []
  let time = 0
  let distance = 0
  let currentCoord = startingPoint.coordinate

  const tp = getLoadUnloadTime({
    ...loadUnloadData,
    loadUploadTimes: loadingTimes,
  })

  time += hoursToMs(tp)

  for (let index = 0; index < children.length; index++) {
    s = getDistance(currentCoord, children[index].coordinate)

    if (s === 0) {
      childSegments.push({
        distance: +distance.toFixed(1),
        time: +time,
      })
      if (Object.keys(currentCoord).length === 0) {
        currentCoord = children[index].coordinate
      }
      continue
    }

    t = hoursToMs(s / velocity)

    time += t
    distance += s

    childSegments.push({
      distance: +distance.toFixed(1),
      time: +time,
    })

    currentCoord = children[index].coordinate
  }

  s = getDistance(currentCoord, nextPoint.coordinate)
  t = s === 0 ? 0 : hoursToMs(s / velocity)

  distance += s

  const tv = getLoadUnloadTime({
    ...loadUnloadData,
    loadUploadTimes: uploadingTimes,
  })

  const tFinish = hoursToMs(tv + ti * (k - 1))
  const fixedTime = s === 0 ? 0 : t + tFinish

  time = distance === 0 ? 0 : time + fixedTime

  const untilPrevious = {
    time: 0,
    distance: 0,
  }
  const untilNextSegment = {
    time: fixedTime,
    distance: s,
  }

  return {
    time,
    distance,
    children: childSegments,
    reference,
    untilPrevious,
    untilNextSegment,
  }
}

const getSegmentDetails = (...args) => {
  if (args[0].segmentType) {
    const segmentDetails = args[0].segmentType === 41 ? getTruckSegmentDetails : getVehiclesSegmentDetails

    return segmentDetails.apply(null, args)
  } else {
    return defaultSegmentData()
  }
}

const getMarchDetails = (segments = [], dataMarch = {}) => {
  const totalData = {
    time: 0,
    distance: 0,
    segments: [],
  }
  let indexNotEmptySegment = 0

  for (let index = 0; index < segments.length - 1; index++) {
    const currentSegment = segments[index]
    if (currentSegment.segmentType) {
      const reference = {
        time: totalData.time,
        distance: totalData.distance,
      }
      const segmentDetails = getSegmentDetails(currentSegment, segments[index + 1], dataMarch, reference)

      if (index) {
        const prevSegment = totalData.segments[index - 1]
        const { time: prevTime = 0, distance: prevDistance = 0 } = prevSegment.untilNextSegment

        segmentDetails.untilPrevious.time = prevTime
        segmentDetails.untilPrevious.distance = prevDistance
      }

      totalData.segments.push(segmentDetails)

      if (segmentDetails.distance) {
        totalData.time += segmentDetails.time
        totalData.distance += segmentDetails.distance

        indexNotEmptySegment = index
      } else {
        const notEmptySegment = totalData.segments[indexNotEmptySegment]

        const correctSegmentDetails = getSegmentDetails(
          segments[indexNotEmptySegment],
          segments[index + 1],
          dataMarch,
          notEmptySegment.reference)

        const { time, distance } = correctSegmentDetails

        totalData.time += time - notEmptySegment.time
        totalData.distance += distance - notEmptySegment.distance

        totalData.segments[indexNotEmptySegment] = correctSegmentDetails
      }
    }
  }

  const segmentDetails = getSegmentDetails(segments[segments.length - 1])
  totalData.segments.push(segmentDetails)

  return totalData
}

export default getMarchDetails
