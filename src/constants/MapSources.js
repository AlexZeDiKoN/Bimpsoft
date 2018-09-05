import { production } from '../utils/services'

const OPENSTREETMAP = {
  source: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  maxZoom: 20,
}
const DZVIN = {
  source: '/tiles/{z}/{x}/{y}.png',
  minZoom: 5,
  maxZoom: 16,
}

const MapSources = [
  {
    title: 'ДЗВІН',
    sources: [ DZVIN ],
  },
]

if (!production) {
  MapSources.push({
    title: 'Open Street Map',
    sources: [ OPENSTREETMAP ],
  })
}

export default MapSources
