import React, { useState } from 'react'
import PropTypes from 'prop-types'
import webmapApi from '../../../server/api.webmap'
import Header from './children/Header'
import SegmentBlock from './children/SegmentBlock'
import MarchForm from './children/MarchForm'
import utilsMarch from './utilsMarch'

import './style.css'

const { getTruckSegmentDetails, getTrainOrShipSegmentDetails, getTotalMarchDetails } = utilsMarch.formulas

const getMemoGeoLandmarks = (() => {
  const memoGeoLandmark = {}

  return async (coord = {}) => {
    const { lat, lng } = coord
    const geoKey = `${lat}:${lng}`

    let geoLandmark = memoGeoLandmark[geoKey]

    if (!geoLandmark) {
      try {
        geoLandmark = await webmapApi.nearestSettlement(coord)
        memoGeoLandmark[geoKey] = geoLandmark
      } catch (e) {
        geoLandmark = {}
      }
    }

    return geoLandmark
  }
})()

const March = (props) => {
  const [ timeDistanceView, changeTimeDistanceView ] = useState(true)

  const renderDotsForms = () => {
    const { segments, editFormField, addChild, deleteChild, setCoordMode, dataMarch } = props
    const handlers = {
      editFormField,
      addChild,
      deleteChild,
      setCoordMode,
      getMemoGeoLandmarks,
    }
    const referenceData = {
      time: 0,
      distance: 0,
    }

    return <div className={'dots-forms'}>
      { segments.map((segment, segmentId) => {
        const { children } = segment
        const getSegmentDetails = segment.segmentType === 41 ? getTruckSegmentDetails : getTrainOrShipSegmentDetails
        const segmentDetails = getSegmentDetails(segment, segments[segmentId + 1], dataMarch, { ...referenceData })

        if (timeDistanceView) {
          referenceData.time += segmentDetails.totalTime
          referenceData.distance += segmentDetails.totalDistance
        }

        return (<div key={segmentId} className={'segment-with-form'}>
          <div className={'segment-block'}>
            <SegmentBlock
              segment={segment}
              segmentDetails={segmentDetails}
              segmentId={segmentId}
              timeDistanceView={timeDistanceView}
              addSegment={props.addSegment}
              deleteSegment={props.deleteSegment}
            />
          </div>
          <div className={'form-container'}>
            <MarchForm
              key={`segment${segmentId}`}
              segmentId={segmentId}
              handlers={handlers}
              refPoint={''}
              {...segment}
              isLast={segments.length - 1 === segmentId}
            />
            {children && children.map((child, childId) => {
              return <MarchForm
                key={`child${childId}`}
                segmentId={segmentId}
                childId={childId}
                handlers={handlers}
                {...segment}
                {...child}
              />
            })}
          </div>
        </div>)
      })}
    </div>
  }

  const marchDetails = getTotalMarchDetails(props.segments, props.dataMarch)

  return <div className={'march-container'}>
    <div className={'march-header'}>
      <Header
        marchDetails={marchDetails}
        changeTimeDistanceView={changeTimeDistanceView}
        timeDistanceView={timeDistanceView}
      />
    </div>
    <div className={'march-main'}>
      <div style={{ width: '100%' }}>{renderDotsForms()}</div>
    </div>
  </div>
}

March.propTypes = {
  addSegment: PropTypes.func.isRequired,
  deleteSegment: PropTypes.func.isRequired,
  editFormField: PropTypes.func.isRequired,
  addChild: PropTypes.func.isRequired,
  deleteChild: PropTypes.func.isRequired,
  setCoordMode: PropTypes.func.isRequired,
  dataMarch: PropTypes.shape({}).isRequired,
  segments: PropTypes.array.isRequired,
}

export default March
