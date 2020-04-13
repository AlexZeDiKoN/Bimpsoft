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

  features.forEach(({ properties }) => {
    const { name, distance } = properties

    if (!name) {
      return
    }

    const filteredLandmark = filteredGeoLandmarks[name]
    if (filteredLandmark) {
      if (distance < filteredLandmark.distance) {
        filteredGeoLandmarks[name] = properties
      }
    } else {
      filteredGeoLandmarks[name] = properties
    }
  })

  return Object.values(filteredGeoLandmarks)
}

export default {
  azimuthToCardinalDirection,
  getFilteredGeoLandmarks,
}
