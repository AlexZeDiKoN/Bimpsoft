import { Tooltip } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import PopupPanel from '../PopupPanel'
import SegmentButtonPopover from '../SegmentButtonPopover'

const SegmentBlock = (props) => {
  const { segment, addSegment, deleteSegment, segmentId } = props
  const { segmentType } = segment

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

  return (<div className={'segment'} style={{ backgroundColor: color }}>
    <SegmentButtonPopover
      segmentType={segmentType}
      content={ <PopupPanel propData={{ ...segment, segmentId, deleteSegment }} /> }
    />

    <div className={'timeDistance'}>
      <span>00:00</span>
      <span className={'distance'}>10 km</span>
    </div>
    <div className={'timeDistance'}>
      <span>00:00</span>
      <span className={'distance'}>10 km</span>
    </div>
    <div className={'timeDistance'}>
      <span>00:00</span>
      <span className={'distance'}>10 km</span>
    </div>
    <div className={'hoverAddSegmentButton'}>
      <Tooltip placement='topRight' title={'Додати ділянку'}>
        <div className={'addSegmentButton'} onClick={() => addSegment(segmentId)}/>
      </Tooltip>
    </div>
  </div>)
}

SegmentBlock.propTypes = {
  segmentId: PropTypes.number.isRequired,
  segment: PropTypes.shape({
    segmentType: PropTypes.number.isRequired,
  }).isRequired,
  addSegment: PropTypes.func.isRequired,
  deleteSegment: PropTypes.func.isRequired,
}

export default SegmentBlock
