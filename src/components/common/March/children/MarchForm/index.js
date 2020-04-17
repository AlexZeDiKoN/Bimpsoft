import { Input, Select, Tooltip, Modal, Divider } from 'antd'
import { components, IButton, IconNames } from '@DZVIN/CommonComponents'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import placeSearch from '../../../../../server/places'
import { isNumberSymbols } from '../../../../../utils/validation/number'
import utilsMarch from '../../utilsMarch'
import i18n from './../../../../../i18n'
const { confirm } = Modal

const {
  form: { Coordinates },
} = components

const { getFilteredGeoLandmarks, azimuthToCardinalDirection } = utilsMarch.convertUnits

const marchPoints = [
  { name: i18n.STARTING_LINE, rest: false, time: 0 },
  { name: i18n.POINT_ON_MARCH, rest: false, time: 0 },
  { name: i18n.REST_POINT, rest: true, time: 1 },
  { name: i18n.DAY_NIGHT_REST_POINT, rest: true, time: 8 },
  { name: i18n.DAILY_REST_POINT, rest: true, time: 24 },
  { name: i18n.POINT_OF_REGULATION, rest: true, time: 0, notEditableTime: true },
]

const getPointByName = (name) => marchPoints.find((point) => point.name === name) || marchPoints[0]

const getFormattedGeoLandmarks = (geoLandmarks) => {
  const { features = [] } = geoLandmarks

  const filteredGeoLandmarks = getFilteredGeoLandmarks(features)

  return filteredGeoLandmarks.map(({ name, distance, azimuth }) => {
    const distanceInKm = (distance / 1000).toFixed(0)
    const cardinalDirection = azimuthToCardinalDirection(azimuth)

    return `${distanceInKm} ${i18n.KILOMETER_TO} ${cardinalDirection} ${i18n.FROM_CITY} ${name}`
  })
}

const MarchForm = (props) => {
  const {
    name,
    coord = {},
    refPoint,
    segmentType,
    segmentId,
    childId,
    isLast,
    restTime,
  } = props
  const { editFormField, addChild, deleteChild, setCoordMode, getMemoGeoLandmarks } = props.handlers

  const [ pointTime, setPointTime ] = useState(+restTime)
  const [ refPointMarch, changeRefPoint ] = useState(refPoint)
  const [ geoLandmarks, changeGeoLandmarks ] = useState({})
  const [ isLoadingGeoLandmarks, changeIsLoadingGeoLandmarks ] = useState(false)
  const [ isModalVisible, changeIsModalVisible ] = useState(false)
  const [ ownRefPointMarch, changeOwnRefPoint ] = useState('')

  const showOwnRefPointModal = () => {
    changeIsModalVisible(true)
  }

  const onOkOwnRefPointModal = () => {
    changeIsModalVisible(false)
  }

  const onCancelOwnRefPointModal = () => {
    changeIsModalVisible(false)
  }

  const getGeoLandmarks = async (coord) => {
    await changeIsLoadingGeoLandmarks(true)
    changeGeoLandmarks({})
    const res = await getMemoGeoLandmarks(coord)
    changeGeoLandmarks(res)
    await changeIsLoadingGeoLandmarks(false)
  }

  const point = getPointByName(name)

  const onChangeTime = (e) => {
    if (point.notEditableTime) {
      setPointTime(0)
      return pointTime
    }
    const { value } = e.target
    const numberVal = value ? (isNumberSymbols(value) && value) || pointTime : ''

    setPointTime(+numberVal)
  }

  const onChangeMarchPointType = (value) => {
    editFormField({
      val: value,
      segmentId,
      childId,
      fieldName: 'name',
    })

    const point = getPointByName(value)

    editFormField({
      val: point.time,
      segmentId,
      childId,
      fieldName: 'restTime',
    })

    setPointTime(point.time)
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

  const onBlurTime = (e) => {
    editFormField({
      val: +e.target.value,
      segmentId,
      childId,
      fieldName: 'restTime',
    })
  }

  const onBlurCoordinates = async ({ lat, lng }) => {
    editFormField({
      fieldName: 'coord',
      segmentId,
      childId,
      val: { lat, lng },
    })
  }

  const onDropdownVisibleChange = (isOpen) => {
    if (isOpen) {
      getGeoLandmarks(coord)
    }
  }

  const onHandlerOwnGeoLandmark = () => {
    changeRefPoint('')
    showOwnRefPointModal()
  }

  let dotClass
  if (childId === undefined) {
    dotClass = isLast ? 'flag-dot' : 'empty-dot'
  } else {
    dotClass = point.rest && segmentType === 41 ? 'camp-dot' : 'cross-dot'
  }

  let lineColorClass
  switch (segmentType) {
    case 42:
      lineColorClass = 'line-orange'
      break
    case 43:
      lineColorClass = 'line-blue'
      break
    default:
      lineColorClass = 'line-green'
  }

  let pointTypeName
  if (segmentType === 41) {
    if (childId === undefined && segmentId !== 0) {
      pointTypeName = i18n.POINT_ON_MARCH
    } else {
      pointTypeName = childId === 0 ? i18n.STARTING_LINE : name
    }
  } else {
    if (childId === undefined) {
      pointTypeName = segmentType === 0 || segmentId === 0 ? name : i18n.POINT_ON_MARCH
    } else {
      pointTypeName = i18n.POINT_ON_MARCH
    }
  }

  let isStaticPointType
  if (segmentType === 0 || (segmentId === 0 && childId === undefined) || segmentType !== 41) {
    isStaticPointType = true
  } else {
    isStaticPointType = childId === 0
  }

  const isViewBottomPanel = (childId !== undefined) && !(segmentType === 41 && childId === 0)

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
              {!(segmentType === 41 && childId === undefined) &&
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
            coordinates={coord}
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
            onChange={onChangeRefPoint}
            loading={isLoadingGeoLandmarks}
            placeholder={i18n.GEOGRAPHICAL_LANDMARK}
            onDropdownVisibleChange={onDropdownVisibleChange}
          >
            {ownRefPointMarch &&
            <Select.Option key={'ownGeoLandmark'} value={ownRefPointMarch}>
              {ownRefPointMarch}
            </Select.Option>}
            {getFormattedGeoLandmarks(geoLandmarks).map((geoLandmark, id) => (
              <Select.Option
                key={id}
                value={geoLandmark}
              >{geoLandmark}</Select.Option>
            ))}
            <Select.Option key={'addItem'} onClick={onHandlerOwnGeoLandmark}>
              <Divider className={'march-divider'}/>
              <div className={'march-own-variant'}>
                <span><strong>+ {i18n.OWN_VARIANT}</strong></span>
              </div>
            </Select.Option>
          </Select>
        </Tooltip>
        <br/>
        <Tooltip placement='left' title={i18n.POINT_TYPE}>
          {isStaticPointType
            ? <Input
              value={pointTypeName}
            />
            : <Select
              className={'select-point'}
              defaultValue={pointTypeName}
              value={pointTypeName}
              onChange={onChangeMarchPointType}
            >
              {marchPoints.map(({ name }, id) => (
                <Select.Option key={id} value={name}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          }
        </Tooltip>
        {isViewBottomPanel &&
        <div className={'bottom-panel'}>
          {segmentType === 41
            ? <div className={'time-block'}>
              <div className={'logo-time'}/>
              <Input
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
  coord: PropTypes.shape({}).isRequired,
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
  }).isRequired,
  isLast: PropTypes.bool,
  restTime: PropTypes.number,
}

export default React.memo(MarchForm)
