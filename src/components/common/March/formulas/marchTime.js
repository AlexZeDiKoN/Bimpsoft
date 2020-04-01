import L from 'leaflet'

const getDistance = (from, to) => {
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

const getTruckSegmentDetails = (startingPoint, nextPoint, dataMarch) => {
  const { velocity, children = [] } = startingPoint

  let totalTime = 0
  let totalDistance = 0
  const childSegments = []
  let index = 0

  for (; index < children.length; index++) {
    let s
    let v

    if (index === 0) {
      s = getDistance(startingPoint.coord, children[index].coord)
    } else {
      s = getDistance(children[index - 1].coord, children[children].coord)
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
      distance: totalDistance,
      time: totalTime,
    })

    totalTime += children[index].restTime
  }

  const s = getDistance(children[index - 1].coord, nextPoint.coord)
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

const getTrainOrShipSegmentDetails = (startingPoint, nextPoint, dataMarch) => {
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

  let totalTime = 0
  let totalDistance = 0
  const childSegments = []
  let index = 0
  let s = 0

  if (children.length) {
    for (; index < children.length; index++) {
      if (index === 0) {
        s = getDistance(startingPoint.coord, children[index].coord)
      } else {
        s = getDistance(children[index - 1].coord, children[children].coord)
      }

      const t = s / velocity

      totalTime += t
      totalDistance += s

      childSegments.push({
        distance: totalDistance,
        time: totalTime,
      })
    }

    s = getDistance(children[index - 1].coord, nextPoint.coord)

    totalTime += s / velocity
    totalDistance += s
  } else {
    totalDistance = getDistance(startingPoint.coord, nextPoint.coord)
    totalTime = totalDistance / velocity
  }

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
  }
}

export default {
  getTruckSegmentDetails,
  getTrainOrShipSegmentDetails,
}
