import React from 'react'
import { Input, Select } from 'antd'
import PropTypes from 'prop-types'
import { components, utils } from '@DZVIN/CommonComponents'
import './style.css'
import { Earth } from 'leaflet/src/geo/crs/CRS.Earth'
import { colors } from '../../../../constants'
import ColorPicker from '../../../common/ColorPicker'
import { colorOption } from '../render'
import { distanceAzimuth, sphereDirect, angleDegCheck, azimuthCheck } from '../../../WebMap/patch/utils/sectors'
import i18n from '../../../../i18n'

const {
  icons: { IconHovered, names: IconNames },
  form: { FormItem, InputWithSuffix },
} = components

const PRESET_COLORS = Object.values(colors.values)
const COLOR_PICKER_Z_INDEX = 2000
const { Coordinates: Coord } = utils

export default class SectorItem extends React.Component {
  static propTypes = {
    index: PropTypes.number,
    beginCoordinate: PropTypes.object,
    secondCoordinate: PropTypes.object,
    coord1: PropTypes.object,
    coord2: PropTypes.object,
    sectorInfo: PropTypes.object,
    canRemove: PropTypes.bool,
    readOnly: PropTypes.bool,
    addOnly: PropTypes.bool,
    onChangeProps: PropTypes.func,
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
    onFocus: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      azimuthLText: undefined,
      azimuthRText: undefined,
      radiusText: undefined,
    }
  }

  removeSectorClickHandler = () => {
    const { onRemove, index } = this.props
    onRemove && onRemove(index)
  }

  sectorAmplifierChangeHandler = ({ target: { name, value } }) => {
    const { onChangeProps, index } = this.props
    onChangeProps && onChangeProps({ name, index, value })
  }

  sectorColorChangeHandler = (color) => {
    const { onChangeProps, index } = this.props
    const name = 'color'
    const value = color
    onChangeProps && onChangeProps({ name, index, value })
  }

  sectorFillChangeHandler = (fill) => {
    const { onChangeProps, index } = this.props
    const name = 'fill'
    const value = fill
    onChangeProps && onChangeProps({ name, index, value })
  }

  onFocusHandler = () => {
    const { onFocus, index } = this.props
    onFocus && onFocus({ index, isActive: true })
  }

  onBlurHandler = () => {
    const { onFocus, index } = this.props
    onFocus && onFocus({ index, isActive: false })
  }

  radiusBlurHandler = () => {
    const { onChange, onFocus, index, beginCoordinate, coord1, coord2 } = this.props
    const { radiusText } = this.state
    const radius = Number(radiusText)
    if (Number.isFinite(radius) && Coord.check(beginCoordinate) && Coord.check(coord1) && Coord.check(coord2)) {
      const da1 = distanceAzimuth(beginCoordinate, coord1)
      const da2 = distanceAzimuth(beginCoordinate, coord2)
      const coord1New = sphereDirect(beginCoordinate, da1.angledeg, radius)
      const coord2New = sphereDirect(beginCoordinate, da2.angledeg, radius)
      // TODO нужна проверка радиуса
      if (Coord.check(coord1New) && Coord.check(coord2New)) {
        onChange && onChange({ coord1: coord1New, coord2: coord2New, index })
      }
    }
    this.setState({ isFocus: false, radiusText: undefined })
    onFocus({ index, isActive: false })
  }

  azimutBlurHandler = () => {
    const { onChange, onFocus, index, beginCoordinate, coord1, coord2, secondCoordinate } = this.props
    const { azimuthLText, azimuthRText } = this.state
    if (azimuthLText === undefined && azimuthRText === undefined) {
      return
    }
    const radius = Earth.distance(beginCoordinate, coord1)
    const azimuthL = (azimuthLText !== undefined)
      ? Number(azimuthLText) : distanceAzimuth(beginCoordinate, coord1).angledeg
    const azimuthR = (azimuthRText !== undefined)
      ? Number(azimuthRText) : distanceAzimuth(beginCoordinate, coord2).angledeg
    const azimuthO = distanceAzimuth(beginCoordinate, secondCoordinate).angledeg
    if (Number.isFinite(radius) && Number.isFinite(azimuthL) && Number.isFinite(azimuthR)) {
      const toRad = Math.PI / 180
      if (angleDegCheck(azimuthL) &&
          angleDegCheck(azimuthR) &&
          azimuthCheck(azimuthO * toRad, azimuthL * toRad, azimuthR * toRad)) {
        const coord1New = sphereDirect(beginCoordinate, azimuthL, radius)
        const coord2New = sphereDirect(beginCoordinate, azimuthR, radius)
        if (Coord.check(coord1New) && Coord.check(coord2New)) {
          onChange && onChange({ coord1: coord1New, coord2: coord2New, index })
        }
      }
    }
    this.setState({ isFocus: false, azimuthLText: undefined, azimuthRText: undefined })
    onFocus({ index, isActive: false })
  }

  // обработка изменения радиуса
  radiusChangeHandler = (radiusText) => this.setState({ radiusText })

  azimut2ChangHandler = (value) => this.setState({ azimuthRText: value })

  azimut1ChangHandler = (value) => this.setState({ azimuthLText: value })

  render () {
    const { index, sectorInfo, readOnly, beginCoordinate, coord1, coord2, addOnly } = this.props
    if (index === undefined) { return }
    const da1 = distanceAzimuth(beginCoordinate, coord1)
    const da2 = distanceAzimuth(beginCoordinate, coord2)
    const { radiusText, azimuthLText, azimuthRText } = this.state
    const radius = radiusText ?? da1.distance.toFixed(0)
    const azimuthL = azimuthLText ?? da1.angledeg.toFixed(0)
    const azimuthR = azimuthRText ?? da2.angledeg.toFixed(0)
    const radiusIsWrong = !Number.isFinite(Number(radius))
    const azimuthLIsWrong = !Number.isFinite(Number(azimuthL)) || (Math.abs(azimuthL) > 360)
    const azimuthRIsWrong = !Number.isFinite(Number(azimuthR)) || (Math.abs(azimuthR) > 360)
    const amplifierT = sectorInfo?.amplifier || ''
    const color = sectorInfo?.color || colors.BLACK
    const fill = sectorInfo?.fill || colors.TRANSPARENT
    return (
      <div className='sectors-item-container' key={`${coord1.lat}/${coord1.lng}`}>
        <div className='first-section'>
          <div className='item'>
            <div>{i18n.RADIUS}</div>
            <InputWithSuffix
              key = 'r'
              readOnly={readOnly}
              value={radius}
              onChange={!readOnly ? this.radiusChangeHandler : null }
              onFocus={!readOnly ? this.onFocusHandler : null }
              onBlur={!readOnly ? this.radiusBlurHandler : null}
              suffix={i18n.ABBR_METERS}
              error={!radiusIsWrong}
            />
          </div>

          <div className='item'>
            <div>{i18n.AZIMUTH1}</div>
            <InputWithSuffix
              key = 'a1'
              readOnly={readOnly}
              value={azimuthL}
              onChange={!readOnly ? this.azimut1ChangHandler : null }
              onFocus={!readOnly ? this.onFocusHandler : null }
              onBlur={!readOnly ? this.azimutBlurHandler : null}
              suffix={`${i18n.ABBR_GRADUS} ${azimuthLIsWrong ? '*' : ''}`}
              error={azimuthLIsWrong}
            />
          </div>

          <div className='item'>
            <div>{i18n.AZIMUTH2}</div>
            <InputWithSuffix
              key = 'a2'
              readOnly={readOnly}
              value={ azimuthR}
              onChange={!readOnly ? this.azimut2ChangHandler : null }
              onFocus={!readOnly ? this.onFocusHandler : null }
              onBlur={!readOnly ? this.azimutBlurHandler : null}
              suffix={`${i18n.ABBR_GRADUS} ${azimuthRIsWrong ? '*' : ''}`}
              error={azimuthRIsWrong}
            />
          </div>
        </div>

        <div className='second-section'>
          <div className='item'>
            <div>{i18n.AMPLIFIER_T}</div>
            <Input.TextArea
              value={amplifierT}
              name={'amplifier'}
              onChange={this.sectorAmplifierChangeHandler}
              onFocus={!readOnly ? this.onFocusHandler : null }
              onBlur={!readOnly ? this.onBlurHandler : null}
              disabled={readOnly}
              rows={1}
            />
          </div>
        </div>

        <div className='three-section'>
          <div className='item'>
            <div>{i18n.LINE_COLOR}</div>
            <ColorPicker
              color={color}
              disabled={readOnly}
              onChange={this.sectorColorChangeHandler}
              zIndex={COLOR_PICKER_Z_INDEX}
              presetColors={PRESET_COLORS}
            />
          </div>

          <div className='item'>
            <div>{i18n.FILLING}</div>
            <Select
              value={fill}
              disabled={readOnly}
              onChange={this.sectorFillChangeHandler}
            >
              {colorOption(colors.TRANSPARENT)}
              {colorOption(colors.BLUE)}
              {colorOption(colors.RED)}
              {colorOption(colors.BLACK)}
              {colorOption(colors.GREEN)}
              {colorOption(colors.YELLOW)}
              {colorOption(colors.WHITE)}
            </Select>
          </div>
          <FormItem className={'sectorItems'}>
            { !readOnly && !addOnly && (<IconHovered
              icon={IconNames.DELETE_24_DEFAULT}
              hoverIcon={IconNames.DELETE_24_HOVER}
              onClick={this.removeSectorClickHandler}
            />)}
          </FormItem>
        </div>
      </div>)
  }
}
