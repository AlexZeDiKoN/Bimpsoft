const OPENSTREETMAP = {
  source: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  maxZoom: 20,
}
const DZVIN = {
  source: 'http://10.8.26.20/map/{z}/{y}/{x}.png',
  maxZoom: 15,
  tms: false,
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
