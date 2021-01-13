import React from 'react'
import PropTypes from 'prop-types'
import { MovablePanel, IButton, FormBlock, ColorTypes } from '@C4/CommonComponents'
import i18n from '../../i18n'
import { TopoObj } from '../../constants'

import './style.css'

const renderElement = (label, value, key = label) => <FormBlock wrap paddingV paddingH key={key}>{`${label}: ${value}`}</FormBlock>
const renderButtonElement = ({ index, onClick, value, isSelected, disabled }) => (
  <IButton
    onClick={disabled ? null : onClick}
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
  TopoObj.NAME,
]

const DEFAULT_SIZE = { width: 400 }
const MAX_HEIGHT = document?.documentElement?.clientHeight - 100
const MAX_WIDTH = document?.documentElement?.clientWidth - 100
const MIN_HEIGHT = 200
const MIN_WIDTH = 300
const DEFAULT_POSITION = { x: -(310 + 15 + DEFAULT_SIZE.width), y: 0 }

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
        minWidth={MIN_WIDTH}
        maxWidth={MAX_WIDTH}
        minHeight={MIN_HEIGHT}
        maxHeight={MAX_HEIGHT}
        defaultSize={DEFAULT_SIZE}
        defaultPosition={DEFAULT_POSITION}
      >
        {objectsCount
          ? <div className="topographic-object--content">
            <FormBlock vertical underline justifyContent="center">
              { features.map((element, index) => renderButtonElement({
                index,
                disabled: features.length === 1,
                onClick: () => selectTopographicItem(index),
                isSelected: index === selectedItem,
                value: element.properties[TopoObj.UKR_NAME] ||
                  element.properties[TopoObj.PROPER_NAME] ||
                  element.properties[TopoObj.OBJECT_TYPE],
              }))}
            </FormBlock>
            <FormBlock underline vertical>
              { renderIfExist(TopoObj.OBJECT_TYPE) }
              { renderIfExist(TopoObj.NAME) }
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
