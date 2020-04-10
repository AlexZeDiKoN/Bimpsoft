import L from 'leaflet'

const defaultReferenceData = {
  time: 0,
  distance: 0,
}

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
  const { time: refTime, distance: refDistance } = referenceData

  let s = 0
  let v = 0
  let index = 0
  let totalTime = refTime
  let totalDistance = refDistance
  let currentCoord = startingPoint.coord
  const childSegments = []

  for (; index < children.length; index++) {
    s = getDistance(startingPoint.coord, children[index].coord)

    if (s === 0) {
      childSegments.push({
        distance: +totalDistance.toFixed(1),
        time: +totalTime.toFixed(2),
      })
      continue
    }

    if (children[index].required) {
      v = 0.8 * velocity
    } else {
      v = velocity
    }

    const t = s / v

    totalTime += t
    totalDistance += s

    childSegments.push({
      distance: +totalDistance.toFixed(1),
      time: +totalTime.toFixed(2),
    })

    totalTime += children[index].restTime
    currentCoord = children[index].coord
  }

  s = getDistance(currentCoord, nextPoint && nextPoint.coord)

  const t = s / velocity

  const columnLength = getColumnLength(dataMarch)
  const vFinish = 0.7 * velocity
  const tFinish = columnLength / vFinish

  totalTime += t + tFinish
  totalDistance += s

  return {
    totalTime,
    totalDistance,
    childSegments,
    referenceData,
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
  const { time: refTime, distance: refDistance } = referenceData
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

  let s = 0
  let index = 0
  const childSegments = []
  let totalTime = refTime
  let totalDistance = refDistance
  let currentCoord = startingPoint.coord

  for (; index < children.length; index++) {
    s = getDistance(currentCoord, children[index].coord)

    if (s === 0) {
      childSegments.push({
        distance: +totalDistance.toFixed(1),
        time: +totalTime.toFixed(2),
      })
      continue
    }

    const t = s / velocity

    totalTime += t
    totalDistance += s

    childSegments.push({
      distance: +totalDistance.toFixed(1),
      time: +totalTime.toFixed(2),
    })

    currentCoord = children[index].coord
  }

  totalDistance += getDistance(currentCoord, nextPoint.coord)
  totalTime += totalDistance / velocity

  const loadUnloadData = {
    timeIncreaseFactor,
    timeCorrectionFactor,
    mountingFactor,
    workInDarkFactor,
    workInGasMasksFactor,
  }

  const tp = getLoadUnloadTime({
    ...loadUnloadData,
    loadUploadTimes: loadingTimes,
  })
  const tv = getLoadUnloadTime({
    ...loadUnloadData,
    loadUploadTimes: uploadingTimes,
  })

  totalTime += tp + tv + ti * (k - 1)

  return {
    totalTime,
    totalDistance,
    childSegments,
    referenceData,
  }
}

const getSegmentDetails = (...args) => {
  if (args[0].segmentType) {
    const segmentDetails = args[0].segmentType === 41 ? getTruckSegmentDetails : getVehiclesSegmentDetails

    return segmentDetails.apply(null, args)
  } else {
    return {
      totalTime: 0,
      totalDistance: 0,
      childSegments: [],
      referenceData: {
        time: 0,
        distance: 0,
      },
    }
  }
}

const getTotalMarchDetails = (segments, dataMarch) => {
  const totalData = {
    totalMarchTime: 0,
    totalMarchDistance: 0,
  }

  segments.forEach((segment, index) => {
    if (index === segments.length - 1) {
      return
    }

    if (segment.segmentType) {
      const segmentDetails = getSegmentDetails(segment, segments[index + 1], dataMarch)

      totalData.totalMarchTime += segmentDetails.totalTime
      totalData.totalMarchDistance += segmentDetails.totalDistance
    }
  })

  return totalData
}

export default {
  getTruckSegmentDetails,
  getVehiclesSegmentDetails,
  getTotalMarchDetails,
  getSegmentDetails,
}
