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

const VECTOR = {
  source: 'http://10.8.16.181/mvt/{z}/{x}/{y}.pbf',
  minZoom: 5,
  maxZoom: 16,
}

const MapSources = [ {
  title: 'ДЗВІН',
  sources: [ DZVIN ],
} ]

if (!production) {
  MapSources.push({
    title: 'Open Street Map',
    sources: [ OPENSTREETMAP ],
  })
  MapSources.push({
    title: 'Вектор',
    sources: [ VECTOR ],
  })
}

export default MapSources
