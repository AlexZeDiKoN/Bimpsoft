import React from 'react'
import { Provider, connect } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { createAuthForm } from '@C4/components'
import { createBrowserHistory as createHistory } from 'history'
import ukUA from 'antd/lib/locale-provider/uk_UA'
import moment from 'moment'
import { ErrorBoundary } from './components'
import { Main } from './layouts'
import { ICTInfoPopup, RootContainer } from './containers'
import initStore from './store'
import 'moment/locale/uk'
import './App.css'
import ExplorerBridge from './server/ExplorerBridge'
import { createNotificator } from './utils'
import { getAuthToken } from './server/implementation/utils.rest'

moment.locale('uk')
// Init store and create a history of your choosing (we're using a browser history in this case)
// for react-redux-router middleware
const store = initStore({ history: createHistory() })
window.explorerBridge = new ExplorerBridge(store)
window.explorerBridge.init(false)

const AuthForm = createAuthForm(connect)

createNotificator(store)

class App extends React.Component {
  authorized = () => {
    window.socket.then(async (socket) => {
      socket.emit('authorization', await getAuthToken())
    })
  }

  render () {
    return (
      <div id="app" className="app">
        <ConfigProvider locale={ukUA}>
          <Provider store={store}>
            <ErrorBoundary>
              <AuthForm onSuccess={this.authorized}>
                <Router>
                  <RootContainer>
                    <Main />
                  </RootContainer>
                </Router>
                <ICTInfoPopup/>
              </AuthForm>
            </ErrorBoundary>
          </Provider>
        </ConfigProvider>
      </div>
    )
  }
}

export default App
