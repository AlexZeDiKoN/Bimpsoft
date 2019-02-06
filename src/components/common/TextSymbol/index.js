import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { generateTextSymbolSvg, jsxRender } from '../../../utils'

export default class TextSymbol extends React.PureComponent {
  render () {
    const {
      transparentBackground,
      displayAnchorLine,
      anchorLineWithArrow,
      magnification,
      texts,
      ...otherProps
    } = this.props
    return <div className="textsymbol" { ...otherProps } >
      {generateTextSymbolSvg(jsxRender)(
        { transparentBackground, displayAnchorLine, anchorLineWithArrow, magnification, texts }
      )}
    </div>
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
