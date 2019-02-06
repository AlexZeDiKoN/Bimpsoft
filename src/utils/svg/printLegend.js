import { PRINT_PANEL_KEYS } from '../../constants/PrintPanel'
import { rectToPoints } from './lines'
import { getFont, getLines, getTextWidth } from './index'

const SIZE_1 = 1
const SIZE_2 = 2 / 3
const SIZE_3 = 1 / 2
const SIZE_4 = 1 / 3
const SIZE_5 = 1 / 4
const SIZE_6 = 1 / 5

const getH = (n) => n <= 6 ? 15 : n <= 10 ? 30 : n <= 20 ? 40 : n <= 30 ? 50 : 60

/**
 * @description Renderer used only in Component.render method.
 * It have any context values that not needed outside Component.render
 */
class Renderer {
  constructor (renderStrategy, width, height, h) {
    this.renderStrategy = renderStrategy
    this.width = width
    this.height = height
    this.h = h
    this.top = 0
    this.bottom = height
  }

  topText (text, margin, scale) {
    if (!text) {
      return null
    }

    const fontHeight = this.h * scale
    const lines = getLines(text, this.width / 2, getFont(fontHeight))
    return lines.map(({ text }) => {
      const y = this.top + margin
      margin = 5
      this.top = y + fontHeight
      return this.renderStrategy.text({
        key: text,
        y,
        x: this.width / 2,
        width: this.width,
        height: fontHeight,
        font: getFont(fontHeight),
        fill: '#000000',
        textAnchor: 'middle',
        alignmentBaseline: 'hanging',
        text,
      })
    })
  }

  bottomText (text, margin, scale, align = 'start', width = this.width / 2) {
    if (!text) {
      return null
    }
    const fontHeight = this.h * scale
    const lines = getLines(text, width, getFont(fontHeight))
    const x = (align === 'start')
      ? ((this.width - width) / 2)
      : (align === 'end')
        ? ((this.width + width) / 2)
        : (this.width / 2)
    return lines.reverse().map(({ text }) => {
      const y = this.bottom - margin
      margin = 5
      this.bottom = y - fontHeight
      return this.renderStrategy.text({
        key: text,
        y,
        x,
        width,
        height: fontHeight,
        font: getFont(fontHeight),
        fill: '#000000',
        textAnchor: align,
        alignmentBaseline: 'hanging',
        text,
      })
    })
  }

  indicator (text) {
    const els = []
    if (text) {
      if (!this.indicatorTop) {
        els.push(this.topText('ОСНОВНІ ПОКАЗНИКИ', 30, SIZE_3))
        this.top += 20
        this.indicatorTop = this.top
      }
      els.push(this.topText(text, 20, SIZE_3))
      this.indicatorBottom = this.top
    }
    return els
  }

  getTextWidth (text, scale) {
    const fontHeight = Math.round(this.h * scale)
    return getTextWidth(text, `${Math.round(fontHeight)}px Arial`)
  }

  frames () {
    const els = []

    if (this.indicatorTop) {
      const width = 300
      const height = this.indicatorBottom - this.indicatorTop + (20)
      const x = (this.width - width) / 2
      const y = this.indicatorTop
      const points = rectToPoints({ width, height, x, y })
      els.push(this.renderStrategy.path({
        key: 'indicatorFrame',
        fill: 'none',
        stroke: '#000000',
        strokeWidth: this.h / 20,
        points,
      }))
    }
    return els
  }
}

export const printLegend = (renderStrategy) =>
  ({ widthMM, heightMM, dpi, requisites, signatories, confirmDate, printScale }) => {
    const h = getH(6)

    const renderer = new Renderer(renderStrategy, widthMM, heightMM, h)

    let maxWidth = signatories.reduce((width, { role, name, position }) => Math.max(
      width,
      renderer.getTextWidth(role, SIZE_6) + 30 + renderer.getTextWidth(name, SIZE_4),
      renderer.getTextWidth(position, SIZE_5)
    ), 0)
    maxWidth = Math.max(maxWidth, renderer.getTextWidth(confirmDate, SIZE_4))

    const els = [
      renderer.topText(requisites[PRINT_PANEL_KEYS.FIRST_ROW], 80, SIZE_1),
      renderer.topText(requisites[PRINT_PANEL_KEYS.SECOND_ROW], 25, SIZE_2),
      renderer.topText(requisites[PRINT_PANEL_KEYS.THIRD_ROW], 20, SIZE_2),
      renderer.topText(requisites[PRINT_PANEL_KEYS.FOURTH_ROW], 20, SIZE_2),
      renderer.topText(requisites[PRINT_PANEL_KEYS.FIFTH_ROW], 20, SIZE_3),
      renderer.topText(requisites[PRINT_PANEL_KEYS.START], 20, SIZE_3),
      renderer.topText(requisites[PRINT_PANEL_KEYS.FINISH], 20, SIZE_3),
      ...renderer.indicator(requisites[PRINT_PANEL_KEYS.INDICATOR_FIRST_ROW]),
      ...renderer.indicator(requisites[PRINT_PANEL_KEYS.INDICATOR_SECOND_ROW]),
      ...renderer.indicator(requisites[PRINT_PANEL_KEYS.INDICATOR_THIRD_ROW]),
      renderer.bottomText(`МАСШТАБ 1:${printScale}`, 50, SIZE_4, 'middle', maxWidth),
      renderer.bottomText(confirmDate, 10, SIZE_4, 'start', maxWidth),
    ]
    signatories.forEach(({ role, name, position }, i) =>
      els.push(
        renderer.bottomText(role, 10, SIZE_6, 'start', maxWidth),
        renderer.bottomText(name, -h * SIZE_6, SIZE_4, 'end', maxWidth),
        renderer.bottomText(position, 10, SIZE_5, 'start', maxWidth),
      )
    )
    els.push(...renderer.frames())
    return els
  }
