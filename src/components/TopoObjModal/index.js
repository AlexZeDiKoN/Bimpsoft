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
    selectTopographicItem: PropTypes.func,
    serviceStatus: PropTypes.bool,
  }

  render () {
    if (!this.props.topographicObjects.visible || !this.props.serviceStatus) {
      return null
    }

    const {
      wrapper: Wrapper,
      onClose,
      topographicObjects: {
        features,
        location,
        selectedItem,
      },
      selectTopographicItem,
    } = this.props
    const objectsCount = features ? features.length : undefined
    return (
      <Wrapper
        title={i18n.TOPOGRAPHIC_OBJECT_CARD}
        onClose={onClose}
        defaultPosition={{ x: window.screen.width * 0.5, y: window.screen.height * 0.05 }}
      >
        <FocusTrap>
          {objectsCount
            ? <div className='objInfoContainer'>
              <div className='elementListContainer'>
                {features.map((element, index) => <div
                  key={index}
                  className={`element ${index === selectedItem ? 'active' : ''}`}
                  onClick={() => selectTopographicItem(index)}
                >
                  {element.properties[ PROPERTIES.PROPER_NAME ] || element.properties[ PROPERTIES.OBJECT_TYPE ]}
                </div>)}
              </div>
              <div className='propertiesContainer'>
                <div className='mainPropertiesContainer'>
                  <div
                    className='mainProperties'>{`${PROPERTIES.OBJECT_TYPE}: ${features[ selectedItem ].properties[ PROPERTIES.OBJECT_TYPE ]}`}</div>
                  <div
                    className='mainProperties'>{`${PROPERTIES.TOPCODE}: ${features[ selectedItem ].properties[ PROPERTIES.TOPCODE ]}`}</div>
                  <div
                    className='mainProperties'>{`${PROPERTIES.POINT_COORDINATE}: ${location.lat} ${location.lng}`}</div>
                </div>
                <div className='secondaryPropertiesContainer'>
                  {Object.keys(features[ selectedItem ].properties)
                    .filter((item) =>
                      item !== PROPERTIES.OBJECT_TYPE && item !== PROPERTIES.TOPCODE)
                    .map((item, index) =>
                      <div className='secondaryProperties' key={index}>
                        {`${item}: ${features[ selectedItem ].properties[ item ]}`}
                      </div>)
                  }
                </div>
              </div>
            </div>
            : <div className='elementListContainer'>no objects</div>}
        </FocusTrap>
      </Wrapper>
    )
  }
}
