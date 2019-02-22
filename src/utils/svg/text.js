/* eslint-disable react/prop-types */
import React, { Fragment } from 'react'
import { Align } from '../../constants'
import { pointsToD, rectToPoints } from './lines'

export const FONT_FAMILY = 'Arial'
const lineCoef = 1.2

let ctx = null

function getCTX (font = `12px ${FONT_FAMILY}`) {
  // re-use canvas object for better performance
  if (!ctx) {
    ctx = document.createElement('canvas').getContext('2d')
  }
  ctx.font = font
  return ctx
}

export const getFont = (size, bold) => `${bold ? 'bold' : ''} ${Math.round(size)}px ${FONT_FAMILY}`

export const getTextWidth = (text, font) => getCTX(font).measureText(text).width

export const getLines = (longText, maxWidth, font) => {
  const ctx = getCTX(font)

  const words = longText.split(/\s+/)
  const lines = []

  let text = words[0]
  let width = ctx.measureText(text).width

  for (let i = 1; i < words.length; i++) {
    const word = words[i]
    const nextText = `${text} ${word}`
    const nextWidth = ctx.measureText(nextText).width
    if (nextWidth < maxWidth) {
      text = nextText
      width = nextWidth
    } else {
      lines.push({ text, width })
      width = ctx.measureText(text).width
      text = word
    }
  }
  lines.push({ text, width })
  return lines
}

export const renderTextSymbol = ({
  transparentBackground,
  displayAnchorLine,
  anchorLineWithArrow,
  magnification,
  texts = [],
  outlineColor = null,
}, scale = 100, isSvg = false) => {
  let maxWidth = 0
  let fullHeight = 0

  texts = texts.map(({ text, bold, size, align, underline }) => {
    const fontSize = (size || 12) * scale / 100

    const width = getTextWidth(text, getFont(fontSize, bold))
    if (width > maxWidth) {
      maxWidth = width
    }
    fullHeight += lineCoef * fontSize

    const y = fullHeight
    const lineSpace = underline ? 20 * scale / 100 : 0
    const lineStrokeWidth = underline ? (bold ? 7 : 4) * scale / 100 : 0
    fullHeight += lineSpace + lineStrokeWidth

    return { underline, fontSize, align, y, text, lineSpace, lineStrokeWidth }
  })

  maxWidth += 6
  maxWidth = Math.round(maxWidth)

  let outlineProps = false
  if (outlineColor) {
    const strokeWidth = 12 * scale / 100
    fullHeight = fullHeight + strokeWidth / 2
    outlineProps = { stroke: outlineColor, strokeWidth, fill: 'none' }
  }

  const textsEls = texts.map(({ text, fontSize, align, y, lineSpace, lineStrokeWidth }, i) => {
    const x = (align === Align.CENTER) ? (maxWidth / 2) : (align === Align.RIGHT) ? maxWidth : 0
    const textAnchor = (align === Align.CENTER) ? 'middle' : (align === Align.RIGHT) ? 'end' : 'start'
    const lineD = Boolean(lineStrokeWidth) &&
      pointsToD(rectToPoints({ x: 0, y: y + lineSpace, width: maxWidth, height: lineStrokeWidth }), true)
    return <Fragment key={i}>
      {outlineProps &&
      <text fontFamily={FONT_FAMILY} fontSize={fontSize} x={x} y={y} textAnchor={textAnchor} {...outlineProps}>
        {text}
      </text>
      }
      <text fill="#000" fontFamily={FONT_FAMILY} fontSize={fontSize} x={x} y={y} textAnchor={textAnchor}>
        {text}
      </text>
      {lineD && outlineColor && <path d={lineD} {...outlineProps}/>}
      {lineD && <path fill="#000" d={lineD} />}
    </Fragment>
  })

  return isSvg
    ? <svg
      width={maxWidth}
      height={fullHeight}
      viewBox={`0 0 ${maxWidth} ${fullHeight}`} version="1.1" xmlns="http://www.w3.org/2000/svg"
    >{textsEls}</svg>
    : textsEls
}