const OPENSTREETMAP = {
  source: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  maxZoom: 20,
}
const DZVIN = {
  source: 'http://10.8.26.84/api/BaseMapLayer/ato/{z}/{y}/{x}',
  maxZoom: 20,
  tms: true,
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
