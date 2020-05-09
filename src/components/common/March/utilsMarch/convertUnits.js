import i18n from './../../../../i18n'

const { CD_N, CD_NE, CD_E, CD_SE, CD_S, CD_SW, CD_W, CD_NW } = i18n

const azimuthToCardinalDirection = (azimuth) => {
  let cardinalDirection = ''

  switch (true) {
    case (azimuth > 337.5 || azimuth < 22.5):
      cardinalDirection = CD_N
      break
    case (azimuth > 22.5 && azimuth < 67.5):
      cardinalDirection = CD_NE
      break
    case (azimuth > 67.5 && azimuth < 112.5):
      cardinalDirection = CD_E
      break
    case (azimuth > 112.5 && azimuth < 157.5):
      cardinalDirection = CD_SE
      break
    case (azimuth > 157.5 && azimuth < 202.5):
      cardinalDirection = CD_S
      break
    case (azimuth > 202.5 && azimuth < 247.5):
      cardinalDirection = CD_SW
      break
    case (azimuth > 247.5 && azimuth < 292.5):
      cardinalDirection = CD_W
      break
    case (azimuth > 292.5 && azimuth < 337.5):
      cardinalDirection = CD_NW
      break
    default:
  }

  return cardinalDirection
}

const getFilteredGeoLandmarks = (features) => {
  const filteredGeoLandmarks = {}

  features.forEach(({ properties, geometry }) => {
    const { name, distance } = properties

    if (!name) {
      return
    }

    const filteredLandmark = filteredGeoLandmarks[name]
    if (filteredLandmark) {
      if (distance < filteredLandmark.distance) {
        filteredGeoLandmarks[name] = { properties, geometry }
      }
    } else {
      filteredGeoLandmarks[name] = { properties, geometry }
    }
  })

  return Object.values(filteredGeoLandmarks)
}

const hoursToMs = (hours) => hours * 3600000

const msToHours = (ms) => {
  if (!ms) {
    return 0
  }
  const hours = ms / 3600000

  return hours.toFixed(0)
}

const msToTime = (duration) => {
  let minutes = Math.floor((duration / (1000 * 60)) % 60)
  let hours = Math.floor(duration / (1000 * 60 * 60))

  hours = (hours < 10) ? '0' + hours : hours
  minutes = (minutes < 10) ? '0' + minutes : minutes

  return hours + ':' + minutes
}

const getDefaultCoefficients = (segmentType) => {
  const common = {
    velocity: 30,
    distance: null,
  }

  let coefficients
  switch (segmentType) {
    case 41 : {
      coefficients = {
        terrain: 69, // Рівнина
        MARCH100: 0.8, // Коф витягування
        MARCH101: 0.7, // Коф втягування
        distanceVehicles: 50,
        distanceCompanies: 100,
        distanceBattalions: 2000,
        distanceBrigades: 3000,
        distanceGSLZ: 3000,
      }
      break
    }
    case 42 : {
      const loadingUploading = {
        platformId: 0,
        workInDark: false,
        workInGasMasks: false,
      }
      coefficients = {
        mountingWithServiceDevices: true,
        numberOfEchelonsPerDay: 4,
        numberOfTrainCarsInEchelon: 30,
        requiredNumberOfTrainCars: 0,
        requiredNumberOfShips: 4,
        loading: loadingUploading,
        uploading: loadingUploading,
      }
      break
    }
    case 43 : {
      const loadingUploading = {
        technologyId: 0, // OWN_MOVEMENT
        conditionId: 0, // IN_PORT__DAY
        teamReadinessId: 1, // good
      }
      coefficients = {
        mountingWithServiceDevices: true,
        numberOfEchelonsPerDay: 4,
        numberOfTrainCarsInEchelon: 30,
        requiredNumberOfTrainCars: 0,
        requiredNumberOfShips: 4,
        loading: loadingUploading,
        uploading: loadingUploading,
      }
      break
    }
    default:
      return
  }
  return Object.assign(common, coefficients)
}

const convertSegmentsForExplorer = (segments) => {
  const segmentsArray = segments.toArray()
  const convertSegments = []

  for (let i = 0; i < segmentsArray.length; i++) {
    const currentSegment = segmentsArray[i]
    const currentChildren = currentSegment.children || []

    const segment = { ...currentSegment }
    segment.children = []
    delete segment.metric

    for (let j = 0; j < currentChildren.length; j++) {
      const child = { ...currentChildren[j] }
      delete child.metric
      segment.children.push(child)
    }

    convertSegments.push(segment)
  }

  return convertSegments
}

export default {
  azimuthToCardinalDirection,
  getFilteredGeoLandmarks,
  hoursToMs,
  msToTime,
  msToHours,
  convertSegmentsForExplorer,
}
