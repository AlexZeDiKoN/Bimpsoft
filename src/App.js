import React from 'react'
import { Provider } from 'react-redux'
import { LocaleProvider } from 'antd'
import ukUA from 'antd/lib/locale-provider/uk_UA'
import moment from 'moment'
import { ErrorBoundary } from './components'
import { Main } from './containers'
import store from './store'
import 'moment/locale/uk'
import './App.css'

moment.locale('uk')

class App extends React.Component {
  render () {
    return (
      <div id="app" className="app">
        <LocaleProvider locale={ukUA}>
          <Provider store={store}>
            <ErrorBoundary>
              <Main/>
            </ErrorBoundary>
          </Provider>
        </LocaleProvider>
      </div>
    )
  }
}

export default App
