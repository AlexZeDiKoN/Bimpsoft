import L from 'leaflet'
import convertUnits from './convertUnits'

const { hoursToMs } = convertUnits

const defaultReferenceData = {
  time: 0,
  distance: 0,
}

const defaultSegmentData = () => ({
  totalTime: 0,
  totalDistance: 0,
  childSegments: [],
  referenceData: {
    time: 0,
    distance: 0,
  },
  untilNextSegment: { time: 0, distance: 0 },
  untilPreviousSegment: { time: 0, distance: 0 },
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

const getTruckSegmentDetails = (startingPoint, nextPoint, dataMarch, referenceData = defaultReferenceData) => {
  const { velocity, children = [] } = startingPoint

  let s = 0
  let totalTime = 0
  let totalDistance = 0
  let currentCoord = startingPoint.coord
  const childSegments = []
  const { extractionInColumnFactor, extractionColumnFactor } = dataMarch

  for (let index = 0; index < children.length; index++) {
    s = getDistance(currentCoord, children[index].coord)
    let v = 0

    if (s === 0) {
      childSegments.push({
        distance: +totalDistance.toFixed(1),
        time: +totalTime,
      })
      if (Object.keys(currentCoord).length === 0) {
        currentCoord = children[index].coord
      }
      continue
    }

    if (index === 0) {
      v = extractionInColumnFactor * velocity
    } else {
      v = velocity
    }

    const t = hoursToMs(s / v)

    totalTime += t
    totalDistance += s

    childSegments.push({
      distance: +totalDistance.toFixed(1),
      time: +totalTime,
    })

    totalTime += children[index].restTime
    currentCoord = children[index].coord
  }

  s = getDistance(currentCoord, nextPoint.coord)

  const t = s === 0 ? 0 : hoursToMs(s / velocity)

  const columnLength = getColumnLength(dataMarch)
  const vFinish = extractionColumnFactor * velocity
  const tFinish = hoursToMs(columnLength / vFinish)

  totalDistance += s

  const fixedTime = s === 0 ? 0 : t + tFinish
  totalTime = totalDistance === 0 ? 0 : totalTime + fixedTime

  const untilPreviousSegment = {
    time: 0,
    distance: 0,
  }
  const untilNextSegment = {
    time: fixedTime,
    distance: s,
  }

  return {
    totalTime,
    totalDistance,
    childSegments,
    referenceData,
    untilPreviousSegment,
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

const getVehiclesSegmentDetails = (startingPoint, nextPoint, dataMarch, referenceData = defaultReferenceData) => {
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
  let totalTime = 0
  let totalDistance = 0
  let currentCoord = startingPoint.coord

  const tp = getLoadUnloadTime({
    ...loadUnloadData,
    loadUploadTimes: loadingTimes,
  })

  totalTime += hoursToMs(tp)

  for (let index = 0; index < children.length; index++) {
    s = getDistance(currentCoord, children[index].coord)

    if (s === 0) {
      childSegments.push({
        distance: +totalDistance.toFixed(1),
        time: +totalTime,
      })
      if (Object.keys(currentCoord).length === 0) {
        currentCoord = children[index].coord
      }
      continue
    }

    t = hoursToMs(s / velocity)

    totalTime += t
    totalDistance += s

    childSegments.push({
      distance: +totalDistance.toFixed(1),
      time: +totalTime,
    })

    currentCoord = children[index].coord
  }

  s = getDistance(currentCoord, nextPoint.coord)
  t = s === 0 ? 0 : hoursToMs(s / velocity)

  totalDistance += s

  const tv = getLoadUnloadTime({
    ...loadUnloadData,
    loadUploadTimes: uploadingTimes,
  })

  const tFinish = hoursToMs(tv + ti * (k - 1))
  const fixedTime = s === 0 ? 0 : t + tFinish

  totalTime = totalDistance === 0 ? 0 : totalTime + fixedTime

  const untilPreviousSegment = {
    time: 0,
    distance: 0,
  }
  const untilNextSegment = {
    time: fixedTime,
    distance: s,
  }

  return {
    totalTime,
    totalDistance,
    childSegments,
    referenceData,
    untilPreviousSegment,
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
    totalMarchTime: 0,
    totalMarchDistance: 0,
    segments: [],
  }
  let indexNotEmptySegment = 0

  for (let index = 0; index < segments.length - 1; index++) {
    const currentSegment = segments[index]
    if (currentSegment.segmentType) {
      const referenceData = {
        time: totalData.totalMarchTime,
        distance: totalData.totalMarchDistance,
      }
      const segmentDetails = getSegmentDetails(currentSegment, segments[index + 1], dataMarch, referenceData)

      if (index) {
        const prevSegment = totalData.segments[index - 1]
        const { time: prevTime = 0, distance: prevDistance = 0 } = prevSegment.untilNextSegment

        segmentDetails.untilPreviousSegment.time = prevTime
        segmentDetails.untilPreviousSegment.distance = prevDistance
      }

      totalData.segments.push(segmentDetails)

      if (segmentDetails.totalDistance) {
        totalData.totalMarchTime += segmentDetails.totalTime
        totalData.totalMarchDistance += segmentDetails.totalDistance

        indexNotEmptySegment = index
      } else {
        const notEmptySegment = totalData.segments[indexNotEmptySegment]

        const correctSegmentDetails = getSegmentDetails(
          segments[indexNotEmptySegment],
          segments[index + 1],
          dataMarch,
          notEmptySegment.referenceData)

        const { totalTime, totalDistance } = correctSegmentDetails

        totalData.totalMarchTime += totalTime - notEmptySegment.totalTime
        totalData.totalMarchDistance += totalDistance - notEmptySegment.totalDistance

        totalData.segments[indexNotEmptySegment] = correctSegmentDetails
      }
    }
  }

  const segmentDetails = getSegmentDetails(segments[segments.length - 1])
  totalData.segments.push(segmentDetails)

  return totalData
}

export default getMarchDetails
