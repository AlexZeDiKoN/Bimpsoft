import React from 'react'
import PropTypes from 'prop-types'
import { MovablePanel, components } from '@C4/CommonComponents'
import { Input } from 'antd'

import i18n from '../../i18n'
import './style.css'

// TODO перевести на глобальну константу коли буде змержено гілку DZVIN-6560
const SIDEBAR_SIZE_DEFAULT = 320
const POPUP_WINDOW_WIDTH = 300

const { form: { ButtonSave, ButtonCancel } } = components

export default class GeoLandmarkModal extends React.Component {
  static propTypes = {
    wrapper: PropTypes.oneOf([ MovablePanel ]),
    coordinates: PropTypes.object,
    onClose: PropTypes.func,
    addGeoLandmark: PropTypes.func,
    visible: PropTypes.bool,
    segmentId: PropTypes.number,
    childId: PropTypes.number,
  }

  constructor (props) {
    super(props)
    this.state = {
      geoLandmark: '',
    }
  }

  onChangeGeoLandmark = (e) => {
    this.setState({ geoLandmark: e.target.value })
  }

  onAddGeoLandmark = () => {
    const { segmentId, childId, coordinates } = this.props
    this.props.addGeoLandmark(coordinates, this.state.geoLandmark, segmentId, childId)
    this.setState({ geoLandmark: '' })
    this.props.onClose()
  }

  render () {
    if (!this.props.visible) {
      return null
    }

    const { geoLandmark } = this.state
    const { wrapper: Wrapper, onClose } = this.props

    return (
      <div className='geo-landmark-modal-container'>
        <Wrapper
          title={i18n.SPECIFY_GEO_LANDMARK_TITLE}
          onClose={onClose}
          defaultPosition={{
            x: window.screen.width - SIDEBAR_SIZE_DEFAULT - POPUP_WINDOW_WIDTH * 1.1,
            y: window.screen.height * 0.11,
          }}
        >
          <div className='content' style={{ width: `${POPUP_WINDOW_WIDTH}px` }}>
            <div className='input-geo-landmark'>
              <div>{i18n.SPECIFY_GEO_LANDMARK_TITLE}</div>
              <Input value={geoLandmark} onChange={this.onChangeGeoLandmark}/>
            </div>
            <div className='buttons'>
              <ButtonSave className='button' onClick={this.onAddGeoLandmark} />
              <ButtonCancel className='button' onClick={onClose} />
            </div>
          </div>
        </Wrapper>
      </div>
    )
  }
}
