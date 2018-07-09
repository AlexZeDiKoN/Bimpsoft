import React from 'react'
import PropTypes from 'prop-types'
import TextFilter from './../TextFilter'
import './style.css'

export default function HighlightedText (props) {
  const { text, textFilter } = props
  if (!(textFilter instanceof TextFilter) || !textFilter.test(text)) {
    return text
  }
  // Split text on highlight term, include term itself into parts, ignore case
  var parts = textFilter.parts(text)

  return parts.map((part, i) => (
    <span key={i} className={part.selected ? 'highlight' : 'obscure'}>
      {part.text}
    </span>
  ))
}

HighlightedText.propTypes = {
  text: PropTypes.string,
  textFilter: PropTypes.string,
}
