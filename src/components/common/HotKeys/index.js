import React from 'react'
import PropTypes from 'prop-types'

const { Provider, Consumer } = React.createContext()

export class HotKeysContainer extends React.Component {
  static propTypes = {
    listeners: PropTypes.instanceOf(Set),
    selector: PropTypes.func,
    onKey: PropTypes.func,
  }

  listeners = new Set()

  pressedkeys = new Set()

  onKeyDown = (e) => {
    if (!this.pressedkeys.has(e.keyCode)) {
      this.listeners.forEach((listener) => listener.onKeyDown(e))
      this.pressedkeys.add(e.keyCode)
    }
    e.stopPropagation()
  }

  onKeyUp = (e) => {
    this.pressedkeys.delete(e.keyCode)
  }

  render () {
    const { children, ...otherProps } = this.props
    return (
      <Provider value={this.listeners}>
        <div
          {...otherProps}
          tabIndex={-1}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
        >
          {children}
        </div>
      </Provider>
    )
  }
}

class HotKeyComponent extends React.Component {
  static propTypes = {
    listeners: PropTypes.instanceOf(Set),
    selector: PropTypes.func,
    onKey: PropTypes.func,
  }

  componentDidMount () {
    this.props.listeners.add(this)
  }

  componentWillUnmount () {
    this.props.listeners.delete(this)
  }

  onKeyDown (e) {
    const { selector, onKey } = this.props
    selector && onKey && selector(e) && onKey(e)
  }

  render () {
    return null
  }
}

export const HotKey = (props) => (<Consumer>
  {(listeners) => <HotKeyComponent {...props} listeners={listeners} />}
</Consumer>)

HotKey.propTypes = {
  selector: PropTypes.func,
  onKey: PropTypes.func,
}
