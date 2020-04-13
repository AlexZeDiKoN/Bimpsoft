import { Tooltip } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import PopupPanel from '../PopupPanel'
import SegmentButtonPopover from '../SegmentButtonPopover'
import i18n from './../../../../../i18n'

const SegmentBlock = (props) => {
  const { segment, addSegment, deleteSegment, segmentId, segmentDetails } = props
  const { segmentType, children } = segment
  const { time: refTime, distance: refDistance } = segmentDetails.referenceData

  if (segmentType === 0) {
    return null
  }
  let color = ''
  switch (segmentType) {
    case (41):
      color = '#DFE3B4'
      break
    case (42):
      color = '#FFE0A4'
      break
    case (43):
      color = '#94D8FF'
      break
    case (44):
      color = '#5bb24e'
      break
    default:
      break
  }

  const getFormatTime = (time) => {
    const hour = time.toFixed(0)
    const minutes = ((time % 1) * 60).toFixed(0)
    return time === Infinity ? '-- / --' : `${hour}:${minutes}`
  }

  const childrenIsPresent = children && children.length > 0

  return (<div className={'segment'} style={{ backgroundColor: color }}>
    {segmentId !== 0
      ? <div className={'time-distance'} style={ { height: '35px' } }>
        <span>{getFormatTime(refTime)}</span>
        <span className={'distance'}>{refDistance.toFixed(1)} км</span>
      </div>
      : <div style={ { height: '35px' } }/>
    }

    <SegmentButtonPopover
      segmentType={segmentType}
      content={ <PopupPanel propData={{ ...segment, segmentId, deleteSegment, segmentDetails }} /> }
    />

    {childrenIsPresent && children.map((child, id) => {
      const { distance, time } = segmentDetails.childSegments[id]
      const formatTotalTime = getFormatTime(time)

      return (
        <div key={id} className={'time-distance'}>
          <span>{formatTotalTime}</span>
          <span className={'distance'}>{distance} км</span>
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
  }).isRequired,
  segmentDetails: PropTypes.shape({
    childSegments: PropTypes.array.isRequired,
    totalTime: PropTypes.number.isRequired,
    totalDistance: PropTypes.number.isRequired,
    referenceData: PropTypes.shape({
      time: PropTypes.number.isRequired,
      distance: PropTypes.number.isRequired,
    }).isRequired,
  }),
  referenceData: PropTypes.shape({
    time: PropTypes.array.isRequired,
    distance: PropTypes.number.isRequired,
  }),
  addSegment: PropTypes.func.isRequired,
  deleteSegment: PropTypes.func.isRequired,
  timeDistanceView: PropTypes.bool.isRequired,
}

export default SegmentBlock
