import React from 'react'
import PropTypes from 'prop-types'
import FocusTrap from 'react-focus-lock'
import i18n from '../../i18n'
import * as PROPERTIES from '../../constants/TopoObjModal'
import ModalContainer from '../common/ModalContainer'

import './style.css'

export default class TopoObjModal extends React.Component {
  static propTypes = {
    wrapper: PropTypes.oneOf([ ModalContainer ]),
    topographicObjects: PropTypes.object,
    onClose: PropTypes.func,
  }

  state = {
    selectedItem: 0,
  }

  changeActiveObject = (i) => { this.setState({ selectedItem: i }) }

  render () {
    if (!this.props.topographicObjects.visible) {
      return null
    }

    const { wrapper: Wrapper, onClose, topographicObjects: { features, location } } = this.props
    const { selectedItem } = this.state
    const objectsCount = features ? features.length : undefined
    return (
      <Wrapper
        title={i18n.TOPOGRAPHIC_OBJECT_CARD}
        onClose={onClose}
        defaultPosition={{ x: window.screen.width * 0.5, y: window.screen.height * 0.05 }}
      >
        <FocusTrap>
          <div className='elementListContainer'>
            {objectsCount && features.map((element, index) => <div
              key={index}
              className={`element ${index === selectedItem ? 'active' : ''}`}
              onClick={() => this.changeActiveObject(index)}
            >
              {element.properties[PROPERTIES.PROPER_NAME] || element.properties[PROPERTIES.OBJECT_TYPE]}
            </div>)}
          </div>
          <div className='propertiesContainer'>
            <div className='mainPropertiesContainer'>
              <div className='mainProperties'>{`${PROPERTIES.OBJECT_TYPE}: ${features[selectedItem].properties[PROPERTIES.OBJECT_TYPE]}`}</div>
              <div className='mainProperties'>{`${PROPERTIES.TOPCODE}: ${features[selectedItem].properties[PROPERTIES.TOPCODE]}`}</div>
              <div className='mainProperties'>{`${PROPERTIES.POINT_COORDINATE}: ${location.lat} ${location.lng}`}</div>
            </div>
            <div className='secondaryPropertiesContainer'>
              {Object.keys(features)
                .filter((item) =>
                  !item.properties[PROPERTIES.OBJECT_TYPE] && !item.properties[PROPERTIES.TOPCODE])
                .map((item, index) =>
                  <div className='secondaryProperties' key={index}>
                    {`item`}
                  </div>)
              }
            </div>
          </div>
        </FocusTrap>
      </Wrapper>
    )
  }
}
