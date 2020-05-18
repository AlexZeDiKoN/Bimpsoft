import React from 'react'
import PropTypes from 'prop-types'
import FocusTrap from 'react-focus-lock'
import { MovablePanel } from '@DZVIN/CommonComponents'
import { Select, Input, Button } from 'antd'
import i18n from '../../i18n'

import { TopoObj } from '../../constants'

import './style.css'

export default class ReportMapModal extends React.Component {
  static propTypes = {
    wrapper: PropTypes.oneOf([ MovablePanel ]),
    reportMap: PropTypes.object,
    onClose: PropTypes.func,
    selectTopographicItem: PropTypes.func,
    serviceStatus: PropTypes.bool,
  }

  render () {
    if (!this.props.reportMap.visible /* || !this.props.serviceStatus */) {
      return null
    }

    const {
      wrapper: Wrapper,
      onClose,
    //   reportMap: {
    //     features,
    //     location,
    //     selectedItem,
    //   },
    //   selectTopographicItem,
    } = this.props
    // const objectsCount = features ? features.length : undefined
    return (
      <div className='topographicCard'>
        <Wrapper
          title={i18n.CREATE_REPORT_MAP}
          onClose={onClose}
        >

          <div>
            <div>
              <div>{i18n.NAME_OF_DOCUMENT}</div>
              <Input value={'name'} />
            </div>

            <div>
              <div>{i18n.AS_OF}</div>
            </div>

            <div>
              <Button>{i18n.YES}</Button>
              <Button>{i18n.NO}</Button>
            </div>
          </div>
          {/* <FocusTrap>onChange={handleChange
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
                    <div
                      className='mainProperties'>{`${TopoObj.OBJECT_TYPE}: ${features[ selectedItem ].properties[ TopoObj.OBJECT_TYPE ]}`}</div>
                    <div
                      className='mainProperties'>{`${TopoObj.TOPCODE}: ${features[ selectedItem ].properties[ TopoObj.TOPCODE ]}`}</div>
                    <div
                      className='mainProperties'>{`${TopoObj.POINT_COORDINATE}: ${location.lat} ${location.lng}`}</div>
                  </div>
                  <div className='secondaryPropertiesContainer'>
                    {Object.keys(features[ selectedItem ].properties)
                      .filter((item) =>
                        item !== TopoObj.OBJECT_TYPE && item !== TopoObj.TOPCODE)
                      .map((item, index) =>
                        <div className='secondaryProperties' key={index}>
                          {`${item}: ${features[ selectedItem ].properties[ item ]}`}
                        </div>)
                    }
                  </div>
                </div>
              </div>
              : <div className='elementListContainer'>{i18n.NO_OBJECTS}</div>}
          </FocusTrap> */}
        </Wrapper>
      </div>
    )
  }
}
