import { Input, Select, Tooltip, Modal, Divider } from 'antd'
import { components, IButton, IconNames } from '@DZVIN/CommonComponents'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { MARCH_TYPES } from '../../../../../constants/March'
import placeSearch from '../../../../../server/places'
import utilsMarch from '../../utilsMarch'
import TimeInput from '../TimeInput'
import i18n from './../../../../../i18n'

const { confirm } = Modal
const { Option } = Select
const { OWN_RESOURCES, BY_RAILROAD, BY_SHIPS } = MARCH_TYPES

const {
  form: { Coordinates },
} = components

const { getFilteredGeoLandmarks, azimuthToCardinalDirection } = utilsMarch.convertUnits

const getPointById = (marchPoints, id) => marchPoints.find((point) => point.id === id) || marchPoints[0]

const getFormattedGeoLandmarks = (geoLandmarks) => {
  const { features = [] } = geoLandmarks

  const filteredGeoLandmarks = getFilteredGeoLandmarks(features)

  return filteredGeoLandmarks.map((itemGeoLandmark) => {
    const { name, distance, azimuth } = itemGeoLandmark.properties
    const distanceInKm = (distance / 1000).toFixed(0)
    const cardinalDirection = azimuthToCardinalDirection(azimuth)

    itemGeoLandmark.propertiesText = `${distanceInKm} ${i18n.KILOMETER_TO} ${cardinalDirection} ${i18n.FROM_CITY} ${name}`
    return itemGeoLandmark
  })
}

const GeoLandmarkItem = (props) => {
  const { data, id, setRefPointOnMap, isSelectGeoLandmarksVisible } = props
  const { name, geometry } = data

  const onMouseOver = () => {
    if (isSelectGeoLandmarksVisible) {
      const [ lng, lat ] = geometry.coordinates

      const coordRefPoint = {
        lat,
        lng,
      }
      setRefPointOnMap(coordRefPoint)
    }
  }

  return (
    <div key={id} onMouseOver={onMouseOver}>
      {name}
    </div>
  )
}

const MarchForm = (props) => {
  const {
    name,
    coordinate = {},
    refPoint,
    segmentType,
    segmentId,
    childId,
    isLast,
    restTime = 0,
    marchPoints,
    type,
    coordTypeSystem,
  } = props
  const { editFormField, addChild, deleteChild, setCoordMode, getMemoGeoLandmarks, setRefPointOnMap } = props.handlers
  const [ pointTime, setPointTime ] = useState(restTime)
  const [ refPointMarch, changeRefPoint ] = useState(refPoint)
  const [ geoLandmarks, changeGeoLandmarks ] = useState({})
  const [ isLoadingGeoLandmarks, changeIsLoadingGeoLandmarks ] = useState(false)
  const [ isModalVisible, changeIsModalVisible ] = useState(false)
  const [ ownRefPointMarch, changeOwnRefPoint ] = useState('')
  const [ isSelectGeoLandmarksVisible, changeSelectGeoLandmarksVisible ] = useState(false)

  const showOwnRefPointModal = () => {
    changeIsModalVisible(true)
  }

  const coordinateWithType = { ...coordinate, type: coordTypeSystem }

  const onOkOwnRefPointModal = () => {
    changeIsModalVisible(false)
  }

  const onCancelOwnRefPointModal = () => {
    changeIsModalVisible(false)
  }

  const getGeoLandmarks = async (coordinate) => {
    await changeIsLoadingGeoLandmarks(true)
    changeGeoLandmarks({})
    const res = await getMemoGeoLandmarks(coordinate)
    changeGeoLandmarks(res)
    await changeIsLoadingGeoLandmarks(false)
  }

  const point = getPointById(marchPoints, type)

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

  const onChangeRefPoint = (value, option) => {
    if (option.key === 'addItem') {
      return
    }

    editFormField({
      val: value,
      fieldName: 'refPoint',
      segmentId,
      childId,
    })

    changeRefPoint(value)
  }

  const onBlurTime = (value) => {
    editFormField({
      val: +value,
      segmentId,
      childId,
      fieldName: 'restTime',
    })
  }

  const onBlurCoordinates = async ({ lat, lng }) => {
    editFormField({
      fieldName: 'coordinate',
      segmentId,
      childId,
      val: { lat, lng },
    })
  }

  const onDropdownVisibleChange = (isOpen) => {
    if (isOpen) {
      getGeoLandmarks(coordinate)
    } else {
      setRefPointOnMap()
    }
    changeSelectGeoLandmarksVisible(isOpen)
  }

  const onHandlerOwnGeoLandmark = () => {
    changeRefPoint('')
    showOwnRefPointModal()
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

  const isViewBottomPanel = (childId !== undefined) && !(segmentType === OWN_RESOURCES && childId === 0)

  const showDeletePointConfirm = () => {
    confirm({
      title: i18n.DELETE_POINT_CONFIRM_TITLE,
      okText: i18n.OK_BUTTON_TEXT,
      okType: 'danger',
      cancelText: i18n.CANCEL_BUTTON_TEXT,
      onOk () {
        deleteChild(segmentId, childId)
      },
      centered: true,
      zIndex: 10000,
    },
    )
  }

  return (
    <div className={'dot-and-form'}>
      <div className={'dots'}>
        <Tooltip placement='topRight' title={i18n.MARCH_LOCATION}>
          <div className={`dot ${dotClass}`}/>
        </Tooltip>
        {(segmentType || childId || childId === 0)
          ? <div className={`vertical-block vertical-line ${lineColorClass}`}>
            <Tooltip placement='topRight' title={i18n.ADD_POINT}>
              {!(segmentType === OWN_RESOURCES && childId === undefined) &&
              <div className={'add-dot'} onClick={() => addChild(segmentId, childId)}/>
              }
            </Tooltip>
          </div>
          : <div className={'vertical-block last-block'}/>
        }
      </div>
      <div className={'dot-form'}>
        <div className={'march-coord'}>
          <Coordinates
            coordinates={coordinateWithType}
            onSearch={placeSearch}
            onExitWithChange={onBlurCoordinates}
          />
          <Tooltip placement='topRight' title={i18n.POINT_ON_MAP}>
            <div className={'logo-map'} onClick={() => setCoordMode({ segmentId, childId })}/>
          </Tooltip>
        </div>
        <Tooltip placement='left' title={i18n.GEOGRAPHICAL_LANDMARK}>
          <Select
            className={'select-point'}
            value={refPointMarch}
            showArrow={false}
            onChange={onChangeRefPoint}
            loading={isLoadingGeoLandmarks}
            placeholder={i18n.GEOGRAPHICAL_LANDMARK}
            onDropdownVisibleChange={onDropdownVisibleChange}
          >
            {ownRefPointMarch &&
            <Option key={'ownGeoLandmark'} value={ownRefPointMarch}>
              <div onMouseOver={() => setRefPointOnMap()}>
                {ownRefPointMarch}
              </div>
            </Option>}
            {getFormattedGeoLandmarks(geoLandmarks).map(({ propertiesText, geometry }, id) => (
              <Option
                key={id}
                value={propertiesText}
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
        <Tooltip placement='left' title={i18n.POINT_TYPE}>
          {isStaticPointType
            ? <Input
              value={pointTypeName}
            />
            : <Select
              className={'select-point'}
              showArrow={false}
              defaultValue={pointTypeName}
              value={pointTypeName}
              onChange={onChangeMarchPointType}
            >
              {marchPoints.map(({ name }, id) => (
                <Option key={id} value={id}>
                  {name}
                </Option>
              ))}
            </Select>
          }
        </Tooltip>
        {isViewBottomPanel &&
        <div className={'bottom-panel'}>
          {segmentType === OWN_RESOURCES
            ? <div className={'time-block'}>
              <div className={'logo-time'}/>
              <TimeInput
                onChange={onChangeTime}
                onBlur={onBlurTime}
                value={pointTime}
                maxLength={10}
                className={'time-input'}
              />
            </div>
            : <div/>
          }
          <IButton icon={IconNames.BAR_2_DELETE} onClick={showDeletePointConfirm}/>
        </div>
        }
      </div>
      <Modal
        title={i18n.SPECIFY_GEO_LANDMARK_TITLE}
        visible={isModalVisible}
        onOk={onOkOwnRefPointModal}
        onCancel={onCancelOwnRefPointModal}
        okText={i18n.ADD_BUTTON_TEXT}
        cancelText={i18n.REJECT_BUTTON_TEXT}
      >
        <Input onChange={(e) => changeOwnRefPoint(e.target.value)} placeholder={i18n.GEOGRAPHICAL_LANDMARK} />
      </Modal>
    </div>
  )
}

MarchForm.propTypes = {
  name: PropTypes.string.isRequired,
  coordinate: PropTypes.shape({}).isRequired,
  children: PropTypes.array,
  refPoint: PropTypes.string.isRequired,
  segmentType: PropTypes.number.isRequired,
  segmentId: PropTypes.number.isRequired,
  childId: PropTypes.number,
  handlers: PropTypes.shape({
    editFormField: PropTypes.func.isRequired,
    addChild: PropTypes.func.isRequired,
    deleteChild: PropTypes.func.isRequired,
    setCoordMode: PropTypes.func.isRequired,
    getMemoGeoLandmarks: PropTypes.func.isRequired,
    setRefPointOnMap: PropTypes.func.isRequired,
  }).isRequired,
  isLast: PropTypes.bool,
  restTime: PropTypes.number,
  marchPoints: PropTypes.array.isRequired,
  type: PropTypes.number,
  coordTypeSystem: PropTypes.string.isRequired,
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
