const OPENSTREETMAP = {
  source: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  maxZoom: 20,
}
const DZVIN = {
  source: '/tiles/{z}/{x}/{y}.png',
  maxZoom: 16,
}

const MapSources = [
  {
    title: 'ДЗВІН',
    sources: [ DZVIN ],
  },
  {
    title: 'Open Street Map',
    sources: [ OPENSTREETMAP ],
  },
]

export default MapSources
