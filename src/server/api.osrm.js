import { getDirect } from './implementation/utils.rest'

const osrmUrl = '/osrm'
const routeUrl = '/route/v1/driving'

const key = (point) => `${point.lng.toFixed(6)},${point.lat.toFixed(6)}`

export default {
  // Автоматичне прокладання маршрутів автомобільними дорогами
  getRoute: async (point1, point2) => {
    try {
      return getDirect(`${osrmUrl}${routeUrl}/${key(point1)};${key(point2)}?geometries=geojson&overview=full`, false, true)
    } catch (err) {
      console.warn(err)
      return null
    }
  },
}
