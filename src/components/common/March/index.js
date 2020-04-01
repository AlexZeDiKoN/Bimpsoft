import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Button, Select, Tooltip, Popover } from 'antd'
import { components, IButton, IconNames } from '@DZVIN/CommonComponents'
import placeSearch from '../../../server/places'
import SegmentButtonForm from './children/SegmentButtonForm'
import Header from './children/Header'
import PopupPanel from './children/PopupPanel'

import './style.css'

const {
  form: { Coordinates },
} = components

const points = [
  { name: 'Вихідний рубіж', rest: false },
  { name: 'Пункт на маршруті', rest: false },
  { name: 'Пункт привала', rest: true },
  { name: 'Пункт денного(нічного) відпочинку', rest: true },
  { name: 'Пункт добового відпочинку', rest: true },
  { name: 'Пункт(рубіж) регулювання', rest: false },
]

const getPointByName = (name) => {
  return points.find((point) => point.name === name)
}

class March extends Component {
  static propTypes = {
    segments: PropTypes.array,
    addSegment: PropTypes.func.isRequired,
    deleteSegment: PropTypes.func.isRequired,
    editFormField: PropTypes.func.isRequired,
    addChild: PropTypes.func.isRequired,
    deleteChild: PropTypes.func.isRequired,
    setCoordMode: PropTypes.func.isRequired,
  }

  renderSegmentBlocks = () => {
    const { segments, addSegment, deleteSegment } = this.props
    return segments.map((segment, id) => {
      const { segmentType, terrain, velocity, required } = segment
      if (segmentType === 0) {
        return null
      }
      let color = ''
      switch (segmentType) {
        case (41):
          color = '#DFE3B4'
          break
        case (42):
          color = '#FFE0A4'
          break
        case (43):
          color = '#94D8FF'
          break
        case (44):
          color = '#5bb24e'
          break
        default:
          break
      }
      const height = (1 + segment.children.length) * 145

      return <div key={`block${id}${segmentType}`} className={'segment'} style={{ backgroundColor: color, height }}>
        00:00
        <Popover placement="left" trigger="click" content={ <PopupPanel propData={{ ...segment, id, deleteSegment }} /> } >
        10 km
        </Popover>
        <SegmentButtonForm
          segmentId={id}
          deleteSegment={deleteSegment}
          segmentType={segmentType}
          terrain={terrain}
          velocity={velocity}
          required={required}
        />
        <Button onClick={() => addSegment(id)}>+</Button>
      </div>
    })
  }

  renderDotsForms = () => {
    const { segments, editFormField, addChild, deleteChild, setCoordMode } = this.props
    const formData = []

    segments.forEach((it, segmentId) => {
      formData.push({ ...it, segmentId })
      if (it.children && it.children.length > 0) {
        it.children.forEach((it2, childId) => {
          formData.push({ ...it2, childId, segmentId })
        })
      }
    })

    return formData.map((segment, id) => {
      const { name, coord = {}, refPoint, childId, segmentId, editableName, segmentType, required } = segment

      const point = getPointByName(name)

      let dotClass
      if (childId === undefined) {
        dotClass = formData.length - 1 === id ? 'flag-dot' : 'empty-dot'
      } else {
        dotClass = point && point.rest ? 'camp-dot' : 'cross-dot'
      }

      let lineColorClass
      switch (segmentType || formData[segmentId].segmentType) {
        case 42:
          lineColorClass = 'line-orange'
          break
        case 43:
          lineColorClass = 'line-blue'
          break
        default:
          lineColorClass = 'line-green'
      }

      return <div key={`dotForm${id}`} className={'dot-and-form'}>
        <div className={'dots'}>
          <Tooltip placement='topRight' title={'Розташування'}>
            <div className={`dot ${dotClass}`}/>
          </Tooltip>
          {(segmentType || childId || childId === 0)
            ? <div className={`vertical-block vertical-line ${lineColorClass}`}>
              <Tooltip placement='topRight' title={'Додати пункт'}>
                <div className={'add-dot'} onClick={() => addChild(segmentId, childId)}/>
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
              {points.map(({ name }, id) => (
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
    })
  }

  render () {
    return <div className={'march-container'}>
      <div className={'march-header'}>
        <Header/>
      </div>
      <div className={'march-main'}>
        <div className={'left'}>{this.renderSegmentBlocks()}</div>
        <div className={'right'}>{this.renderDotsForms()}</div>
      </div>
      <button onClick={() => this.props.getNearestSettlement({ lat: 30, lng: 50 })}>getNearestSettlement(48.62010, 30.08057)</button>
    </div>
  }
}

export default March
