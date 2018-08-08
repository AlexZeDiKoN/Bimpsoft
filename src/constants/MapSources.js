const MapSources = [
  {
    title: 'openstreetmap',
    source: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 20,
  },
  {
    title: 'dzvin',
    source: 'http://10.8.26.84/api/BaseMapLayer/ato/{z}/{y}/{x}',
    maxZoom: 20,
    tms: true,
  },
]

export default MapSources
