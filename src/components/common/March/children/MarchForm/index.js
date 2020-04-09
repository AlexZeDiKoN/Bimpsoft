import { Input, Select, Tooltip, Modal, Divider } from 'antd'
import { components, IButton, IconNames } from '@DZVIN/CommonComponents'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import placeSearch from '../../../../../server/places'
import { isNumberSymbols } from '../../../../../utils/validation/number'
import utilsMarch from '../../utilsMarch'

const {
  form: { Coordinates },
} = components

const { getFilteredGeoLandmarks, azimuthToCardinalDirection } = utilsMarch.convertUnits

const marchPoints = [
  { name: 'Вихідний рубіж', rest: false, base: true, time: 0 },
  { name: 'Пункт на маршруті', rest: false, time: 0 },
  { name: 'Пункт привалу', rest: true, time: 1 },
  { name: 'Пункт денного(нічного) відпочинку', rest: true, time: 8 },
  { name: 'Пункт добового відпочинку', rest: true, time: 24 },
  { name: 'Пункт(рубіж) регулювання', rest: true, time: 0, notEditableTime: true },
]

const getPointByName = (name) => marchPoints.find((point) => point.name === name) || marchPoints[0]

const getFormattedGeoLandmarks = (geoLandmarks) => {
  const { features = [] } = geoLandmarks

  const filteredGeoLandmarks = getFilteredGeoLandmarks(features)

  return filteredGeoLandmarks.map(({ name, distance, azimuth }) => {
    const distanceInKm = (distance / 1000).toFixed(0)
    const cardinalDirection = azimuthToCardinalDirection(azimuth)

    return `${distanceInKm} км на ${cardinalDirection} від м. ${name}`
  })
}

const MarchForm = (props) => {
  const {
    name,
    coord = {},
    refPoint,
    editableName,
    segmentType,
    required,
    segmentId,
    childId,
    isLast,
    restTime,
  } = props
  const { editFormField, addChild, deleteChild, setCoordMode, getMemoGeoLandmarks } = props.handlers

  const point = getPointByName(name)

  coord.lat = coord.lat || 0.00001
  coord.lng = coord.lng || 0.00001

  const [ pointTime, setPointTime ] = useState(+restTime)
  const [ refPointMarch, changeRefPoint ] = useState(refPoint)
  const [ geoLandmarks, changeGeoLandmarks ] = useState({})
  const [ isLoadingGeoLandmarks, changeIsLoadingGeoLandmarks ] = useState(false)

  const [ isModalVisible, changeIsModalVisible ] = useState(false)
  const [ ownRefPointMarch, changeOwnRefPoint ] = useState('')

  const showModal = () => {
    changeIsModalVisible(true)
  }

  const handleOkModal = (e) => {
    // changeRefPoint(ownRefPointMarch)
    changeIsModalVisible(false)
  }

  const handleCancelModal = (e) => {
    changeIsModalVisible(false)
  }

  const getGeoLandmarks = async (coord) => {
    await changeIsLoadingGeoLandmarks(true)
    changeGeoLandmarks({})
    const res = await getMemoGeoLandmarks(coord)
    changeGeoLandmarks(res)
    await changeIsLoadingGeoLandmarks(false)
  }

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
    showModal()
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
      pointTypeName = 'Пункт на маршруті'
    } else {
      pointTypeName = childId === 1 ? 'Вихідний рубіж' : name
    }
  } else {
    pointTypeName = segmentType === 0 ? name : 'Пункт на маршруті'
  }

  return (
    <div className={'dot-and-form'}>
      <div className={'dots'}>
        <Tooltip placement='topRight' title={'Розташування'}>
          <div className={`dot ${dotClass}`}/>
        </Tooltip>
        {(segmentType || childId || childId === 0)
          ? <div className={`vertical-block vertical-line ${lineColorClass}`}>
            <Tooltip placement='topRight' title={'Додати пункт'}>
              { !(segmentId === 0 && childId === undefined) &&
              <div className={'add-dot'} onClick={() => addChild(segmentId, childId)}/>
              }
            </Tooltip>
          </div>
          : <div className={'vertical-block'} style={{ borderColor: 'transparent' }}/>
        }
      </div>
      <div className={'dot-form'}>
        <div className={'march-coord'}>
          <Coordinates
            coordinates={coord}
            onSearch={placeSearch}
            onExitWithChange={onBlurCoordinates}
          />
          <Tooltip placement='topRight' title={'Вказати на карті'}>
            <a href='#' className={'logo-map'} onClick={() => setCoordMode({ segmentId, childId })}/>
          </Tooltip>
        </div>
        <Tooltip placement='left' title={'Географічний орієнтир'}>
          <Select
            className={'select-point'}
            value={refPointMarch}
            onChange={onChangeRefPoint}
            loading={isLoadingGeoLandmarks}
            placeholder='Географічний орієнтир'
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
              <Divider style={{ margin: '4px 0' }}/>
              <div style={{ display: 'flex', justifyContent: 'center', background: '#E6FBFF' }}>
                <span><strong>+ власний варіант</strong></span>
              </div>
            </Select.Option>
          </Select>
        </Tooltip>
        <br/>
        <Tooltip placement='left' title={'Тип пункту'}>
          {(!editableName || segmentType !== 41)
            ? <Input
              value={pointTypeName}
            //  value={childId ? name : }
            //   onChange={(e) => editFormField({
            //   fieldName: 'name',
            //   segmentId,
            //   childId,
            //   val: e.target.value,
            // })}
            />
            : <Select
              className={'select-point'}
              defaultValue={name}
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
        {(!required && childId !== undefined || segmentType !== 41) &&
        <div className={'un-required-field'}>
          {(!point.base && segmentType === 41)
            ? <div className={'time-block'}>
              <div className={'logo-time'}/>
              <Input
                onChange={onChangeTime}
                onBlur={onBlurTime}
                value={pointTime}
                maxLength={10}
                style={{ width: '50px' }}
              />
            </div>
            : <div/>
          }
          {childId !== undefined &&
          <IButton icon={IconNames.BAR_2_DELETE} onClick={() => deleteChild(segmentId, childId)}/>}

        </div>
        }
      </div>
      <Modal
        title='Вказати географічний орієнтир'
        visible={isModalVisible}
        onOk={handleOkModal}
        onCancel={handleCancelModal}
      >
        <Input onChange={(e) => changeOwnRefPoint(e.target.value)} placeholder='Географічний орієнтир' />
      </Modal>
    </div>
  )
}

MarchForm.propTypes = {
  name: PropTypes.string.isRequired,
  coord: PropTypes.shape({}).isRequired,
  children: PropTypes.array,
  refPoint: PropTypes.string.isRequired,
  editableName: PropTypes.bool.isRequired,
  segmentType: PropTypes.number.isRequired,
  required: PropTypes.bool.isRequired,
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

export default MarchForm
