import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import PopupPanel from '../PopupPanel'
import SegmentButtonPopover from '../SegmentButtonPopover'
import convertUnits from '../../utilsMarch/convertUnits'
import { MARCH_COLOR, MARCH_POINT_TYPES as pointTypes, MARCH_TYPES } from '../../../../../constants/March'
import AddSegmentContextMenu from '../AddSegmentContextMenu'
import utilsMarch from '../../utilsMarch'
import { MOUSE_ENTER_DELAY } from '../../../../../constants/tooltip'
import i18n from './../../../../../i18n'

const { getAllowedTypeSegments } = utilsMarch.reducersHelpers

const { msToTime } = convertUnits
const { OWN_RESOURCES, BY_RAILROAD, BY_SHIPS, COMBINED } = MARCH_TYPES
const { OWN_RESOURCES_BRUSH, BY_RAILROAD_BRUSH, BY_SHIPS_BRUSH, COMBINED_BRUSH, DEFAULT_BRUSH } = MARCH_COLOR

const SegmentBlock = (props) => {
  const {
    segment,
    addSegment,
    segmentId,
    timeDistanceView,
    segments,
    toggleDeleteMarchPointModal,
    readOnly,
    hideIntermediate,
    childrenIsPresent,
  } = props
  const { type, children, metric = {} } = segment

  const [ isViewContextMenu, changeViewContextMenu ] = useState(false)
  const [ allowedTypeSegments, changeAllowedTypeSegments ] = useState([])

  let { time: refTime, distance: refDistance } = metric.reference
  let { time: prevTime, distance: prevDistance } = metric.untilPrevious

  refTime = refTime || 0
  refDistance = refDistance || 0
  prevTime = prevTime || 0
  prevDistance = prevDistance || 0

  if (type === 0) {
    return <div className={'segment'}/>
  }
  let color
  switch (type) {
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

  const onAddSegment = (segmentId) => {
    const allowedTypeSegments = getAllowedTypeSegments(segments, segmentId)
    const typesLength = allowedTypeSegments.length

    if (typesLength === 0) {
      return
    }

    if (typesLength > 1) {
      changeViewContextMenu(true)
      changeAllowedTypeSegments(allowedTypeSegments)
    } else {
      addSegment(segmentId, allowedTypeSegments[0])
    }
  }

  return (<div className={'segment'} style={{ backgroundColor: color }}>
    {segmentId !== 0
      ? <div className={'time-distance height-segment'}>
        <span>{startingPoint.time}</span>
        <span className={'distance'}>{startingPoint.distance} км</span>
      </div>
      : <div className={'height-segment'}/>
    }

    <Tooltip
      mouseEnterDelay={MOUSE_ENTER_DELAY}
      placement='topRight'
      title={i18n.SEGMENT_PARAMETERS}
      align={{ offset: [ -7, 25 ] }}
    >
      <SegmentButtonPopover
        type={type}
        content={
          <PopupPanel
            propData={{
              ...segment,
              segmentType: segment.type,
              segmentId,
              metric,
              toggleDeleteMarchPointModal,
              readOnly,
            }}/>
        }
      />
    </Tooltip>

    {childrenIsPresent && children.map((child, id) => {
      if (!metric.children[id] || (hideIntermediate && child.type === pointTypes.INTERMEDIATE_POINT)) {
        return null
      }
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
      <Tooltip
        mouseEnterDelay={MOUSE_ENTER_DELAY}
        placement='topRight'
        title={i18n.ADD_SEGMENT}
        align={{ offset: [ 13, 0 ] }}
      >
        {!readOnly && <div className={'add-segment-button'} onClick={() => onAddSegment(segmentId)}/>}
      </Tooltip>
      {isViewContextMenu && <AddSegmentContextMenu
        changeViewContextMenu={changeViewContextMenu}
        addSegment={addSegment}
        typeSegments={allowedTypeSegments}
        segmentId={segmentId}
      />}
    </div>
  </div>)
}

SegmentBlock.propTypes = {
  segmentId: PropTypes.number.isRequired,
  segment: PropTypes.shape({
    type: PropTypes.number.isRequired,
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
        time: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.instanceOf(null),
        ]),
        distance: PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.instanceOf(null),
        ]),
      }).isRequired,
    }).isRequired,
  }).isRequired,
  addSegment: PropTypes.func.isRequired,
  timeDistanceView: PropTypes.bool.isRequired,
  segments: PropTypes.array.isRequired,
  toggleDeleteMarchPointModal: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  childrenIsPresent: PropTypes.bool.isRequired,
  hideIntermediate: PropTypes.bool.isRequired,
}

export default React.memo(SegmentBlock)
