import 'core-js/stable'
import 'regenerator-runtime/runtime'
import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import { notification } from 'antd'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'
import './assets/fonts/qwe-icon.css'
import './assets/styles/rewrites.css'
import * as i18n from './i18n'

window.onerror = null
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection (promise: ', event.promise, ', reason: ', event.reason, ').')
  notification.error({
    message: i18n.ERROR,
    description: <div className="copied-container">{i18n.SERVER_ERROR}</div>,
    duration: 0,
  })
})

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
