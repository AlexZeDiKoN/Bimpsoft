import { Input, Select, Tooltip } from 'antd'
import { components, IButton, IconNames } from '@DZVIN/CommonComponents'
import React from 'react'
import PropTypes from 'prop-types'
import placeSearch from '../../../../../server/places'

const getPointByName = (name) => {
  return marchPoints.find((point) => point.name === name)
}

const {
  form: { Coordinates },
} = components

const marchPoints = [
  { name: 'Вихідний рубіж', rest: false },
  { name: 'Пункт на маршруті', rest: false },
  { name: 'Пункт привала', rest: true },
  { name: 'Пункт денного(нічного) відпочинку', rest: true },
  { name: 'Пункт добового відпочинку', rest: true },
  { name: 'Пункт(рубіж) регулювання', rest: false },
]

const MarchForm = (props) => {
  const { name, coord = {}, refPoint, editableName, segmentType, required, segmentId, childId, isLast } = props
  const { editFormField, addChild, deleteChild, setCoordMode } = props.handlers

  const point = getPointByName(name)

  let dotClass
  if (childId === undefined) {
    dotClass = isLast ? 'flag-dot' : 'empty-dot'
  } else {
    dotClass = point && point.rest ? 'camp-dot' : 'cross-dot'
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
          : <div className={'vertical-block'}/>
        }
      </div>
      <div className={'dot-form'}>
        <div className={'march-coord'}>
          <Coordinates
            coordinates={coord}
            onChange={(e) => editFormField({
              fieldName: 'coord',
              segmentId,
              childId,
              val: e,
            })}
            onSearch={placeSearch}
          />
          <Tooltip placement='topRight' title={'Вказати на карті'}>
            <a href='#' className={'logoMap'} onClick={() => setCoordMode({ segmentId, childId })}/>
          </Tooltip>
        </div>
        <Input value={refPoint || 'Географічний орієнтир'}/>
        <br/>
        {(!editableName)
          ? <Input value={name} onChange={(e) => editFormField({
            fieldName: 'name',
            segmentId,
            childId,
            val: e.target.value,
          })}/>
          : <Select
            className={'selectPoint'}
            defaultValue={name}
            onChange={(value) => editFormField({
              val: value,
              segmentId,
              childId,
              fieldName: 'name',
            })}
          >
            {marchPoints.map(({ name }, id) => (
              <Select.Option key={id} value={name}>{name}</Select.Option>
            ))}
          </Select>
        }
        {(!required) &&
        <div className={'unRequiredField'}>
          {(point && point.rest)
            ? <div className={'timeBlock'}>
              <div className={'logoTime'}/>
              <Input maxLength={10} style={{ width: '50px' }}/>
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
  }).isRequired,
  isLast: PropTypes.bool,
}

export default MarchForm
