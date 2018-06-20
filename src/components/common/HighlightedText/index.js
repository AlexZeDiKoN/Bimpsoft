import React from 'react'
import PropTypes from 'prop-types'
import './style.css'

const specials = '-[]/{}()*+?.\\^$|'
const regexSpecials = RegExp('[' + specials.split('').join('\\') + ']', 'g')

function getRegExpFromStr (str) {
  str = str.replace(regexSpecials, '\\$&')
  return new RegExp(`(${str})`, 'gi')
}

export default function HighlightedText (props) {
  let { text, highlight } = props
  if (highlight.length === 0) {
    return text
  }
  // Split text on highlight term, include term itself into parts, ignore case
  var parts = text.split(getRegExpFromStr(highlight))
  highlight = highlight.toLowerCase()
  return parts.map((part, i) => (
    <span key={i} className={part.toLowerCase() === highlight ? 'highlight' : 'obscure'}>
      {part}
    </span>
  ))
}

HighlightedText.propTypes = {
  text: PropTypes.string,
  highlight: PropTypes.string,
}
