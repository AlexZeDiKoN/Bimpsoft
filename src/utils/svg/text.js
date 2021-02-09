/* eslint-disable react/prop-types */
import React, { Fragment } from 'react'
import { Align } from '../../constants'

export const FONT_FAMILY = 'Arial'
export const FONT_WEIGHT = 'bold'
const LINE_COEFFICIENT = 1.1

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
}, scale = 100, wrapInSvg = false) => {
  let maxWidth = 0
  let fullHeight = 0
  let endUnderLine = false
  texts = texts.map(({ text, bold, size, align, underline }) => {
    const fontSize = (size || 12) * scale / 100
    const width = getTextWidth(text, getFont(fontSize, bold))
    if (width > maxWidth) {
      maxWidth = width
    }
    fullHeight += LINE_COEFFICIENT * fontSize

    const y = fullHeight
    const lineSpace = underline ? 4 * scale / 100 : 0
    const lineStrokeWidth = underline ? (bold ? 4 : 1) * scale / 100 : 0
    const fontWeightText = bold ? 700 : 400
    fullHeight += lineSpace * 2 + lineStrokeWidth
    endUnderLine = underline
    return {
      underline,
      fontSize,
      align,
      y,
      text,
      yUnderline: y + lineSpace + lineStrokeWidth / 2,
      lineStrokeWidth,
      fontWeightText,
    }
  })

  maxWidth += 6
  maxWidth = Math.round(maxWidth)

  const strokeWidth = 8 * scale / 100
  let outlineProps = { strokeWidth: 0 }
  if (outlineColor) {
    endUnderLine && (fullHeight = fullHeight + strokeWidth * 2) // увеличиваем высоту svg на высоту подсветки слоя последней линии подчеркивания
    outlineProps = { stroke: outlineColor, strokeWidth, fill: 'none' }
  }
  const textsEls = texts.map(({ text, fontSize, align, y, yUnderline, lineStrokeWidth, fontWeightText }, i) => {
    const x = (align === Align.CENTER) ? (maxWidth / 2) : (align === Align.RIGHT) ? maxWidth : 0
    const textAnchor = (align === Align.CENTER) ? 'middle' : (align === Align.RIGHT) ? 'end' : 'start'
    const isUnderline = Boolean(lineStrokeWidth)
    return <Fragment key={i}>
      {outlineColor && (<>
        <text x={x} y={y}
          fontFamily={FONT_FAMILY}
          fontSize={fontSize}
          textAnchor={textAnchor}
          dominantBaseline={'text-after-edge'}
          {...outlineProps}>
          {text}
        </text>
        {isUnderline && <rect x={0} y={yUnderline - lineStrokeWidth / 2}
          height={lineStrokeWidth}
          width={maxWidth}
          {...outlineProps}/>
        }</>)}
      <text x={x} y={y}
        fill="#000"
        stroke="none"
        fontFamily={FONT_FAMILY}
        fontWeight={fontWeightText}
        fontSize={fontSize}
        textAnchor={textAnchor}
        dominantBaseline={'text-after-edge'}>
        {text}
      </text>
      {isUnderline && <line x1={0} x2={maxWidth}
        y1={yUnderline} y2={yUnderline}
        stroke={'#000000'}
        strokeWidth={lineStrokeWidth}/>
      }
    </Fragment>
  })
  return wrapInSvg
    ? <svg
      width={maxWidth}
      height={fullHeight}
      viewBox={`0 0 ${maxWidth} ${fullHeight}`} version="1.1" xmlns="http://www.w3.org/2000/svg"
    >{textsEls}</svg>
    : textsEls
}

export const extractTextSVG = ({
  string,
  fontSize,
  fontColor,
  margin,
  getOffset,
  angle = 0,
}) => {
  const lines = string.split('\n')
  const numberOfLines = lines.length
  const fillColor = fontColor ? `fill="${fontColor}"` : ``
  const rotate = Math.abs(angle) > 90 ? 180 : 0
  const height = fontSize * LINE_COEFFICIENT
  return lines.map((line, index) => {
    const width = getTextWidth(line, getFont(fontSize, false))
    const widthWithMargin = width + 2 * margin
    const { y = 0, x = 0, xMask = -widthWithMargin / 2, yMask = 0 } = getOffset
      ? getOffset(widthWithMargin, height, numberOfLines, index)
      : { y: 0, x: 0, xMask: 0, yMask: 0 }
    return {
      sign: `<g font-family="${FONT_FAMILY}"
           stroke="none"
           text-anchor="middle"
           dominant-baseline="middle"
           font-size="${fontSize}"
           ${fillColor}
           transform="rotate(${rotate})">
           <text transform="translate(${x}, ${y})">${line}</text>
           </g>`,
      maskRect: {
        x: xMask,
        y: yMask - height / 2,
        width: widthWithMargin,
        height: height,
      },
      top: y,
    }
  })
}

export const extractTextsSVG = ({
  string,
  fontSize,
  fontColor,
  margin = 0,
  angle = 0,
  numLineCenter,
  textAnchor = 'middle',
  lettersAlwaysUp = true,
}) => {
  const lines = string.split('\n')
  const fillColor = fontColor ? `fill="${fontColor}"` : ``
  const rotateLetter = (lettersAlwaysUp && Math.abs(angle) >= 90) ? 180 : 0
  const height = fontSize * LINE_COEFFICIENT

  const tspans = []
  const masks = []
  if (numLineCenter) {
    const dx = textAnchor === 'middle' ? 0 : (textAnchor === 'start' ? margin : -margin)
    const textTranslateY = -height * (numLineCenter - 0.5)
    const correctY = textTranslateY - height / 2
    let dy = -height
    // сборка маски и строчек текста
    lines.forEach((line, index) => {
      const width = getTextWidth(line, getFont(fontSize, false))
      const widthWithMargin = width + 2 * margin
      if (line === '') {
        dy += height
      } else {
        tspans.push(`<tspan x = "${dx}" dy="${dy + height}">${line}</tspan>`)
        masks.push({
          x: textAnchor === 'middle' ? -widthWithMargin / 2 : (textAnchor === 'start' ? 0 : -widthWithMargin),
          y: correctY + index * height,
          width: widthWithMargin,
          height: height,
          rotate: rotateLetter,
        })
        dy = 0
      }
    })
    return {
      sign: `<text font-family="${FONT_FAMILY}"
           stroke="none"
           text-anchor="${textAnchor}"
           dominant-baseline="middle"
           font-size="${fontSize}"
           ${fillColor}
           transform="rotate(${rotateLetter}) translate(0 ${textTranslateY})">
           ${tspans.join('')}
           </text>`,
      masksRect: masks,
    }
  }
}
