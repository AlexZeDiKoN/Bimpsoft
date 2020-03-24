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
  }

  renderDotsForms = () => {
    const { segments, editFormField, addChild, deleteChild, setCoordMode } = this.props
    const handlers = {
      editFormField,
      addChild,
      deleteChild,
      setCoordMode,
    }

    return <div className={'dots-forms'}>
      { segments.map((segment, segmentId) => {
        const { children } = segment

        return (<div key={segmentId} className={'segmentWithForm'}>
          <div className={'segment-block'}>
            <SegmentBlock
              segment={segment}
              addSegment={this.props.addSegment}
              deleteSegment={this.props.deleteSegment}
              segmentId={segmentId}
            />
          </div>
          <div className={'formContainer'}>
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
        <div>{this.renderDotsForms()}</div>
      </div>
    </div>
  }
}

export default March
