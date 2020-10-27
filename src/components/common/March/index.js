import React, { useState } from 'react'
import PropTypes from 'prop-types'
import webmapApi from '../../../server/api.webmap'
import { MARCH_POINT_TYPES as pointTypes } from '../../../constants/March'
import Header from './children/Header'
import SegmentBlock from './children/SegmentBlock'
import MarchForm from './children/MarchForm'
import convertUnits from './utilsMarch/convertUnits'

import './style.css'

const { hoursToMs } = convertUnits

const defaultRestTimeInHours = {
  point: 1,
  dayNight: 8,
  daily: 24,
}

const getMemoGeoLandmarks = (() => {
  const memoGeoLandmark = {}

  return async (coordinates = {}) => {
    const { lat, lng } = coordinates
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

const getMarchPoints = (pointsTypesM) => {
  const { point, dayNight, daily } = defaultRestTimeInHours

  const MarchPoints = [
    { id: pointTypes.POINT_ON_MARCH, rest: false, time: 0 },
    { id: pointTypes.REST_POINT, rest: true, time: hoursToMs(point) },
    { id: pointTypes.DAY_NIGHT_REST_POINT, rest: true, time: hoursToMs(dayNight) },
    { id: pointTypes.DAILY_REST_POINT, rest: true, time: hoursToMs(daily) },
    { id: pointTypes.LINE_OF_REGULATION, rest: false, time: 0, notEditableTime: true },
    { id: pointTypes.INTERMEDIATE_POINT, rest: false, time: 0 },
    { rest: false, time: 0 },
  ]

  return MarchPoints.map((point) => ({ ...point, ...pointsTypesM.get(point.id) }))
}

const March = (props) => {
  const {
    pointsTypesM,
    segmentList,
    time,
    distance,
    sendMarchToExplorer,
    closeMarch,
    isCoordFilled,
    geoLandmarks,
    toggleGeoLandmarkModal,
    toggleDeleteMarchPointModal,
    readOnly,
    isChanged,
    setGeoLandmarks,
    getRoute,
    setVisibleIntermediate,
  } = props
  const segments = segmentList.toArray()
  const [ timeDistanceView, changeTimeDistanceView ] = useState(true)
  const marchPoints = getMarchPoints(pointsTypesM)
  const renderDotsForms = () => {
    const { editFormField, addChild, deleteChild, setCoordMode, setRefPointOnMap, coordTypeSystem } = props
    const handlers = {
      editFormField,
      addChild,
      deleteChild,
      setCoordMode,
      getMemoGeoLandmarks,
      setRefPointOnMap,
      toggleGeoLandmarkModal,
      toggleDeleteMarchPointModal,
      setGeoLandmarks,
      getRoute,
      setVisibleIntermediate,
    }

    return <div className={'dots-forms'}>
      { segments.map((segment, segmentId) => {
        const { children, metric } = segment
        const childrenIsPresent = children && children.length > 0
        const hideIntermediate = !(segment.showIntermediate || false)
        return (<div key={segment.id} className={'segment-with-form'}>
          <div className={'segment-block'}>
            <SegmentBlock
              segment={segment}
              segmentDetails={metric}
              segmentId={segmentId}
              timeDistanceView={timeDistanceView}
              addSegment={props.addSegment}
              segments={segments}
              toggleDeleteMarchPointModal={toggleDeleteMarchPointModal}
              readOnly={readOnly}
              hideIntermediate={hideIntermediate}
              childrenIsPresent={childrenIsPresent}
            />
          </div>
          <div className={'form-container'}>
            <MarchForm
              key={segment.id}
              segmentId={segmentId}
              handlers={handlers}
              refPoint={''}
              {...segment}
              segmentType={segment.type}
              isLast={segments.length - 1 === segmentId}
              marchPoints={marchPoints}
              coordTypeSystem={coordTypeSystem}
              geoLandmarks={geoLandmarks}
              readOnly={readOnly}
              visibleIntermediate={segment.showIntermediate}
              childrenIsPresent={childrenIsPresent}
            />
            {children && children.map((child, childId) => {
              if (hideIntermediate && child.type === pointTypes.INTERMEDIATE_POINT) {
                return null
              }
              return <MarchForm
                key={child.id}
                segmentId={segmentId}
                childId={childId}
                handlers={handlers}
                marchPoints={marchPoints}
                coordTypeSystem={coordTypeSystem}
                {...segment}
                segmentType={segment.type}
                {...child}
                geoLandmarks={geoLandmarks}
                readOnly={readOnly}
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
        changeTimeDistanceView={changeTimeDistanceView}
        timeDistanceView={timeDistanceView}
        time={time}
        distance={distance}
        sendMarchToExplorer={sendMarchToExplorer}
        closeMarch={closeMarch}
        isCoordFilled={isCoordFilled}
        isChanged={isChanged}
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
  segmentList: PropTypes.shape({
    toArray: PropTypes.func.isRequired,
  }).isRequired,
  pointsTypes: PropTypes.array.isRequired,
  pointsTypesM: PropTypes.object.isRequired,
  time: PropTypes.number.isRequired,
  distance: PropTypes.number.isRequired,
  sendMarchToExplorer: PropTypes.func.isRequired,
  closeMarch: PropTypes.func.isRequired,
  isCoordFilled: PropTypes.bool.isRequired,
  coordTypeSystem: PropTypes.string.isRequired,
  geoLandmarks: PropTypes.object.isRequired,
  toggleGeoLandmarkModal: PropTypes.func.isRequired,
  toggleDeleteMarchPointModal: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isChanged: PropTypes.bool.isRequired,
  setGeoLandmarks: PropTypes.func.isRequired,
  getRoute: PropTypes.func.isRequired,
  setVisibleIntermediate: PropTypes.func.isRequired,
}

export default React.memo(March)
