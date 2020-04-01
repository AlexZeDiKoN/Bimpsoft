import { Tooltip } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import PopupPanel from '../PopupPanel'
import SegmentButtonPopover from '../SegmentButtonPopover'
import formulas from '../../formulas'

const { getTruckSegmentDetails, getTrainOrShipSegmentDetails } = formulas.marchTime

const SegmentBlock = (props) => {
  const { segment, nextSegment, addSegment, deleteSegment, segmentId, dataMarch } = props
  const { segmentType, children } = segment

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

  const segmentDetails = segmentType === 41
    ? getTruckSegmentDetails(segment, nextSegment, dataMarch)
    : getTrainOrShipSegmentDetails(segment, nextSegment, dataMarch)

  return (<div className={'segment'} style={{ backgroundColor: color }}>
    <SegmentButtonPopover
      segmentType={segmentType}
      content={ <PopupPanel propData={{ ...segment, segmentId, deleteSegment }} /> }
    />

    {children && children.map((child, id) => {
      return (
        <div key={id} className={'time-distance'}>
          <span>00:00</span>
          <span className={'distance'}>10 km</span>
        </div>
      )
    })}

    <div className={'hover-add-segment-button'}>
      <Tooltip placement='topRight' title={'Додати ділянку'}>
        <div className={'add-segment-button'} onClick={() => addSegment(segmentId)}/>
      </Tooltip>
    </div>
  </div>)
}

SegmentBlock.propTypes = {
  segmentId: PropTypes.number.isRequired,
  segment: PropTypes.shape({
    segmentType: PropTypes.number.isRequired,
    children: PropTypes.array.isRequired,
  }).isRequired,
  nextSegment: PropTypes.shape({}),
  addSegment: PropTypes.func.isRequired,
  deleteSegment: PropTypes.func.isRequired,
  dataMarch: PropTypes.shape({}),
}

export default SegmentBlock
