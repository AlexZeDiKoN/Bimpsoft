import React, { useState, useEffect } from 'react'
import Trigger from 'rc-trigger'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { SketchPicker } from 'react-color'
import './style.css'
import { getClickOutsideRef } from '../../../utils/clickOutside'

const PRESENT_COLORS = [
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

  const isRGB = typeof color === 'object'
  const colorType = isRGB ? 'rgb' : 'hex'

  const handleButtonClick = () => {
    if (!props.disabled) {
      setOpened(!opened)
    }
  }
  const handleChange = (color) => setColor(color[colorType])
  const handleChangeComplete = (color) => props.onChange?.(color[colorType])

  const clickOutsideRef = getClickOutsideRef(() => {
    opened === true && setOpened(false)
  })

  const popup = <div ref={clickOutsideRef}>
    <SketchPicker
      presentColors={props.presentColors}
      onChange={handleChange}
      onChangeComplete={handleChangeComplete}
      color={color === null ? 'transparent' : color}
      disableAlpha={!isRGB}
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
        <button
          className={classNames('color-picker-button', {
            [props.className]: Boolean(props.className),
            'color-picker-button-undefined': color === undefined,
            'color-picker-button-empty': color !== undefined && (color === null || !color?.length),
          })}
          style={{ backgroundColor: color }}
          onClick={handleButtonClick}
        />
      </Trigger>
    </div>
  )
}

ColorPicker.propTypes = {
  color: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
  onChange: PropTypes.func,
  zIndex: PropTypes.number,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  presentColors: PropTypes.array,
  placement: PropTypes.oneOf([ 'bottomLeft', 'bottomRight' ]),
}

ColorPicker.defaultProps = {
  zIndex: 1000,
  placement: 'bottomLeft',
  presentColors: PRESENT_COLORS,
}

export default ColorPicker
