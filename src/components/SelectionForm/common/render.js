import React from 'react'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import { colors } from '../../../constants'

const { Option } = Select
const { icons: { Icon } } = components

export const colorOption = (color, title) => (
  <Option value={color}>
    <div className="icon-option">
      <div className="icon-rect" style={{ backgroundColor: colors.values[color] }}></div>
      <div className="icon-text">{title}</div>
    </div>
  </Option>
)

export const iconOption = (value, icon, title) => (
  <Option value={value}>
    <div className="icon-option">
      <Icon icon={icon} className="icon-rect"/>
      <div className="icon-text">{title}</div>
    </div>
  </Option>
)

export const typeOption = (value, borderStyle, title) => (
  <Option value={value}>
    <div className="icon-option">
      <div className="option-line-type" style={{ borderStyle }}></div>
      <div className="icon-text">{title}</div>
    </div>
  </Option>
)
