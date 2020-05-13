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

  return async (coordinate = {}) => {
    const { lat, lng } = coordinate
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

const getMarchPoints = (pointsTypes, dataMarch) => {
  const { pointRestTime, dayNightRestTime, dailyRestTime } = dataMarch

  const MarchPoints = [
    { rest: false, time: 0 },
    { rest: true, time: hoursToMs(pointRestTime) },
    { rest: true, time: hoursToMs(dayNightRestTime) },
    { rest: true, time: hoursToMs(dailyRestTime) },
    { rest: true, time: 0, notEditableTime: true },
    { rest: false, time: 0 },
  ]

  return MarchPoints.map((point, id) => ({ ...point, ...pointsTypes[id] }))
}

const March = (props) => {
  const { pointsTypes, dataMarch, segmentList, time, distance, initMarch, sendMarchToExplorer } = props
  const segments = segmentList.toArray()
  const [ timeDistanceView, changeTimeDistanceView ] = useState(true)
  const marchPoints = getMarchPoints(pointsTypes, dataMarch)

  const renderDotsForms = () => {
    const { editFormField, addChild, deleteChild, setCoordMode, setRefPointOnMap } = props
    const handlers = {
      editFormField,
      addChild,
      deleteChild,
      setCoordMode,
      getMemoGeoLandmarks,
      setRefPointOnMap,
    }

    return <div className={'dots-forms'}>
      { segments.map((segment, segmentId) => {
        const { children, metric } = segment

        return (<div key={segment.id} className={'segment-with-form'}>
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
              key={segment.id}
              segmentId={segmentId}
              handlers={handlers}
              refPoint={''}
              {...segment}
              isLast={segments.length - 1 === segmentId}
              marchPoints={marchPoints}
            />
            {children && children.map((child, childId) => {
              return <MarchForm
                key={child.id}
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
        time={time}
        distance={distance}
        initMarch={initMarch}
        sendMarchToExplorer={sendMarchToExplorer}
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
  setRefPointOnMap: PropTypes.func.isRequired,
  dataMarch: PropTypes.shape({}).isRequired,
  segmentList: PropTypes.shape({
    toArray: PropTypes.func.isRequired,
  }).isRequired,
  pointsTypes: PropTypes.array.isRequired,
  time: PropTypes.number.isRequired,
  distance: PropTypes.number.isRequired,
  sendMarchToExplorer: PropTypes.func.isRequired,
}

export default React.memo(March)
