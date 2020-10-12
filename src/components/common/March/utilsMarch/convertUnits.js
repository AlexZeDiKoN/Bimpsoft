import i18n from './../../../../i18n'

const azimuthToCardinalDirection = (azimuth) => {
  const { CD_N, CD_NE, CD_E, CD_SE, CD_S, CD_SW, CD_W, CD_NW } = i18n

  switch (true) {
    case (azimuth > 337.5 || azimuth < 22.5):
      return CD_N
    case (azimuth > 22.5 && azimuth < 67.5):
      return CD_NE
    case (azimuth > 67.5 && azimuth < 112.5):
      return CD_E
    case (azimuth > 112.5 && azimuth < 157.5):
      return CD_SE
    case (azimuth > 157.5 && azimuth < 202.5):
      return CD_S
    case (azimuth > 202.5 && azimuth < 247.5):
      return CD_SW
    case (azimuth > 247.5 && azimuth < 292.5):
      return CD_W
    case (azimuth > 292.5 && azimuth < 337.5):
      return CD_NW
    default:
      return ''
  }
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

  hours = (hours < 10) ? `0${hours}` : hours
  minutes = (minutes < 10) ? `0${minutes}` : minutes

  return `${hours}:${minutes}`
}

const convertSegmentsForExplorer = (segments) => {
  const segmentsArray = segments.toArray()
  const convertSegments = []

  for (const currentSegment of segmentsArray) {
    const currentChildren = currentSegment.children || []

    const segment = { ...currentSegment }
    segment.children = []
    delete segment.metric

    for (const currentChild of currentChildren) {
      const child = { ...currentChild }
      delete child.metric
      segment.children.push(child)
    }

    convertSegments.push(segment)
  }

  return { segments: convertSegments }
}

const getDataRoute = ({ routes = [] }) => {
  const [ route ] = routes
  const { geometry = {}, legs = [] } = route
  const coordinates = geometry?.coordinates?.map(([ lng, lat ]) => ({ lng, lat }))
  const distance = Number(legs[0]?.distance)
  const distanceInKm = distance && distance > 0 ? (distance / 1000).toFixed(1) : 0

  return {
    coordinates,
    distance: distanceInKm,
  }
}

const getTwoPointsRoute = (segments, segmentId, childId) => {
  let firstPoint, secondPoint
  if (childId === undefined || childId === null) {
    firstPoint = segments[segmentId].coordinates
    if (segments[segmentId].children && segments[segmentId].children.length) {
      secondPoint = segments[segmentId].children[0].coordinates
    } else {
      secondPoint = (segmentId + 1) < segments.length ? segments[segmentId + 1].coordinates : null
    }
  } else {
    firstPoint = segments[segmentId].children[childId].coordinates
    if ((childId + 1) === segments[segmentId].children.length) {
      secondPoint = (segmentId + 1) < segments.length ? segments[segmentId + 1].coordinates : null
    } else {
      secondPoint = segments[segmentId].children[childId + 1].coordinates
    }
  }
  firstPoint = firstPoint && Object.keys(firstPoint).length === 2 ? firstPoint : null
  secondPoint = secondPoint && Object.keys(secondPoint).length === 2 ? secondPoint : null
  return [ firstPoint, secondPoint ]
}

const isValidIncomingPoints = (pointsRoute) => {
  return pointsRoute &&
  pointsRoute.length === 2 &&
  pointsRoute[0] &&
  pointsRoute[1] &&
  pointsRoute[0].lat &&
  pointsRoute[0].lng &&
  pointsRoute[1].lat &&
  pointsRoute[1].lng
}

export default {
  azimuthToCardinalDirection,
  getFilteredGeoLandmarks,
  hoursToMs,
  msToTime,
  msToHours,
  convertSegmentsForExplorer,
  getDataRoute,
  getTwoPointsRoute,
  isValidIncomingPoints,
}
