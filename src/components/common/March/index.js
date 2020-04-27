import React, { useState } from 'react'
import PropTypes from 'prop-types'
import webmapApi from '../../../server/api.webmap'
import Header from './children/Header'
import SegmentBlock from './children/SegmentBlock'
import MarchForm from './children/MarchForm'
import convertUnits from './utilsMarch/convertUnits'

import './style.css'

const { hoursToMs } = convertUnits

const getMemoGeoLandmarks = (() => {
  const memoGeoLandmark = {}

  return async (coord = {}) => {
    const { lat, lng } = coord
    const geoKey = `${lat}:${lng}`

    let geoLandmark = memoGeoLandmark[geoKey]

    const fixedCoord = {}
    fixedCoord.lat = lat || 0.00001
    fixedCoord.lng = lng || 0.00001

    if (!geoLandmark) {
      try {
        geoLandmark = await webmapApi.nearestSettlement(fixedCoord)
        memoGeoLandmark[geoKey] = geoLandmark
      } catch (e) {
        geoLandmark = {}
      }
    }

    return geoLandmark
  }
})()

const getMarchPoints = (pointType, dataMarch) => {
  const { pointRestTime, dayNightRestTime, dailyRestTime } = dataMarch

  const MarchPoints = [
    { rest: false, time: 0 },
    { rest: true, time: hoursToMs(pointRestTime) },
    { rest: true, time: hoursToMs(dayNightRestTime) },
    { rest: true, time: hoursToMs(dailyRestTime) },
    { rest: true, time: 0, notEditableTime: true },
    { rest: false, time: 0 },
  ]

  return MarchPoints.map((point, id) => ({ ...point, ...pointType[id] }))
}

const March = (props) => {
  const { pointType, dataMarch, segmentList, totalMarchTime, totalMarchDistance } = props
  const segments = segmentList.toArray()
  const [ timeDistanceView, changeTimeDistanceView ] = useState(true)
  const marchPoints = getMarchPoints(pointType, dataMarch)

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
        const { children, metric } = segment

        return (<div key={segmentId} className={'segment-with-form'}>
          <div className={'segment-block'}>
            <SegmentBlock
              segment={segment}
              segmentDetails={metric}
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
              marchPoints={marchPoints}
            />
            {children && children.map((child, childId) => {
              return <MarchForm
                key={`child${childId}`}
                segmentId={segmentId}
                childId={childId}
                handlers={handlers}
                marchPoints={marchPoints}
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
        // marchDetails={marchDetails}
        changeTimeDistanceView={changeTimeDistanceView}
        timeDistanceView={timeDistanceView}
        totalMarchTime={totalMarchTime}
        totalMarchDistance={totalMarchDistance}
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
  pointType: PropTypes.array.isRequired,
  totalMarchTime: PropTypes.number.isRequired,
  totalMarchDistance: PropTypes.number.isRequired,
}

export default React.memo(March)
