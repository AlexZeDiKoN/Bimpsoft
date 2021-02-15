import React from 'react'
import PropTypes from 'prop-types'

const { Provider, Consumer } = React.createContext()

export class HotKeysContainer extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    listeners: PropTypes.instanceOf(Set),
    selector: PropTypes.func,
    onKey: PropTypes.func,
  }

  listeners = new Set()

  pressedKeys = new Set()

  onKeyDown = (e) => {
    if (!this.pressedKeys.has(e.keyCode)) {
      this.listeners.forEach((listener) => listener.onKeyDown(e))
      this.pressedKeys.add(e.keyCode)
    }
    e.stopPropagation()
  }

  onKeyUp = (e) => {
    this.pressedKeys.delete(e.keyCode)
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

// сопоставление и блокировка горячих клавиш
export const blockHotKey = (shortcuts) => (e) => {
  if (Array.isArray(shortcuts)) {
    shortcuts.some((shortcut) => ((typeof shortcut === 'function') && shortcut(e))) && e.stopPropagation()
  } else {
    (typeof shortcuts === 'function') && shortcuts(e) && e.stopPropagation()
  }
}

// Контейнер блокировки горячих клавиш
// hotKey - массив определений блокируемых клавиш из shortcuts.js, например shortcuts.DELETE
export class BlockHotKeyContainer extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    hotKey: PropTypes.instanceOf(Array),
  }

  render () {
    const { children, ...otherProps } = this.props
    return <div onKeyDown={blockHotKey(otherProps.hotKey)}>
      {children}
    </div>
  }
}
