import i18n from './../../../../i18n'

const azimuthToCardinalDirection = (azimuth) => {
  let cardinalDirection = ''
  const { CD_N, CD_NE, CD_E, CD_SE, CD_S, CD_SW, CD_W, CD_NW } = i18n

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

  return { segments: convertSegments }
}

export default {
  azimuthToCardinalDirection,
  getFilteredGeoLandmarks,
  hoursToMs,
  msToTime,
  msToHours,
  convertSegmentsForExplorer,
}
