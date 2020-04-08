const azimuthToCardinalDirection = (azimuth) => {
  let cardinalDirection = ''

  switch (true) {
    case (azimuth > 337.5 || azimuth < 22.5):
      cardinalDirection = 'північ'
      break
    case (azimuth > 22.5 && azimuth < 67.5):
      cardinalDirection = 'північний-схід'
      break
    case (azimuth > 67.5 && azimuth < 112.5):
      cardinalDirection = 'схід'
      break
    case (azimuth > 112.5 && azimuth < 157.5):
      cardinalDirection = 'південний-схід'
      break
    case (azimuth > 157.5 && azimuth < 202.5):
      cardinalDirection = 'південь'
      break
    case (azimuth > 202.5 && azimuth < 247.5):
      cardinalDirection = 'південний-захід'
      break
    case (azimuth > 247.5 && azimuth < 292.5):
      cardinalDirection = 'захід'
      break
    case (azimuth > 292.5 && azimuth < 337.5):
      cardinalDirection = 'північний-захід'
      break
    default:
  }

  return cardinalDirection
}

export default {
  azimuthToCardinalDirection,
}
