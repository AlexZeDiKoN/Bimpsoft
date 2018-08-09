/* eslint-disable react/no-find-dom-node */
import * as ReactDOM from 'react-dom'

let isTouch = false
const componentsMap = new Map()
const handle = (e) => {
  if (e.type === 'touchend') {
    isTouch = true
  }
  if (e.type === 'click' && isTouch) {
    return
  }
  for (const { domNode, onClickOutside } of componentsMap.values()) {
    if (!domNode.contains(e.target)) {
      onClickOutside(e)
    }
  }
}

document.addEventListener('touchend', handle, true)
document.addEventListener('click', handle, true)

const getClickOutsideRef = (onClickOutside) => (c, ...args) => {
  const domNode = ReactDOM.findDOMNode(c)
  if (domNode === null) {
    componentsMap.delete(onClickOutside)
  } else {
    componentsMap.set(onClickOutside, { domNode, onClickOutside })
  }
}
export { getClickOutsideRef }
