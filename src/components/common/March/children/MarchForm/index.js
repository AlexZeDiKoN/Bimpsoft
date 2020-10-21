import { Input, Select, Tooltip, Divider } from 'antd'
import { components, IButton, IconNames, ColorTypes, ButtonTypes } from '@DZVIN/CommonComponents'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { MARCH_TYPES } from '../../../../../constants/March'
import placeSearch from '../../../../../server/places'
import TimeInput from '../TimeInput'
import { MOUSE_ENTER_DELAY } from '../../../../../constants/tooltip'
import i18n from './../../../../../i18n'

const { Option } = Select
const { OWN_RESOURCES, BY_RAILROAD, BY_SHIPS } = MARCH_TYPES

const {
  form: { Coordinates },
} = components

const getPointById = (marchPoints, id) => marchPoints.find((point) => point.id === id) || marchPoints[0]

const GeoLandmarkItem = (props) => {
  const { data, id, setRefPointOnMap, isSelectGeoLandmarksVisible } = props
  const { name, geometry } = data

  const onMouseOver = () => {
    if (isSelectGeoLandmarksVisible) {
      const [ lng, lat ] = geometry.coordinates

      if (lng && lat) {
        const coordRefPoint = {
          lat,
          lng,
        }

        setRefPointOnMap(coordRefPoint)
      }
    }
  }

  return (
    <Tooltip placement='left' mouseEnterDelay={MOUSE_ENTER_DELAY} title={name}>
      <div className={'selected-item-landmark'} key={id} onMouseOver={onMouseOver}>
        {name}
      </div>
    </Tooltip>
  )
}

const MarchForm = (props) => {
  const {
    name,
    coordinates = {},
    refPoint,
    segmentType,
    segmentId,
    childId,
    isLast,
    restTime = 0,
    marchPoints,
    type,
    coordTypeSystem,
    geoLandmarks,
    readOnly,
    route,
  } = props
  const {
    editFormField,
    addChild,
    setCoordMode,
    setRefPointOnMap,
    toggleGeoLandmarkModal,
    toggleDeleteMarchPointModal,
    setGeoLandmarks,
    getRoute,
    setActivePoint,
  } = props.handlers
  const [ pointTime, setPointTime ] = useState(restTime)
  const [ isSelectGeoLandmarksVisible, changeSelectGeoLandmarksVisible ] = useState(false)

  const { lat, lng } = coordinates
  const isValidCoordinates = lat && lng
  const geoKey = `${lat}:${lng}`
  const formattedGeoLandmarks = geoLandmarks[geoKey]
  const coordinatesWithType = { ...coordinates, type: coordTypeSystem }
  const point = getPointById(marchPoints, type)
  const isRoutePresent = Boolean(route)

  const onChangeTime = (value) => {
    if (point.notEditableTime) {
      setPointTime(0)
      return pointTime
    }

    setPointTime(+value)
  }

  const onChangeMarchPointType = (value) => {
    const { time: msTime } = getPointById(marchPoints, value)

    editFormField({
      val: [ value, msTime ],
      segmentId,
      childId,
      fieldName: [ 'type', 'restTime' ],
    })

    setPointTime(msTime)
  }

  const onChangeRefPoint = (value, option = {}) => {
    if (option && option.key === 'addItem') {
      return
    }

    editFormField({
      val: value,
      fieldName: 'refPoint',
      segmentId,
      childId,
    })
  }

  const onBlurTime = (value) => {
    editFormField({
      val: +value,
      segmentId,
      childId,
      fieldName: 'restTime',
    })
  }

  const onBlurCoordinates = ({ lat, lng }) => {
    editFormField({
      fieldName: 'coordinates',
      segmentId,
      childId,
      val: { lat, lng },
    })
  }

  const onGetGeoLandmarks = ({ lat, lng }) => {
    setGeoLandmarks({
      segmentId,
      childId,
      coordinates: { lat, lng },
      selectFirstItem: false,
    })
  }

  const onDropdownVisibleChange = (isOpen) => {
    if (isOpen) {
      onGetGeoLandmarks({ ...coordinates })
    } else {
      setRefPointOnMap()
    }
    changeSelectGeoLandmarksVisible(isOpen)
  }

  const onHandlerOwnGeoLandmark = () => {
    toggleGeoLandmarkModal(true, coordinates, segmentId, childId)
  }

  const onGetRoute = () => {
    getRoute({ segmentId, childId })
  }

  const onClearRoute = () => {
    getRoute({ segmentId, childId, isClearRoute: true })
  }

  let dotClass
  if (childId === undefined) {
    dotClass = isLast ? 'flag-dot' : 'empty-dot'
  } else {
    dotClass = point.rest && segmentType === OWN_RESOURCES ? 'camp-dot' : 'cross-dot'
  }

  let lineColorClass
  switch (segmentType) {
    case BY_RAILROAD:
      lineColorClass = 'line-orange'
      break
    case BY_SHIPS:
      lineColorClass = 'line-blue'
      break
    default:
      lineColorClass = 'line-green'
  }

  let pointTypeName
  const pointOnMarch = marchPoints[0].name

  if (segmentType === OWN_RESOURCES) {
    if (childId === undefined) {
      pointTypeName = segmentId === 0 ? name : pointOnMarch
    } else {
      pointTypeName = childId === 0 ? i18n.STARTING_LINE : getPointById(marchPoints, type).name
    }
  } else {
    if (childId === undefined) {
      pointTypeName = segmentType === 0 || segmentId === 0 ? name : pointOnMarch
    } else {
      pointTypeName = pointOnMarch
    }
  }

  let isStaticPointType
  if (segmentType === 0 ||
    (segmentId === 0 && childId === undefined) ||
    segmentType !== OWN_RESOURCES ||
    (segmentType === OWN_RESOURCES && childId === undefined)) {
    isStaticPointType = true
  } else {
    isStaticPointType = childId === 0
  }

  const isOwnResources = segmentType === OWN_RESOURCES
  const isChild = childId !== undefined
  const isFirstChild = childId === 0
  const isViewBottomPanel = (isChild && !(segmentType === OWN_RESOURCES && isFirstChild)) || isOwnResources

  const showDeletePointConfirm = () => {
    toggleDeleteMarchPointModal(true, segmentId, childId)
  }

  const dotFormId = `dot-form${type}${childId === undefined ? '' : childId}`

  const onSetActivePoint = () => {
    setActivePoint(segmentId, childId)
  }

  const onClearActivePoint = () => {
    setActivePoint(null, null)
  }

  return (
    <div className={'dot-and-form'}>
      <div className={'dots'}>
        <Tooltip
          placement='topRight'
          mouseEnterDelay={MOUSE_ENTER_DELAY}
          title={i18n.MARCH_LOCATION}
          align={ { offset: [ isLast ? 0 : 13, 0 ] }}
        >
          <div className={`dot ${dotClass}`}/>
        </Tooltip>
        {(segmentType || childId || childId === 0)
          ? <div className={`vertical-block vertical-line ${lineColorClass}`}>
            <Tooltip
              placement='topRight'
              mouseEnterDelay={MOUSE_ENTER_DELAY}
              title={i18n.ADD_POINT}
              align={ { offset: [ 13, 0 ] }}
            >
              {!(segmentType === OWN_RESOURCES && childId === undefined) && !readOnly &&
              <div className={'add-dot'} onClick={() => addChild(segmentId, childId)}/>
              }
            </Tooltip>
          </div>
          : <div className={'vertical-block last-block'}/>
        }
      </div>
      <div className={'dot-form'} id={dotFormId} style={{ position: 'relative' }}>
        <div className={`march-coord${!isValidCoordinates ? ' not-correct-point' : ''}`}>
          <Coordinates
            coordinates={coordinatesWithType}
            onSearch={placeSearch}
            onExitWithChange={onBlurCoordinates}
            isReadOnly={readOnly}
            getPopupContainer={() => document.getElementById(dotFormId)}
            preferredType={coordTypeSystem}
            onBlur={onClearActivePoint}
            onFocus={onSetActivePoint}
          />
          <Tooltip
            placement='topRight'
            mouseEnterDelay={MOUSE_ENTER_DELAY}
            title={i18n.POINT_ON_MAP}
            align={ { offset: [ 6, 0 ] }}
          >
            <div
              className={`logo-map ${readOnly ? 'march-disabled-element' : ''}`}
              onClick={() => { !readOnly && setCoordMode({ segmentId, childId }) }}
            />
          </Tooltip>
        </div>
        <Tooltip
          placement='left'
          mouseEnterDelay={MOUSE_ENTER_DELAY}
          title={ refPoint ? '' : i18n.GEOGRAPHICAL_LANDMARK}
        >
          <Select
            className={'select-point'}
            value={refPoint}
            showArrow={false}
            onChange={onChangeRefPoint}
            placeholder={i18n.GEOGRAPHICAL_LANDMARK}
            onDropdownVisibleChange={onDropdownVisibleChange}
            showSearch={true}
            disabled={readOnly}
            getPopupContainer={() => document.getElementById(dotFormId)}
          >
            {formattedGeoLandmarks && formattedGeoLandmarks.map(({ propertiesText, geometry }, id) => (
              <Option
                key={id}
                value={propertiesText}
                className={'march-active-value'}
              >
                <GeoLandmarkItem
                  id={id}
                  data={{ name: propertiesText, geometry }}
                  isSelectGeoLandmarksVisible={isSelectGeoLandmarksVisible}
                  setRefPointOnMap={setRefPointOnMap}
                />
              </Option>
            ))}
            <Option key={'addItem'} onClick={onHandlerOwnGeoLandmark}>
              <Divider className={'march-divider'} onMouseOver={() => setRefPointOnMap()}/>
              <div className={'march-own-variant'} onMouseOver={() => setRefPointOnMap()}>
                <span><strong>+ {i18n.OWN_VARIANT}</strong></span>
              </div>
            </Option>
          </Select>
        </Tooltip>
        {isStaticPointType
          ? <Input
            value={pointTypeName}
            disabled={readOnly}
          />
          : <Select
            className={'select-point'}
            showArrow={false}
            defaultValue={pointTypeName}
            value={pointTypeName}
            onChange={onChangeMarchPointType}
            disabled={readOnly}
          >
            {marchPoints.map(({ name }, id) => (
              <Option key={id} value={id}>
                {name}
              </Option>
            ))}
          </Select>
        }
        {isViewBottomPanel &&
        <div className={'bottom-panel'}>
          {isOwnResources && !point.notEditableTime && isChild && !isFirstChild
            ? <div className={'time-block'}>
              <Tooltip
                mouseEnterDelay={MOUSE_ENTER_DELAY}
                placement='topRight'
                title={i18n.REST_TIME}
                align={ { offset: [ 10, 0 ] }}
              >
                <div className={'logo-time'}/>
              </Tooltip>
              <TimeInput
                onChange={onChangeTime}
                onBlur={onBlurTime}
                value={pointTime}
                maxLength={10}
                className={'time-input'}
                disabled={readOnly}
              />
            </div>
            : <div/>
          }
          <div className={'right-buttons-container'}>
            {
              isOwnResources &&
                <>
                  <Tooltip placement='topRight' title={i18n.ROUTE_HAND} align={ { offset: [ 5, 0 ] }}>
                    <IButton
                      icon={IconNames.ROUTE_2}
                      active={!isRoutePresent}
                      colorType={ColorTypes.DARK_GREEN}
                      type={ButtonTypes.WITH_BG}
                      onClick={onClearRoute}
                    />
                  </Tooltip>
                  <Tooltip placement='topRight' title={i18n.ROUTE_AUTO} align={ { offset: [ 5, 0 ] }}>
                    <IButton
                      icon={IconNames.ROUTE}
                      active={isRoutePresent}
                      type={ButtonTypes.WITH_BG}
                      colorType={ColorTypes.DARK_GREEN}
                      onClick={onGetRoute}
                    />
                  </Tooltip>
                </>
            }
            {isChild && (!isFirstChild || !isOwnResources) && <Tooltip
              mouseEnterDelay={MOUSE_ENTER_DELAY}
              placement='topRight'
              title={i18n.DELETE_MARCH_POINT}
              align={ { offset: [ 5, 0 ] }}
            >
              <IButton disabled={readOnly} icon={IconNames.BAR_2_DELETE} onClick={showDeletePointConfirm}/>
            </Tooltip>}
          </div>
        </div>
        }
      </div>
    </div>
  )
}

MarchForm.propTypes = {
  name: PropTypes.string.isRequired,
  coordinates: PropTypes.shape({}).isRequired,
  children: PropTypes.array,
  refPoint: PropTypes.string.isRequired,
  segmentType: PropTypes.number.isRequired,
  segmentId: PropTypes.number.isRequired,
  childId: PropTypes.number,
  handlers: PropTypes.shape({
    editFormField: PropTypes.func.isRequired,
    addChild: PropTypes.func.isRequired,
    setCoordMode: PropTypes.func.isRequired,
    setRefPointOnMap: PropTypes.func.isRequired,
    toggleGeoLandmarkModal: PropTypes.func.isRequired,
    toggleDeleteMarchPointModal: PropTypes.func.isRequired,
    setGeoLandmarks: PropTypes.func.isRequired,
    getRoute: PropTypes.func.isRequired,
    setActivePoint: PropTypes.func.isRequired,
  }).isRequired,
  isLast: PropTypes.bool,
  restTime: PropTypes.number,
  marchPoints: PropTypes.array.isRequired,
  type: PropTypes.number,
  coordTypeSystem: PropTypes.string.isRequired,
  geoLandmarks: PropTypes.object.isRequired,
  readOnly: PropTypes.bool.isRequired,
  route: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.oneOf([ null ]).isRequired,
  ]),
}

GeoLandmarkItem.propTypes = {
  id: PropTypes.number.isRequired,
  setRefPointOnMap: PropTypes.func.isRequired,
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    geometry: PropTypes.shape({
      coordinates: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
  isSelectGeoLandmarksVisible: PropTypes.bool.isRequired,
}

export default React.memo(MarchForm)
