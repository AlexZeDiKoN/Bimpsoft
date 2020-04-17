import React, { useState } from 'react'
import PropTypes from 'prop-types'
import webmapApi from '../../../server/api.webmap'
import Header from './children/Header'
import SegmentBlock from './children/SegmentBlock'
import MarchForm from './children/MarchForm'
import utilsMarch from './utilsMarch'

import './style.css'

const { getMarchDetails } = utilsMarch.formulas

const getMemoGeoLandmarks = (() => {
  const memoGeoLandmark = {}

  return async (coord = {}) => {
    const { lat, lng } = coord
    const geoKey = `${lat}:${lng}`

    let geoLandmark = memoGeoLandmark[geoKey]

    if (!geoLandmark) {
      try {
        coord.lat = lat || 0.00001
        coord.lng = lng || 0.00001
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

  const segments = props.segmentList.toArray()
  const marchDetails = getMarchDetails(segments, props.dataMarch)

  const renderDotsForms = () => {
    const { editFormField, addChild, deleteChild, setCoordMode } = props
    const handlers = {
      editFormField,
      addChild,
      deleteChild,
      setCoordMode,
      getMemoGeoLandmarks,
    }

    return <div className={'dots-forms'}>
      { segments.map((segment, segmentId) => {
        const { children } = segment
        const segmentDetails = marchDetails.segments[segmentId]

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

  return <div className={'march-container'}>
    <div className={'march-header'}>
      <Header
        marchDetails={marchDetails}
        changeTimeDistanceView={changeTimeDistanceView}
        timeDistanceView={timeDistanceView}
        totalMarchTime={marchDetails.totalMarchTime}
        totalMarchDistance={marchDetails.totalMarchDistance}
      />
    </div>
    <div className={'march-main'}>
      <div className={'dot-form-container'}>{renderDotsForms()}</div>
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
  segmentList: PropTypes.shape({
    toArray: PropTypes.func.isRequired,
  }).isRequired,
  segments: PropTypes.array.isRequired,
}

export default React.memo(March)
