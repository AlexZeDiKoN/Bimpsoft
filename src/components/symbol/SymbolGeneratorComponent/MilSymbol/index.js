import React from 'react'
import PropTypes from 'prop-types'
import { Symbol } from 'milsymbol'
import './style.css'

export default class MilSymbol extends React.Component {
  componentDidMount () {
    this.redraw()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.code !== this.props.code) {
      this.redraw()
    }
  }

  redraw () {
    const { code, size = 48 } = this.props
    const symbol = new Symbol(code, { size })
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
  size: PropTypes.number,
}
