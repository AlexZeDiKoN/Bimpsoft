import { Tooltip } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import PopupPanel from '../PopupPanel'
import SegmentButtonPopover from '../SegmentButtonPopover'
import convertUnits from '../../utilsMarch/convertUnits'
import { MARCH_COLOR, MARCH_TYPES } from '../../../../../constants/March'
import i18n from './../../../../../i18n'

const { msToTime } = convertUnits
const { OWN_RESOURCES, BY_RAILROAD, BY_SHIPS, COMBINED } = MARCH_TYPES
const { OWN_RESOURCES_BRUSH, BY_RAILROAD_BRUSH, BY_SHIPS_BRUSH, COMBINED_BRUSH, DEFAULT_BRUSH } = MARCH_COLOR

const SegmentBlock = (props) => {
  const { segment, addSegment, deleteSegment, segmentId, timeDistanceView } = props
  const { segmentType, children, metric } = segment
  const { time: refTime = 0, distance: refDistance = 0 } = metric.reference
  const { time: prevTime, distance: prevDistance } = metric.untilPrevious

  if (segmentType === 0) {
    return null
  }
  let color = ''
  switch (segmentType) {
    case (OWN_RESOURCES):
      color = OWN_RESOURCES_BRUSH
      break
    case (BY_RAILROAD):
      color = BY_RAILROAD_BRUSH
      break
    case (BY_SHIPS):
      color = BY_SHIPS_BRUSH
      break
    case (COMBINED):
      color = COMBINED_BRUSH
      break
    default:
      color = DEFAULT_BRUSH
      break
  }

  const timeOffset = timeDistanceView ? refTime : 0
  const distanceOffset = timeDistanceView ? refDistance : 0
  const startingPoint = {
    time: msToTime(timeDistanceView ? refTime : prevTime),
    distance: (timeDistanceView ? refDistance : prevDistance).toFixed(1),
  }

  const childrenIsPresent = children && children.length > 0

  return (<div className={'segment'} style={{ backgroundColor: color }}>
    {segmentId !== 0
      ? <div className={'time-distance height-segment'}>
        <span>{startingPoint.time}</span>
        <span className={'distance'}>{startingPoint.distance} км</span>
      </div>
      : <div className={'height-segment'}/>
    }

    <SegmentButtonPopover
      segmentType={segmentType}
      content={ <PopupPanel propData={{ ...segment, segmentId, deleteSegment, metric }} /> }
    />

    {childrenIsPresent && children.map((child, id) => {
      const { distance, time } = metric.children[id]
      const timeWithOffset = msToTime(time + timeOffset)
      const distanceWithOffset = (distance + distanceOffset).toFixed(1)

      return (
        <div key={id} className={'time-distance'}>
          <span>{timeWithOffset}</span>
          <span className={'distance'}>{distanceWithOffset} км</span>
        </div>
      )
    })}

    <div className={'hover-add-segment-button'}>
      <Tooltip placement='topRight' title={i18n.ADD_SEGMENT}>
        <div className={'add-segment-button'} onClick={() => addSegment(segmentId)}/>
      </Tooltip>
    </div>
  </div>)
}

SegmentBlock.propTypes = {
  segmentId: PropTypes.number.isRequired,
  segment: PropTypes.shape({
    segmentType: PropTypes.number.isRequired,
    children: PropTypes.array,
    metric: PropTypes.shape({
      children: PropTypes.arrayOf(
        PropTypes.shape({
          time: PropTypes.number,
          distance: PropTypes.number,
        })).isRequired,
      reference: PropTypes.shape({
        time: PropTypes.number.isRequired,
        distance: PropTypes.number.isRequired,
      }).isRequired,
      untilPrevious: PropTypes.shape({
        time: PropTypes.number.isRequired,
        distance: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  addSegment: PropTypes.func.isRequired,
  deleteSegment: PropTypes.func.isRequired,
  timeDistanceView: PropTypes.bool.isRequired,
}

export default React.memo(SegmentBlock)
