/* eslint-disable react/prop-types */
import React, { Fragment } from 'react'
import ReactDOMServer from 'react-dom/server'
import i18n from '../../i18n'
import { PRINT_PANEL_KEYS, COLOR_PICKER_KEYS } from '../../constants/Print'
import { pointsToD, rectToPoints } from './lines'
import { FONT_FAMILY } from './text'
import { getFont, getLines, getTextWidth } from './index'

const TextAnchors = {
  START: 'start',
  END: 'end',
  MIDDLE: 'middle',
}

const MM_PER_INCH = 25.4
const SIZE_1 = 1
const SIZE_2 = 2 / 3
const SIZE_3 = 1 / 2
const SIZE_4 = 1 / 3
const SIZE_5 = 1 / 4
const SIZE_6 = 1 / 5

const INDICATORS_WIDTH = 300
const INDICATORS_HEIGHT = 200
const INDICATORS_PADDING = 15

const SIGN_MARGING_LEFT = 200
const SIGN_WIDTH = 300
const SIGN_HEIGHT = 200
const SIGN_COLOR_ROW_WIDTH = 80
const SIGN_DESCR_ROW_WIDTH = 220

const getH = (n) => n <= 6 ? 15 : n <= 10 ? 30 : n <= 20 ? 40 : n <= 30 ? 50 : 60

const renderText = (text, x, y, fontHeight, align, key) => <Fragment key={key}>
  <text
    stroke="#fff"
    strokeWidth={fontHeight / 5}
    fill="none"
    fontSize={fontHeight}
    fontFamily={FONT_FAMILY}
    // fontWeight="bold"
    x={x}
    y={y + fontHeight * 0.77}
    textAnchor={align}
  >{text}</text>
  <text
    fill="#000"
    fontSize={fontHeight}
    fontFamily={FONT_FAMILY}
    // fontWeight="bold"
    x={x}
    y={y + fontHeight * 0.77}
    textAnchor={align}
  >{text}</text>
</Fragment>

/**
 * @description Renderer used only in Component.render method.
 * It have any context values that not needed outside Component.render
 */
class Renderer {
  constructor (width, height, h) {
    this.width = width
    this.height = height
    this.h = h
    this.top = 0
    this.bottom = height
    this.d = []
  }

  textToLines (text, scale, align, width) {
    const fontHeight = this.h * scale
    const lines = getLines(text, width, getFont(fontHeight))
    const x = (align === TextAnchors.START)
      ? ((this.width - width) / 2)
      : (align === TextAnchors.END)
        ? ((this.width + width) / 2)
        : (this.width / 2)
    return { fontHeight, lines, x, align }
  }

  topText (text, margin, scale, align = TextAnchors.START, width = this.width / 2) {
    if (!text) {
      return null
    }
    const { fontHeight, lines, x } = this.textToLines(text, scale, align, width)
    return <>
      {lines.map(({ text }, i) => {
        const y = this.top + margin
        margin = 5
        this.top = y + fontHeight
        return renderText(text, x, y, fontHeight, align, i)
      })}
    </>
  }

  bottomText (text, margin, scale, align = TextAnchors.START, width = this.width / 2) {
    if (!text) {
      return null
    }
    const { fontHeight, lines, x } = this.textToLines(text, scale, align, width)

    return <>
      {lines.reverse().map(({ text }, i) => {
        const y = this.bottom - margin
        margin = 5
        this.bottom = y - fontHeight
        return renderText(text, x, y, fontHeight, align, i)
      })}
    </>
  }

  signs (legendType, ...signs) {
    signs = signs.filter(({ text, color }) => Boolean(text) || Boolean(color))

    if (signs.length === 0) {
      return null
    }

    const titleFontSize = SIZE_3 * this.h

    const rowHeight = SIGN_HEIGHT / 5
    const colorRectSize = rowHeight / 2
    const width = SIGN_WIDTH
    const height = rowHeight * ++signs.length

    const signsFrameY = this.bottom - height
    const signsFrameX = (legendType === 'right')
      ? this.width - SIGN_MARGING_LEFT - SIGN_DESCR_ROW_WIDTH - SIGN_COLOR_ROW_WIDTH : SIGN_MARGING_LEFT

    const title = renderText(
      i18n.LEGEND.toUpperCase(),
      signsFrameX + (SIGN_DESCR_ROW_WIDTH + SIGN_COLOR_ROW_WIDTH) / 2,
      signsFrameY - titleFontSize,
      titleFontSize,
      TextAnchors.MIDDLE,
    )

    this.bottom = signsFrameY - titleFontSize

    const x = signsFrameX
    let y = signsFrameY

    // frame
    this.d.push(pointsToD(rectToPoints({ x, y, width, height }), true))

    // vertical line
    this.d.push(pointsToD([ { x: x + SIGN_COLOR_ROW_WIDTH, y }, { x: x + SIGN_COLOR_ROW_WIDTH, y: y + height } ]))

    const headerFontSize = SIZE_2 * 15

    const signTitle = renderText(
      i18n.SIGN,
      signsFrameX + SIGN_COLOR_ROW_WIDTH / 2,
      y + (rowHeight - headerFontSize) / 2,
      headerFontSize,
      TextAnchors.MIDDLE,
    )
    const descrTitle = renderText(
      i18n.SIGN_CONTENT,
      signsFrameX + SIGN_COLOR_ROW_WIDTH + SIGN_DESCR_ROW_WIDTH / 2,
      y + (rowHeight - headerFontSize) / 2,
      headerFontSize,
      TextAnchors.MIDDLE,
    )

    // line under title
    y += rowHeight
    this.d.push(pointsToD([ { x, y }, { x: x + width, y } ]))

    const els = []
    signs.forEach(({ text, color }, rowI) => {
      if (text) {
        const xDescr = signsFrameX + SIGN_COLOR_ROW_WIDTH + titleFontSize
        const { fontHeight, lines, align } =
          this.textToLines(text, SIZE_3 / this.h * 15, TextAnchors.START, SIGN_DESCR_ROW_WIDTH - titleFontSize * 2)
        let yDescr = y + (rowHeight - fontHeight * lines.length - titleFontSize / 2 * (lines.length - 1)) / 2
        lines.forEach(({ text }, lineI) => {
          els.push(renderText(text, xDescr, yDescr, fontHeight, align, `${rowI}-${lineI}`))
          yDescr += titleFontSize / 2 + fontHeight
        })
      }
      if (color) {
        const colorD = pointsToD(rectToPoints({
          x: x + (SIGN_COLOR_ROW_WIDTH - colorRectSize) / 2,
          y: y + (rowHeight - colorRectSize) / 2,
          width: colorRectSize,
          height: colorRectSize,
        }), true)
        els.push(<path key={`color-${rowI}`} fill={color} d={colorD}/>)
      }
      y += rowHeight
      this.d.push(pointsToD([ { x, y }, { x: x + width, y } ]))
    })

    return <>
      {title}{signTitle}{descrTitle}{els}
    </>
  }

  indicators (...texts) {
    texts = texts.filter(Boolean)
    if (texts.length === 0) {
      return null
    }
    const indicatorsFrameY = this.top + 40 + SIZE_3 * this.h
    const title = this.topText(i18n.MAIN_INDICATORS.toUpperCase(), 20, SIZE_3, TextAnchors.MIDDLE)
    this.top += 20

    const wrapHeight = 5
    const textWidth = INDICATORS_WIDTH - INDICATORS_PADDING * 2
    texts = texts.map((text) => this.textToLines(text, SIZE_2 / this.h * 15, TextAnchors.START, textWidth))
    const fillHeight = texts.reduce(
      (v, { lines, fontHeight }) => v + lines.length * fontHeight + (lines.length - 1) * wrapHeight,
      0,
    )
    const height = Math.min(fillHeight + INDICATORS_PADDING * 2 + (texts.length - 1) * wrapHeight * 2,
      INDICATORS_HEIGHT)
    const margin = height !== INDICATORS_HEIGHT
      ? wrapHeight * 2 : (INDICATORS_HEIGHT - INDICATORS_PADDING * 2 - fillHeight) / texts.length
    let y = this.top + INDICATORS_PADDING + margin / 2.0

    this.d.push(pointsToD(rectToPoints({
      width: INDICATORS_WIDTH,
      height: height,
      x: (this.width - INDICATORS_WIDTH) / 2,
      y: indicatorsFrameY,
    }), true))

    return <>
      {title}
      {texts.map(({ fontHeight, lines, x, align }, i) => {
        if (i > 0) {
          y += margin
        }
        return lines.map(({ text }, j) => {
          if (j > 0) {
            y += wrapHeight
          }
          const el = renderText(text, x, y, fontHeight, TextAnchors.START, `${i}-${j}`)
          y += fontHeight
          return el
        })
      })}
    </>
  }

  topRightTexts (texts) {
    texts = texts.filter(Boolean)
    const fontHeight = SIZE_5 * this.h
    const marging = 30
    const lineSpace = 5
    const y = marging
    const maxWidth = texts.reduce((width, text) => Math.max(width, this.getTextWidth(text, SIZE_5)), 0)
    const x = this.width - maxWidth - marging
    return texts.map((text, i) =>
      renderText(text, x, y + (lineSpace + fontHeight) * i, fontHeight, TextAnchors.START, i),
    )
  }

  getTextWidth (text, scale) {
    const fontHeight = Math.round(this.h * scale)
    return getTextWidth(text, `${Math.round(fontHeight)}px Arial`)
  }

  frames () {
    return Boolean(this.d.length) &&
      <path key='indicatorFrame' fill='none' stroke='#000000' strokeWidth={this.h / 30 + 1} d={this.d.join(' ')} />
  }
}

export const printLegend = (params) => {
  const {
    widthMM, heightMM, requisites, requisites: { signatories, confirmDate }, printScale, classified, selectedZone,
  } = params
  if (!requisites.legendAvailable || !requisites.legendEnabled) { return }
  const h = getH(selectedZone.lists.X * selectedZone.lists.Y)

  const renderer = new Renderer(widthMM, heightMM, h)

  let maxWidth = signatories.reduce((width, { role, name, position }) => Math.max(
    width,
    renderer.getTextWidth(role, SIZE_6) + 30 + renderer.getTextWidth(name, SIZE_4),
    Math.min(renderer.getTextWidth(position, SIZE_5), widthMM * 0.5),
  ), 0)
  maxWidth = Math.max(maxWidth, renderer.getTextWidth(confirmDate, SIZE_4))

  const dateFormat = (date, label) => {
    if (!date) { return }
    return label + ' ' + date
  }

  return <>
    {renderer.topRightTexts([ classified, i18n.MAP_COPY ])}
    {renderer.topText(requisites[PRINT_PANEL_KEYS.FIRST_ROW], 80, SIZE_1, TextAnchors.MIDDLE)}
    {renderer.topText(requisites[PRINT_PANEL_KEYS.SECOND_ROW], 25, SIZE_2, TextAnchors.MIDDLE)}
    {renderer.topText(requisites[PRINT_PANEL_KEYS.THIRD_ROW], 20, SIZE_2, TextAnchors.MIDDLE)}
    {renderer.topText(requisites[PRINT_PANEL_KEYS.FOURTH_ROW], 20, SIZE_2, TextAnchors.MIDDLE)}
    {renderer.topText(requisites[PRINT_PANEL_KEYS.FIFTH_ROW], 20, SIZE_3, TextAnchors.MIDDLE)}
    {renderer.topText(
      dateFormat(requisites[PRINT_PANEL_KEYS.START], i18n.START + ':'), 20, SIZE_3, TextAnchors.MIDDLE,
    )}
    {renderer.topText(
      dateFormat(requisites[PRINT_PANEL_KEYS.FINISH], i18n.FINISH + ':'), 20, SIZE_3, TextAnchors.MIDDLE,
    )}
    {renderer.indicators(
      requisites[PRINT_PANEL_KEYS.INDICATOR_FIRST_ROW],
      requisites[PRINT_PANEL_KEYS.INDICATOR_SECOND_ROW],
      requisites[PRINT_PANEL_KEYS.INDICATOR_THIRD_ROW],
    )}
    {renderer.bottomText(`${i18n.SCALE.toUpperCase()} 1:${printScale}`, 50, SIZE_4, TextAnchors.MIDDLE)}
    {renderer.bottomText(confirmDate, 10, SIZE_5, TextAnchors.START, maxWidth)}
    {signatories.reverse().map(({ role, name, position }, i) => <Fragment key={i}>
      {renderer.bottomText(role, 10, SIZE_6, TextAnchors.START, maxWidth)}
      {renderer.bottomText(name, -h * SIZE_6 / 2, SIZE_4, TextAnchors.END, maxWidth)}
      {renderer.bottomText(position, 5, SIZE_5, TextAnchors.START, maxWidth)}
    </Fragment>)}
    {renderer.signs(
      requisites.legendTableType,
      {
        text: requisites[PRINT_PANEL_KEYS.LEGEND_FIRST_CONTENT],
        color: requisites[COLOR_PICKER_KEYS.LEGEND_FIRST_COLOR],
      },
      {
        text: requisites[PRINT_PANEL_KEYS.LEGEND_SECOND_CONTENT],
        color: requisites[COLOR_PICKER_KEYS.LEGEND_SECOND_COLOR],
      },
      {
        text: requisites[PRINT_PANEL_KEYS.LEGEND_THIRD_CONTENT],
        color: requisites[COLOR_PICKER_KEYS.LEGEND_THIRD_COLOR],
      },
      {
        text: requisites[PRINT_PANEL_KEYS.LEGEND_FOURTH_CONTENT],
        color: requisites[COLOR_PICKER_KEYS.LEGEND_FOURTH_COLOR],
      },
    )}
    {renderer.frames()}
  </>
}

export const printLegendSvgStr = (props) => {
  const { widthMM, heightMM, dpi } = props
  return ReactDOMServer.renderToStaticMarkup(<svg
    xmlns="http://www.w3.org/2000/svg" version="1.2"
    width={widthMM * dpi / MM_PER_INCH}
    height={heightMM * dpi / MM_PER_INCH}
    viewBox={`0 0 ${widthMM} ${heightMM}`}
    fill="none"
  >{printLegend(props)}</svg>)
}
