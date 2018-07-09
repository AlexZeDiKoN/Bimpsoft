import React from 'react'
import PropTypes from 'prop-types'
import { Symbol } from 'milsymbol'
import './style.css'

export default class MilSymbol extends React.PureComponent {
  componentDidMount () {
    this.redraw()
  }

  componentDidUpdate (prevProps) {
    this.redraw()
  }

  redraw () {
    const { code, size = 48, amplifiers = {} } = this.props

    const symbol = new Symbol(code, { ...amplifiers, size })
    const template = symbol.asSVG()
    this.el.innerHTML = template
  }

  render () {
    return (
      <div className="milsymbol" ref={(el) => {
        this.el = el
      }}>
      </div>
    )
  }
}

MilSymbol.propTypes = {
  code: PropTypes.string,
  amplifiers: PropTypes.object,
  size: PropTypes.number,
}
