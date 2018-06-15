import React from 'react'
import { Provider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'
import { LocaleProvider } from 'antd'
import createHistory from 'history/createBrowserHistory'
import ukUA from 'antd/lib/locale-provider/uk_UA'
import moment from 'moment'
import { ErrorBoundary } from './components'
import { Main } from './layouts'
import initStore from './store'
import 'moment/locale/uk'
import './App.css'
import ExplorerBridge from './server/ExplorerBridge'

moment.locale('uk')
// Init store and create a history of your choosing (we're using a browser history in this case)
// for react-redux-router middleware
const store = initStore({ history: createHistory() })
const explorerBridge = new ExplorerBridge(store)
explorerBridge.init()
class App extends React.Component {
  render () {
    return (
      <div id="app" className="app">
        <LocaleProvider locale={ukUA}>
          <Provider store={store}>
            <ErrorBoundary>
              <Router>
                <Main/>
              </Router>
            </ErrorBoundary>
          </Provider>
        </LocaleProvider>
      </div>
    )
  }
}

export default App
