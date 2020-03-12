import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Button } from 'antd'
import { components, IButton, IconNames } from '@DZVIN/CommonComponents'
import placeSearch from '../../../server/places'
import SegmentButtonForm from './children/SegmentButtonForm'
import './style.css'

const {
  form: { Coordinates },
} = components

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
      const height = (1 + segment.children.length) * 120

      return <div key={`block${id}${segmentType}`} className={'segment'} style={{ backgroundColor: color, height }}>
        00:00
        10 km
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

      return <div key={`dotForm${id}`} className={'dot-and-form'}>
        <div className={'dots'}>
          <div className={'dot'}/>
          {(segmentType || childId || childId === 0) && <div className={'add-dot'} onClick={() => addChild(segmentId, childId)}>+</div>}
        </div>
        <div className={'dot-form'}>
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
          <button onClick={() => setCoordMode({ segmentId, childId })}>координаты с карты</button>
          {refPoint || 'Географічний орієнтир'}
          <br/>
          {(editableName)
            ? <Input value={name} onChange={(e) => editFormField({
              fieldName: 'name',
              segmentId,
              childId,
              val: e.target.value,
            })}/>
            : name }
          {(!required) && <IButton icon={IconNames.BAR_2_DELETE} onClick={() => deleteChild(segmentId, childId)}/>}
        </div>
      </div>
    })
  }

  render () {
    return <div className={'march-container'}>
      <div className={'header'}>Header</div>
      <div className={'march-main'}>
        <div className={'left'}>{this.renderSegmentBlocks()}</div>
        <div className={'right'}>{this.renderDotsForms()}</div>
      </div>
    </div>
  }
}

export default March
