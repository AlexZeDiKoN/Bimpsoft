const OPENSTREETMAP = {
  source: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  maxZoom: 20,
}
const DZVIN = {
  source: '/tiles/{z}/{y}/{x}.png',
  maxZoom: 16
}

const MapSources = [
  {
    title: 'Open Street Map',
    sources: [ OPENSTREETMAP ],
  },
  {
    title: 'ДЗВІН',
    sources: [ OPENSTREETMAP, DZVIN ],
  },
]

export default MapSources
