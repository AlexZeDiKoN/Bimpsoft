import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Header from './children/Header'
import SegmentBlock from './children/SegmentBlock'
import MarchForm from './children/MarchForm'
import './style.css'

class March extends Component {
  static propTypes = {
    segments: PropTypes.array,
    addSegment: PropTypes.func.isRequired,
    deleteSegment: PropTypes.func.isRequired,
    editFormField: PropTypes.func.isRequired,
    addChild: PropTypes.func.isRequired,
    deleteChild: PropTypes.func.isRequired,
    setCoordMode: PropTypes.func.isRequired,
    setRefPoint: PropTypes.func.isRequired,
    dataMarch: PropTypes.shape({}).isRequired,
  }

  renderDotsForms = () => {
    const { segments, editFormField, addChild, deleteChild, setCoordMode, setRefPoint, dataMarch } = this.props
    const handlers = {
      editFormField,
      addChild,
      deleteChild,
      setCoordMode,
      setRefPoint,
    }

    return <div className={'dots-forms'}>
      { segments.map((segment, segmentId) => {
        const { children } = segment

        return (<div key={segmentId} className={'segment-with-form'}>
          <div className={'segment-block'}>
            <SegmentBlock
              segment={segment}
              nextSegment={segments[segmentId + 1]}
              segmentId={segmentId}
              dataMarch={dataMarch}
              addSegment={this.props.addSegment}
              deleteSegment={this.props.deleteSegment}
            />
          </div>
          <div className={'form-container'}>
            <MarchForm
              key={`segment${segmentId}`}
              segmentId={segmentId}
              handlers={handlers}
              {...segment}
              isLast={segments.length - 1 === segmentId}
            />
            {children && children.map((child, childId) => {
              return <MarchForm
                key={`child${childId}`}
                segmentId={segmentId}
                childId={childId}
                handlers={handlers}
                {...segment}
                {...child}
              />
            })}
          </div>
        </div>)
      })}
    </div>
  }

  render () {
    return <div className={'march-container'}>
      <div className={'march-header'}>
        <Header/>
      </div>
      <div className={'march-main'}>
        <div style={{ width: '100%' }}>{this.renderDotsForms()}</div>
      </div>
      <button onClick={() => this.props.getNearestSettlement({ lat: 30, lng: 50 })}>getNearestSettlement(48.62010, 30.08057)</button>
    </div>
  }
}

export default March
