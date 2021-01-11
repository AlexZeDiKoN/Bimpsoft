import React from 'react'
import PropTypes from 'prop-types'
import { MovablePanel, IButton, FormBlock, ColorTypes } from '@C4/CommonComponents'
import i18n from '../../i18n'
import { TopoObj } from '../../constants'

import './style.css'

const renderElement = (label, value, key = label) => <FormBlock wrap paddingV paddingH key={key}>{`${label}: ${value}`}</FormBlock>
const renderButtonElement = ({ index, onClick, value, isSelected }) => (
  <IButton
    onClick={onClick}
    key={index}
    colorType={isSelected ? ColorTypes.DARK_GREEN : null}
  >
    {value}
  </IButton>
)

const MAIN_ROWS_KEYS = [
  TopoObj.OBJECT_TYPE,
  TopoObj.TOPCODE,
  TopoObj.POINT_COORDINATE,
  TopoObj.POINT_HEIGHT,
]

export default class TopoObjModal extends React.Component {
  static propTypes = {
    wrapper: PropTypes.oneOf([ MovablePanel ]),
    title: PropTypes.string,
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
      title,
      topographicObjects: {
        features,
        location,
        selectedItem,
      },
      selectTopographicItem,
    } = this.props

    const objectsCount = features ? features.length : undefined
    const getValue = (key) => features[ selectedItem ].properties[ key ]
    const renderIfExist = (key) => getValue(key) && renderElement(key, getValue(key))

    return <div className="topographic-object--wrap">
      <Wrapper
        title={title}
        onClose={onClose}
        minWidth={300}
        minHeight={200}
        defaultSize={{ height: 300 }}
      >
        {objectsCount
          ? <div className="topographic-object--content">
            <FormBlock vertical underline justifyContent="center">
              { features.map((element, index) => renderButtonElement({
                index,
                onClick: () => selectTopographicItem(index),
                isSelected: index === selectedItem,
                value: element.properties[TopoObj.UKR_NAME] ||
                  element.properties[TopoObj.PROPER_NAME] ||
                  element.properties[TopoObj.OBJECT_TYPE],
              }))}
            </FormBlock>
            <FormBlock underline vertical>
              { renderIfExist(TopoObj.OBJECT_TYPE) }
              { renderIfExist(TopoObj.TOPCODE) }
              { renderElement(TopoObj.POINT_COORDINATE, `${location.lat} ${location.lng}`) }
              { renderIfExist(TopoObj.POINT_HEIGHT) }
            </FormBlock>
            <FormBlock vertical>
              {Object.keys(features[ selectedItem ].properties)
                .filter((item) => !MAIN_ROWS_KEYS.includes(item))
                .map((item, index) => renderIfExist(item, index))
              }
            </FormBlock>
          </div>
          : <div className='topographic-object--no-data'>{i18n.NO_OBJECTS}</div>}
      </Wrapper>
    </div>
  }
}
