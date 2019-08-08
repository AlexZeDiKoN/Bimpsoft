import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'antd/dist/antd.css'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import './index.css'
import './assets/fonts/qwe-icon.css'
import './assets/styles/rewrites.css'

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
