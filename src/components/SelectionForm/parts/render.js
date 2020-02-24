import React from 'react'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import { colors } from '../../../constants'
import { extractSubordinationLevelSVG } from '../../../utils/svg/milsymbol'
import { TRANSPARENT } from '../../../constants/colors'
import { getStylesForLineType, settings } from '../../../utils/svg/lines'

const { LINE_WIDTH } = settings
const { Option } = Select
const { icons: { Icon } } = components

export const colorDiv = (color) => (
  <div className="icon-option">
    <div
      className="icon-rect"
      style={{ backgroundColor: color === TRANSPARENT ? 'transparent' : colors.values[color] }}
    />
    <div className="icon-text">{colors.titles[color]}</div>
  </div>
)
export const colorOption = (color) => (
  <Option value={color}>
    {colorDiv(color)}
  </Option>
)

export const iconDiv = (icon, title) => (
  <div className="icon-option">
    <Icon icon={icon} className="icon-rect"/>
    <div className="icon-text">{title}</div>
  </div>
)
export const iconOption = (value, icon, title) => (
  <Option value={value}>
    {iconDiv(icon, title)}
  </Option>
)

const optionsSvg = (children) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={56} height={20} viewBox="0 0 56 20" version="1.1"
    style={{ marginRight: '0.35em' }}
  >
    {children}
  </svg>
)

export const renderStyledLine = (borderStyle, level, strokeWidth = LINE_WIDTH) => {
  let amp
  let dash = {}
  if (level) {
    amp = extractSubordinationLevelSVG(level, 36, 4, 56, 20)
    dash = getStylesForLineType(borderStyle)
  }
  if (level && amp) {
    return optionsSvg(
      <>
        <mask id="sign">
          <rect fill="white" x="0" y="0" width="100%" height="100%"/>
          <rect
            fill="black"
            x={amp.maskRect.x}
            y={amp.maskRect.y}
            width={amp.maskRect.width}
            height={amp.maskRect.height}
          />
        </mask>
        <path mask="url(#sign)" stroke="rgba(0,0,0,0.65)" strokeWidth={strokeWidth} d="M0,10 h56 m1,1" {...dash} />
        <g
          stroke="black"
          strokeWidth="4"
          fill="none"
          transform={`translate(28,10)`}
          dangerouslySetInnerHTML={{ __html: amp.sign }}
        />
      </>,
    )
  } else {
    switch (borderStyle) {
      case 'waved':
        return optionsSvg(
          <>
            <path
              stroke="rgba(0,0,0,0.65)"
              strokeWidth={strokeWidth}
              fill="none"
              d="M0,16 C0,4 16,4 16,16 C16,4 32,4 32,16 C32,4 48,4 48,16 C48,10 52,7 56,7"
            />
          </>,
        )
      case 'waved2':
        return optionsSvg(
          <>
            <path
              stroke="rgba(0,0,0,0.65)"
              strokeWidth={strokeWidth}
              fill="none"
              d="M0,16 C0,4 16,4 16,16 C16,4 32,4 32,16 C32,4 48,4 48,16 C48,10 52,7 56,7 L0,7"
            />
          </>,
        )
      case 'stroked':
        return optionsSvg(
          <>
            <path
              stroke="rgba(0,0,0,0.65)"
              strokeWidth={strokeWidth}
              fill="none"
              d="M0,16 h56 M4,4 v12 M16,4 v12 M28,4 v12 M40,4 v12 M52,4 v12"
            />
          </>,
        )
      case 'chain':
        return optionsSvg(
          <>
            <path
              mask="url(#sign)"
              stroke="rgba(0,0,0,0.65)"
              strokeWidth={strokeWidth}
              d="M0,10 h56 m1,1"
              strokeDasharray={'6 3 2 3'}
            />
          </>,
        )
      default:
        return (
          <div
            className="option-line-type"
            style={{ borderStyle, borderWidth: strokeWidth ? `${strokeWidth / 2}px` : 1 }}
          />
        )
    }
  }
}

const renderLineEnds = (type, direction) => {
  const angle = direction === 'right' ? 0 : 180
  let picture = null
  switch (type) {
    case 'none':
      picture = (
        <g transform={`rotate(${angle},28,10)`}>
          <path
            stroke="rgba(0,0,0,0.65)"
            strokeWidth="2"
            fill="none"
            d="M0,10 h48"
          />
        </g>
      )
      break
    case 'arrow1':
      picture = (
        <g transform={`rotate(${angle},28,10)`}>
          <path
            stroke="rgba(0,0,0,0.65)"
            strokeWidth="2"
            fill="none"
            d="M0,10 h48 M42,4 l6,6 l-6,6"
          />
        </g>
      )
      break
    case 'arrow2':
      picture = (
        <g transform={`rotate(${angle},28,10)`}>
          <path
            stroke="rgba(0,0,0,0.65)"
            strokeWidth="2"
            fill="none"
            d="M0,10 h36"
          />
          <path
            strokeWidth="0"
            fill="rgba(0,0,0,0.65)"
            d="M36,4 l12,6 l-12,6 z"
          />
        </g>
      )
      break
    case 'arrow3':
      picture = (
        <g transform={`rotate(${angle},28,10)`}>
          <path
            stroke="rgba(0,0,0,0.65)"
            strokeWidth="2"
            fill="none"
            d="M0,10 h48 M43,5 l5,5 -5,5 v5 l10,-10 -10,-10 v5"
          />
        </g>
      )
      break
    case 'arrow4':
      picture = (
        <g transform={`rotate(${angle},28,10)`}>
          <path
            stroke="rgba(0,0,0,0.65)"
            strokeWidth="2"
            fill="none"
            d="M0,10 h48 M43,5 l5,5 -5,5"
          />
          <path
            stroke="rgba(0,0,0,0.65)"
            strokeWidth="2"
            strokeDasharray="4,2"
            fill="none"
            d="M43,20 l10,-10 -10,-10"
          />
        </g>
      )
      break
    case 'stroke1':
      picture = (
        <g transform={`rotate(${angle},28,10)`}>
          <path
            stroke="rgba(0,0,0,0.65)"
            strokeWidth="2"
            fill="none"
            d="M0,10 h48 M48,4 v12"
          />
        </g>
      )
      break
    case 'stroke2':
      picture = (
        <g transform={`rotate(${angle},28,10)`}>
          <path
            stroke="rgba(0,0,0,0.65)"
            strokeWidth="2"
            fill="none"
            d="M0,10 h48 M45,4 l6,12"
          />
        </g>
      )
      break
    case 'stroke3':
      picture = (
        <g transform={`rotate(${angle},28,10)`}>
          <path
            stroke="rgba(0,0,0,0.65)"
            strokeWidth="2"
            fill="none"
            d="M0,10 h48 M51,4 l-6,12"
          />
        </g>
      )
      break
    case 'fork':
      picture = (
        <g transform={`rotate(${angle},28,10)`}>
          <path
            stroke="rgba(0,0,0,0.65)"
            strokeWidth="2"
            fill="none"
            d="M0,10 h42 M48,4 l-6,6 6,6"
          />
        </g>
      )
      break
    case 'cross':
      picture = (
        <g transform={`rotate(${angle},28,10)`}>
          <path
            stroke="rgba(0,0,0,0.65)"
            strokeWidth="2"
            fill="none"
            d="M0,10 h43 M38,0 l10,20 M48,0 l-10,20"
          />
        </g>
      )
      break
    default:
      break
  }
  return optionsSvg(picture)
}

export const renderNodes = (type) => {
  let picture = null
  switch (type) {
    case 'none':
      picture = (
        <path
          stroke="rgba(0,0,0,0.65)"
          strokeWidth="2"
          fill="none"
          d="M0,10 h56"
        />
      )
      break
    case 'cross-circle':
      picture = (
        <g stroke="rgba(0,0,0,0.65)" strokeWidth="2" fill="none">
          <path d="M0,10 h20 M36,10 h20 M22.34,4.34 l11.31,11.31 M22.34,15.66 l11.31,-11.31"/>
          <circle cx="28" cy="10" r="8"/>
        </g>
      )
      break
    case 'square':
      picture = (
        <g stroke="rgba(0,0,0,0.65)" strokeWidth="2" fill="none">
          <path d="M0,10 h20 M36,10 h20"/>
          <rect x="20" y="2" width="16" height="16"/>
        </g>
      )
      break
    default:
      break
  }
  return optionsSvg(picture)
}

// dangerouslySetInnerHTML={{ __html: getNato(NATOData) }}
export const typeDiv = (borderStyle, title, level, strokeWidth) => (
  <div className="icon-option">
    {renderStyledLine(borderStyle, level, strokeWidth)}
    <div className="icon-text">{title}</div>
  </div>
)

export const typeOption = (value, borderStyle, title, level, strokeWidth) => (
  <Option key={value} value={value}>
    {typeDiv(borderStyle, title, level, strokeWidth)}
  </Option>
)

export const endsDiv = ({ value, text }, direction) => ( // eslint-disable-line react/prop-types,react/display-name
  <div className="icon-option">
    {renderLineEnds(value, direction)}
    <div className="icon-text">{text}</div>
  </div>
)

export const endsOption = (endsInfo, direction) => (
  <Option value={endsInfo.value}>
    {endsDiv(endsInfo, direction)}
  </Option>
)

export const nodesDiv = ({ value, text }) => ( // eslint-disable-line react/prop-types,react/display-name
  <div className="icon-option">
    {renderNodes(value)}
    <div className="icon-text">{text}</div>
  </div>
)

export const nodesOption = (nodesInfo) => (
  <Option value={nodesInfo.value} key={nodesInfo.value}>
    {nodesDiv(nodesInfo)}
  </Option>
)
