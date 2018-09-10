import React from 'react'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import { colors } from '../../../constants'

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

export const typeDiv = (borderStyle, title) => (
  <div className="icon-option">
    <div className="option-line-type" style={{ borderStyle }}></div>
    <div className="icon-text">{title}</div>
  </div>
)
export const typeOption = (value, borderStyle, title) => (
  <Option value={value}>
    {typeDiv(borderStyle, title)}
  </Option>
)
