import React, { useState, useEffect, useCallback } from 'react'
import Trigger from 'rc-trigger'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Checkboard } from 'react-color/lib/components/common'
import './style.css'
import { IButton } from '@C4/CommonComponents'
import { Tooltip } from 'antd'
import { getClickOutsideRef } from '../../../utils/clickOutside'
import ColorPickerPopup from './ColorPickerPopup'
import { MOUSE_ENTER_DELAY } from '../../../constants/tooltip'

const PRESENT_COLORS = [
  'transparent',
  '#ffffff', // '#FFFFFFaa',
  '#ff999c', // '#ff666baa',
  '#ffbe99', // '#ff9e66aa',
  '#eeee92', // '#e6e65caa',
  '#daf696', // '#c7f261aa',
  '#ddffbb', // '#ccff99aa',
  '#ccffff', // '#b3ffffaa',
  '#9999ff', // '#6666ffaa',
  '#c499ff', // '#a666ffaa',
  '#ff99ff', // '#ff66ffaa',

  '#555555', // '#000000aa',
  '#ff5555', // '#ff0000aa',
  '#ff9955', // '#ff6600aa',
  '#ffff55', // '#ffff00aa',
  '#a4ff55', // '#77ff00aa',
  '#55ff55', // '#00ff00aa',
  '#55ffff', // '#00ffffaa',
  '#5555ff', // '#0000ffaa',
  '#9d55ff', // '#6c00ffaa',
  '#ff55ff', // '#ff00ffaa',

  '#8e8e8e', // '#555555aa',
  '#bc5555', // '#9a0000aa',
  '#bb7c55', // '#993b00aa',
  '#bbbb55', // '#999900aa',
  '#86bb55', // '#4a9900aa',
  '#55bb55', // '#009900aa',
  '#55bbbb', // '#009999aa',
  '#5555bb', // '#000099aa',
  '#8055bb', // '#400099aa',
  '#bb55bb', // '#990099aa',
]

const builtinPlacements = {
  bottomRight: {
    points: [ 'tr', 'br' ],
    offset: [ 0, 4 ],
    overflow: { adjustX: true, adjustY: true },
  },
  bottomLeft: {
    points: [ 'tl', 'bl' ],
    offset: [ 0, 4 ],
    overflow: { adjustX: true, adjustY: true },
  },
}

const POPUP_STYLE = { display: 'flex', position: 'absolute' }

const ColorPicker = (props) => {
  const [ opened, setOpened ] = useState(false)
  const [ color, setColor ] = useState(props.color)

  useEffect(() => {
    if (props.color !== color) {
      setColor(props.color)
    }
    // eslint-disable-next-line
  }, [ props.color ])

  const noColor = color !== undefined && (color === null || !color?.length || color === 'transparent')

  const isRGB = typeof color === 'object'
  const colorType = isRGB ? 'rgb' : 'hex'

  const handleButtonClick = () => {
    if (props.onHandlerColor) {
      props.onHandlerColor(true)
    }
    if (!props.disabled) {
      setOpened(!opened)
    }
  }
  const handleChange = useCallback(() => (color) => setColor(color[colorType]), [ colorType ])
  const handleChangeComplete = useCallback((color) => props.onChange?.(color[colorType]), [ props.onChange, colorType ])

  const clickOutsideRef = getClickOutsideRef(() => {
    if (props.onHandlerColor) {
      props.onHandlerColor(false)
    }
    opened === true && setOpened(false)
  })

  const popup = <div ref={clickOutsideRef}>
    <ColorPickerPopup
      presetColors={props.presetColors}
      onChange={handleChange}
      onChangeComplete={handleChangeComplete}
      color={noColor ? 'transparent' : color}
    />
  </div>

  return (
    <div className='color-picker'>
      <Trigger
        popupVisible={opened}
        builtinPlacements={builtinPlacements}
        popupPlacement={props.placement}
        destroyPopupOnHide={true}
        zIndex={props.zIndex}
        popupStyle={POPUP_STYLE}
        popup={popup}>
        {props.icon
          ? <Tooltip title={props.title} mouseEnterDelay={MOUSE_ENTER_DELAY} placement='topRight'>
            <IButton
              icon={props.icon}
              onClick={handleButtonClick}/>
          </Tooltip>
          : <button
            className={classNames('color-picker-button', {
              [props.className]: Boolean(props.className),
              'color-picker-button-undefined': color === undefined,
            })}
            style={{ backgroundColor: color }}
            onClick={handleButtonClick}
          >{noColor ? <Checkboard/> : null}</button>
        }
      </Trigger>
    </div>
  )
}

ColorPicker.propTypes = {
  icon: PropTypes.string,
  onHandlerColor: PropTypes.func,
  title: PropTypes.string,
  color: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
  onChange: PropTypes.func,
  zIndex: PropTypes.number,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  presetColors: PropTypes.array,
  placement: PropTypes.oneOf([ 'bottomLeft', 'bottomRight' ]),
}

ColorPicker.defaultProps = {
  zIndex: 1000,
  placement: 'bottomLeft',
  presetColors: PRESENT_COLORS,
}

export default ColorPicker
