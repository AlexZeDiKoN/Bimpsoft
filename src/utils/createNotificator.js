import { notification } from 'antd'
import { notifications } from '../store/actions'

let prevNotifications = {}

export default function createNotificator (store) {
  store.subscribe((...args) => {
    const newNotifications = store.getState().notifications
    if (prevNotifications !== newNotifications) {
      Object.values(newNotifications).forEach(({ id, message, description, type = 'success' }) => {
        if (!prevNotifications.hasOwnProperty(id)) {
          const onClose = () => store.dispatch(notifications.pop(id))
          notification[type]({ message, description, key: id, onClose })
        }
      })
      prevNotifications = newNotifications
    }
  })
}
