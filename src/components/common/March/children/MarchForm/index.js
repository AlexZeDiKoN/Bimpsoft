import { Input, Select, Tooltip } from 'antd'
import { components, IButton, IconNames } from '@DZVIN/CommonComponents'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import placeSearch from '../../../../../server/places'
import { isNumberSymbols } from '../../../../../utils/validation/number'

const {
  form: { Coordinates },
} = components

const marchPoints = [
  { name: 'Вихідний рубіж', rest: false, base: true, time: 0 },
  { name: 'Пункт на маршруті', rest: false, time: 0 },
  { name: 'Пункт привалу', rest: true, time: 1 },
  { name: 'Пункт денного(нічного) відпочинку', rest: true, time: 8 },
  { name: 'Пункт добового відпочинку', rest: true, time: 24 },
  { name: 'Пункт(рубіж) регулювання', rest: true, time: 0, notEditableTime: true },
]

const getPointByName = (name) => marchPoints.find((point) => point.name === name) || marchPoints[0]

const MarchForm = (props) => {
  const { name, coord = {}, refPoint, editableName, segmentType, required, segmentId, childId, isLast, restTime } = props
  const { editFormField, addChild, deleteChild, setCoordMode, setRefPoint } = props.handlers

  const point = getPointByName(name)

  const [ pointTime, setPointTime ] = useState(+restTime)
  const [ rPoint, changeRefPoint ] = useState(refPoint)

  const onChangeTime = (e) => {
    if (point.notEditableTime) {
      setPointTime(0)
      return pointTime
    }
    const { value } = e.target
    const numberVal = value ? (isNumberSymbols(value) && value) || pointTime : ''

    setPointTime(+numberVal)
  }

  const onChangeMarchPoint = (value) => {
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

  const onBlurRefPoint = (e) => {
    editFormField({
      val: e.target.value,
      fieldName: 'refPoint',
      segmentId,
      childId,
    })
  }

  const onBlurTime = (e) => {
    editFormField({
      val: +e.target.value,
      segmentId,
      childId,
      fieldName: 'restTime',
    })
  }

  let dotClass
  if (childId === undefined) {
    dotClass = isLast ? 'flag-dot' : 'empty-dot'
  } else {
    dotClass = point.rest ? 'camp-dot' : 'cross-dot'
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
            onChange={({ lat, lng }) => editFormField({
              fieldName: 'coord',
              segmentId,
              childId,
              val: { lat, lng },
            })}
            onSearch={placeSearch}
          />
          <Tooltip placement='topRight' title={'Вказати на карті'}>
            <a href='#' className={'logo-map'} onClick={() => setCoordMode({ segmentId, childId })}/>
          </Tooltip>
        </div>
        <Tooltip placement='left' title={'Географічний орієнтир'}>
          <Input
            value={rPoint}
            onChange={(e) => { changeRefPoint(e.target.value) }}
            onBlur={onBlurRefPoint}
          />
        </Tooltip>
        <br/>
        <Tooltip placement='left' title={'Тип пункту'}>
          {(!editableName)
            ? <Input value={name} onChange={(e) => editFormField({
              fieldName: 'name',
              segmentId,
              childId,
              val: e.target.value,
            })}/>
            : <Select
              className={'select-point'}
              defaultValue={name}
              onChange={onChangeMarchPoint}
            >
              {marchPoints.map(({ name }, id) => (
                <Select.Option key={id} value={name}>{name}</Select.Option>
              ))}
            </Select>
          }
        </Tooltip>
        {(!required) &&
        <div className={'un-required-field'}>
          {(!point.base)
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
          <IButton icon={IconNames.BAR_2_DELETE} onClick={() => deleteChild(segmentId, childId)}/>
        </div>
        }
      </div>
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
  childId: PropTypes.number.isRequired,
  handlers: PropTypes.shape({
    editFormField: PropTypes.func.isRequired,
    addChild: PropTypes.func.isRequired,
    deleteChild: PropTypes.func.isRequired,
    setCoordMode: PropTypes.func.isRequired,
    setRefPoint: PropTypes.func.isRequired,
  }).isRequired,
  isLast: PropTypes.bool,
  restTime: PropTypes.number,
}

export default MarchForm
