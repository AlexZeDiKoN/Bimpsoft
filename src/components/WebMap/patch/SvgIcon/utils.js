/* global DOMParser */
const parser = new DOMParser()

export const setActivePointSignColors = (node) => {
  if (!node.hasAttribute) {
    return
  }
  if (node.hasAttribute('stroke')) {
    const value = node.getAttribute('stroke')
    if (value && value !== 'none') {
      node.classList.add('replace-stroke')
    }
  }
  if (node.hasAttribute('fill')) {
    const value = node.getAttribute('fill')
    if (value && value !== 'none') {
      node.classList.add(node.tagName === 'text' || value === 'black' ? 'replace-fill-as-stroke' : 'replace-fill')
    }
  }
  for (const child of node.childNodes) {
    setActivePointSignColors(child)
  }
}

export const filterSet = (data) => {
  const result = {}
  data.forEach((k, v) => {
    if (k !== '') {
      result[v] = k
    }
  })
  return result
}

export const getSvgNodeFromString = (str) => parser.parseFromString(str, 'image/svg+xml').rootElement
