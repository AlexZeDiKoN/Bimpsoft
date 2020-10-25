import React from 'react'
import PropTypes from 'prop-types'
import { Line } from '@nivo/line'

export const LEGEND_ITEM_HEIGHT = 16
export const LEGEND_SYMBOL_SIZE = 12
export const LEGEND_ITEM_SPACING = 2
export const BOTTOM_AXIS_LEGEND_MARKER_OFFSET = 35
export const LEGEND_MARGIN_FROM_X_AXIS = BOTTOM_AXIS_LEGEND_MARKER_OFFSET + 15

/**
 * Calculate legend height (in pixels) based on legend items amount
 *
 * @param {Number} legendItemsAmount Non-negative amount of legend items
 * @returns {Number} Returns legend height in pixels
 */
export function getLegendHeight (legendItemsAmount) {
  if (legendItemsAmount < 1) {
    return 0
  }

  const legendItemHeightWithSpacing = LEGEND_ITEM_HEIGHT + LEGEND_ITEM_SPACING
  return legendItemsAmount * legendItemHeightWithSpacing + LEGEND_MARGIN_FROM_X_AXIS
}

function NivoLine ({ data, curve = 'cardinal', bottomAxisName, leftAxisName }) {
  const legendHeight = getLegendHeight(data.length)
  return (
    <Line
      data={data}
      width={850}
      height={400}
      curve={curve}
      margin={{
        'top': 30,
        'right': 20,
        'bottom': legendHeight + 10,
        'left': 40,
      }}
      xScale={{
        'type': 'linear',
      }}
      yScale={{
        'type': 'linear',
        'stacked': false,
        'min': 'auto',
        'max': 'auto',
      }}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: bottomAxisName,
        legendOffset: 36,
        legendPosition: 'middle',
      }}
      axisLeft={{
        'orient': 'left',
        'tickSize': 5,
        'tickPadding': 5,
        'tickRotation': 0,
        'legend': leftAxisName,
        'legendOffset': -35,
        'legendPosition': 'middle',
      }}
      dotSize={8}
      dotColor='inherit:darker(0.3)'
      dotBorderWidth={0}
      dotBorderColor='#ffffff'
      dotLabel='y'
      dotLabelYOffset={-12}
      animate={false}
    />
  )
}

NivoLine.propTypes = {
  data: PropTypes.array.isRequired,
  curve: PropTypes.string.isRequired,
  bottomAxisName: PropTypes.string,
  leftAxisName: PropTypes.string,
}

NivoLine.defaultProps = {
  bottomAxisName: '',
  leftAxisName: '',
}

export default NivoLine
