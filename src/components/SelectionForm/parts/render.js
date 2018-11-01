import React from 'react'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import { colors } from '../../../constants'
import { extractSubordinationLevelSVG } from '../../../utils/svg/milsymbol'

const { Option } = Select
const { icons: { Icon } } = components

export const colorDiv = (color) => (
  <div className="icon-option">
    <div className="icon-rect" style={{ backgroundColor: colors.values[color] }}></div>
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

// dangerouslySetInnerHTML={{ __html: getNato(NATOData) }}
export const typeDiv = (borderStyle, title, level) => {
  let amp
  const dash = {}
  if (level) {
    amp = extractSubordinationLevelSVG(level, 36, 4, 56, 20)
    if (borderStyle === 'dashed') {
      dash.strokeDasharray = '4 1'
    }
  }
  return (
    <div className="icon-option">
      {level && amp
        ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={56} height={20} viewBox="0 0 56 20" version="1.1"
            style={{ marginRight: '0.35em' }}
          >
            <mask id="sign">
              <rect fill="white" x="0" y="0" width="100%" height="100%" />
              <g dangerouslySetInnerHTML={{ __html: amp.mask }} />
            </mask>
            <path mask="url(#sign)" stroke="rgba(0,0,0,0.65)" strokeWidth="2.5" d="M0,10 h56 m1,1" {...dash} />
            <g stroke="black" strokeWidth="4" fill="none" transform={`translate(28,10)`} dangerouslySetInnerHTML={{ __html: amp.sign }} />
          </svg>
        )
        : (
          <div className="option-line-type" style={{ borderStyle }} />
        )
      }
      <div className="icon-text">{title}</div>
    </div>
  )
}

export const typeOption = (value, borderStyle, title, level) => (
  <Option value={value}>
    {typeDiv(borderStyle, title, level)}
  </Option>
)
