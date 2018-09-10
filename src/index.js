/* global io */
import 'babel-polyfill'
import 'antd/dist/antd.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { getWebmapApi } from './utils/services'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'
import './assets/fonts/qwe-icon.css'
import './assets/styles/rewrites.css'

try {
  window.socket = io(getWebmapApi())
} catch (err) {
  console.warn('Вебсокет-сервер недоступний')
}
ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
