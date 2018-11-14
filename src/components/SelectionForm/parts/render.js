import React, { Fragment } from 'react'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import { colors } from '../../../constants'
import { extractSubordinationLevelSVG } from '../../../utils/svg/milsymbol'
import { TRANSPARENT } from '../../../constants/colors'

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

const lineTypeSvg = (children) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={56} height={20} viewBox="0 0 56 20" version="1.1"
    style={{ marginRight: '0.35em' }}
  >
    {children}
  </svg>
)

const renderStyledLine = (borderStyle, level) => {
  let amp
  const dash = {}
  if (level) {
    amp = extractSubordinationLevelSVG(level, 36, 4, 56, 20)
    if (borderStyle === 'dashed') {
      dash.strokeDasharray = '3.5 1.5'
    }
  }
  if (level && amp) {
    return lineTypeSvg(
      <Fragment>
        <mask id="sign">
          <rect fill="white" x="0" y="0" width="100%" height="100%" />
          <g dangerouslySetInnerHTML={{ __html: amp.mask }} />
        </mask>
        <path mask="url(#sign)" stroke="rgba(0,0,0,0.65)" strokeWidth="2" d="M0,10 h56 m1,1" {...dash} />
        <g stroke="black" strokeWidth="4" fill="none" transform={`translate(28,10)`} dangerouslySetInnerHTML={{ __html: amp.sign }} />
      </Fragment>
    )
  } else {
    switch (borderStyle) {
      case 'waved':
        return lineTypeSvg(
          <Fragment>
            <path
              stroke="rgba(0,0,0,0.65)"
              strokeWidth="2"
              fill="none"
              d="M0,16 C0,4 16,4 16,16 C16,4 32,4 32,16 C32,4 48,4 48,16 C48,10 52,7 56,7"
            />
          </Fragment>
        )
      case 'stroked':
        return lineTypeSvg(
          <Fragment>
            <path
              stroke="rgba(0,0,0,0.65)"
              strokeWidth="2"
              fill="none"
              d="M0,16 h56 M4,4 v12 M16,4 v12 M28,4 v12 M40,4 v12 M52,4 v12"
            />
          </Fragment>
        )
      default:
        return (
          <div className="option-line-type" style={{ borderStyle }} />
        )
    }
  }
}

// dangerouslySetInnerHTML={{ __html: getNato(NATOData) }}
export const typeDiv = (borderStyle, title, level) => (
  <div className="icon-option">
    {renderStyledLine(borderStyle, level)}
    <div className="icon-text">{title}</div>
  </div>
)

export const typeOption = (value, borderStyle, title, level) => (
  <Option value={value}>
    {typeDiv(borderStyle, title, level)}
  </Option>
)
