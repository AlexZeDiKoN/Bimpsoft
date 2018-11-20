import React from 'react'
import PropTypes from 'prop-types'
import { ERROR_SOMETHING_WENT_WRONG } from '../i18n/ua'

export default class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  }

  state = { error: null, errorInfo: null }

  componentDidCatch (error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error,
      errorInfo,
    })
  }

  render () {
    if (this.state.errorInfo) {
      return (
        <div style={{ textAlign: 'center' }}>
          <h2>{ERROR_SOMETHING_WENT_WRONG}</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      )
    }
    return this.props.children
  }
}
