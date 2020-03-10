import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Icon, Input, Button, Select } from 'antd'
import SegmentButtonForm from './children/SegmentButtonForm'
import './style.css'

class March extends Component {
  static propTypes = {
    indicators: PropTypes.object,
    segments: PropTypes.array,
    integrity: PropTypes.bool,
    setMarchParams: PropTypes.func,
    setIntegrity: PropTypes.func,
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
      const height = (1 + segment.children.length) * 100

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
    const { segments, editFormField } = this.props
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
      const { name, coord, refPoint, childId, segmentId, editableName } = segment

      return <div key={`dotForm${id}`} className={'dot-and-form'}>
        <div className={'dot'}/>
        <div className={'dot-form'}>
          <Input value={coord} onChange={(e) => editFormField({
            fieldName: 'coord',
            segmentId,
            childId,
            val: e.target.value,
          })}/>
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

const WrappedMarch = Form.create()(March)

export default WrappedMarch
