import React from 'react'
import PropTypes from 'prop-types'
import { Symbol } from 'milsymbol'
import './style.css'
import * as symbolOptions from '../../model/symbolOptions'
import Coordinates from '../CoordinatesForm/Coordinates'

export default class MilSymbol extends React.PureComponent {
  componentDidMount () {
    this.redraw()
  }

  componentDidUpdate (prevProps) {
    this.redraw()
  }

  redraw () {
    const { code, size = 48, amplifiers = {}, coordinates = {} } = this.props
    const options = { ...amplifiers, size }
    if (coordinates[Coordinates.options.KEY_Z]) {
      options[symbolOptions.altitudeDepth] = coordinates[Coordinates.options.KEY_Z]
    }
    if (coordinates[Coordinates.options.KEY_Y] || coordinates[Coordinates.options.KEY_X]) {
      options[symbolOptions.location] = [
        coordinates[Coordinates.options.KEY_Y],
        coordinates[Coordinates.options.KEY_X],
      ].filter((item) => item !== undefined && item !== null).join(' ')
    }
    const symbol = new Symbol(code, options)

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
  coordinates: PropTypes.object,
  size: PropTypes.number,
}
