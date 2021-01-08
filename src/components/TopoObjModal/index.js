import React from 'react'
import PropTypes from 'prop-types'
import FocusTrap from 'react-focus-lock'
import { MovablePanel } from '@C4/CommonComponents'
import i18n from '../../i18n'
import { TopoObj } from '../../constants'

import './style.css'

export default class TopoObjModal extends React.Component {
  static propTypes = {
    wrapper: PropTypes.oneOf([ MovablePanel ]),
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
    const getValue = (key) => features[ selectedItem ].properties[ key ]
    return (
      <div className='topographicCard'>
        <Wrapper
          title={i18n.TOPOGRAPHIC_OBJECT_CARD}
          onClose={onClose}
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
                    {element.properties[ TopoObj.UKR_NAME ] ||
                  element.properties[ TopoObj.PROPER_NAME ] ||
                  element.properties[ TopoObj.OBJECT_TYPE ]}
                  </div>)}
                </div>
                <div className='propertiesContainer'>
                  <div className='mainPropertiesContainer'>
                    {getValue(TopoObj.OBJECT_TYPE) && <div
                      className='mainProperties'>{`${TopoObj.OBJECT_TYPE}: ${getValue(TopoObj.OBJECT_TYPE)}`}
                    </div>}
                    {getValue(TopoObj.TOPCODE) && <div
                      className='mainProperties'>{`${TopoObj.TOPCODE}: ${getValue(TopoObj.TOPCODE)}`}
                    </div>}
                    <div
                      className='mainProperties'>{`${TopoObj.POINT_COORDINATE}: ${location.lat} ${location.lng}`}</div>
                    {getValue(TopoObj.POINT_HEIGHT) && <div
                      className='mainProperties'>{`${TopoObj.POINT_HEIGHT}: ${getValue(TopoObj.POINT_HEIGHT)}`}
                    </div>}
                  </div>
                  <div className='secondaryPropertiesContainer'>
                    {Object.keys(features[ selectedItem ].properties)
                      .filter((item) =>
                        item !== TopoObj.OBJECT_TYPE && item !== TopoObj.TOPCODE && item !== TopoObj.POINT_HEIGHT)
                      .map((item, index) =>
                        <div className='secondaryProperties' key={index}>
                          {`${item}: ${getValue(item)}`}
                        </div>)
                    }
                  </div>
                </div>
              </div>
              : <div className='elementListContainer'>{i18n.NO_OBJECTS}</div>}
          </FocusTrap>
        </Wrapper>
      </div>
    )
  }
}
