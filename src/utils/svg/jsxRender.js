/* eslint-disable react/prop-types */
import React from 'react'
import { pointsToD } from './lines'

export const text = ({ text: s, font, strokeWidth, x, y, ...attrs }) => {
  strokeWidth && (attrs.strokeWidth = Math.round(strokeWidth))
  x && (attrs.x = Math.round(x))
  y && (attrs.y = Math.round(y))
  return <text
    fill="#000"
    style={{ font: font, whiteSpace: 'pre' }}
    {...attrs}
  >{s}</text>
}

export const svg = (children, { width, height, ...attrs }) =>
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} {...attrs}>
    {children}
  </svg>

export const path = ({ points, strokeWidth, ...attrs }) => {
  strokeWidth && (attrs.strokeWidth = Math.round(strokeWidth))
  return <path {...attrs} d={pointsToD(points, true)}/>
}
