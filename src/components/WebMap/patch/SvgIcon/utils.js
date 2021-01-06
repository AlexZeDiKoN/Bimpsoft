/* global DOMParser */
import { List, Set } from 'immutable'
import { omit } from 'ramda'

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

export const filterByObject = (data = {}, enableObj = {}) => {
  const disabledList = Object.entries(enableObj)
    .filter(([ , state ]) => state === false)
    .map(([ key ]) => key)
  return omit(disabledList, data)
}

// Проверка объекта на пустое содержимое
function isEmptyObj (obj) {
  if (List.isList(obj) || Set.isSet(obj)) {
    return obj.size === 0
  }

  if (obj.size !== undefined) { // итерируемый объект
    for (let value of obj) {
      if (Array.isArray(value)) { // Map, Record
        value = value[1]
      }
      if (value === null || value === '') {
        continue
      }
      return false
    }
  } else { // простой объект
    for (const value in obj) {
      if (value === null || value === '') {
        continue
      }
      return false
    }
  }
  return true
}

export const filterSetEmpty = (data) => {
  const result = {}
  data.forEach((value, key) => {
    if (value !== '' && value !== 'none' &&
      !(toString.call(value) === '[object Array]' && value.length === 0) &&
      !(toString.call(value) === '[object Object]' && isEmptyObj(value))
    ) {
      result[key] = value
    }
  })
  return result
}

export const getSvgNodeFromString = (str) => parser.parseFromString(str, 'image/svg+xml').rootElement
