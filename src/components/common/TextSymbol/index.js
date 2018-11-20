import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { generateTextSymbolSvg } from '../../../utils'

export default class TextSymbol extends React.PureComponent {
  componentDidMount () {
    this.redraw()
  }

  componentDidUpdate (prevProps) {
    this.redraw()
  }

  ref = React.createRef()

  redraw () {
    const {
      transparentBackground,
      displayAnchorLine,
      anchorLineWithArrow,
      magnification,
      texts,
    } = this.props

    const svgHtml = generateTextSymbolSvg({
      transparentBackground,
      displayAnchorLine,
      anchorLineWithArrow,
      magnification,
      texts,
    })

    this.ref.current.innerHTML = svgHtml
  }

  render () {
    const {
      transparentBackground,
      displayAnchorLine,
      anchorLineWithArrow,
      magnification,
      texts,
      ...otherProps
    } = this.props
    return (<div className="textsymbol" ref={this.ref} { ...otherProps } />)
  }
}

TextSymbol.propTypes = {
  transparentBackground: PropTypes.bool,
  displayAnchorLine: PropTypes.bool,
  anchorLineWithArrow: PropTypes.bool,
  magnification: PropTypes.number,
  texts: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    underline: PropTypes.bool,
    bold: PropTypes.bool,
    size: PropTypes.number,
    align: PropTypes.string,
  })),
}
