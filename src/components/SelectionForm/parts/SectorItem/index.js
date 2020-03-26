import React, { Fragment } from 'react'
import { Input, Select } from 'antd'
import PropTypes from 'prop-types'
import { components, utils } from '@DZVIN/CommonComponents'
import './style.css'
// import { Earth } from 'leaflet/src/geo/crs/CRS.Earth'
import { colors } from '../../../../constants'
import ColorPicker from '../../../common/ColorPicker'
import { colorOption } from '../render'
import { distanceAngle, sphereDirect, angleDegCheck } from '../../../WebMap/patch/utils/sectors'
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

  // state = { azimut1Text: null, azimut2Text: null, radiusText: null }
  constructor (props) {
    super(props)
    const { beginCoordinate, coord1, coord2 } = this.props
    const da1 = distanceAngle(beginCoordinate, coord1)
    const da2 = distanceAngle(beginCoordinate, coord2)
    this.state = {
      azimut1Text: da1.angledeg.toFixed(0),
      azimut2Text: da2.angledeg.toFixed(0),
      radiusText: da1.distance.toFixed(0),
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

  // обработка изменения радиуса
  radiusChangeHandler = (radiusText) => {
    this.setState({ radiusText })
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
      const da1 = distanceAngle(beginCoordinate, coord1)
      const da2 = distanceAngle(beginCoordinate, coord2)
      const coord1New = sphereDirect(beginCoordinate, da1.angledeg, radius)
      const coord2New = sphereDirect(beginCoordinate, da2.angledeg, radius)
      if (Coord.check(coord1New) && Coord.check(coord2New)) {
        onChange && onChange({ coord1: coord1New, coord2: coord2New, index })
      }
    }
    this.setState({ isFocus: false })
    onFocus({ index, isActive: false })
  }

  azimut1ChangHandler = (value) => this.setState({ azimut1Text: value })

  azimutBlurHandler = () => {
    const { onChange, onFocus, index, beginCoordinate } = this.props
    const { radiusText, azimut1Text, azimut2Text } = this.state
    const radius = Number(radiusText)
    if (Number.isFinite(radius) && Coord.check(beginCoordinate) &&
      angleDegCheck(azimut1Text) && angleDegCheck(azimut2Text)) {
      const coord1New = sphereDirect(beginCoordinate, azimut1Text, radius)
      const coord2New = sphereDirect(beginCoordinate, azimut2Text, radius)
      if (Coord.check(coord1New) && Coord.check(coord2New)) {
        onChange && onChange({ coord1: coord1New, coord2: coord2New, index })
      }
    }
    this.setState({ isFocus: false })
    onFocus({ index, isActive: false })
  }

  azimut2ChangHandler = (value) => this.setState({ azimut2Text: value })

  render () {
    const { index, sectorInfo, readOnly, beginCoordinate, coord1, coord2, addOnly } = this.props
    if (index === undefined) { return }
    const da1 = distanceAngle(beginCoordinate, coord1)
    const da2 = distanceAngle(beginCoordinate, coord2)
    const { radiusText, azimut1Text, azimut2Text } = this.state
    const radius = radiusText !== null ? radiusText : da1.distance.toFixed(0)
    const azimut1 = azimut1Text !== null ? azimut1Text : da1.angledeg.toFixed(0)
    const azimut2 = azimut2Text !== null ? azimut2Text : da2.angledeg.toFixed(0)
    const radiusIsWrong = !Number.isFinite(Number(radius))
    const azimut1IsWrong = !Number.isFinite(Number(azimut1)) || (Math.abs(azimut1) > 360)
    const azimut2IsWrong = !Number.isFinite(Number(azimut2)) || (Math.abs(azimut2) > 360)
    const amplifierT = sectorInfo?.amplifier || ''
    const color = sectorInfo?.color || colors.BLACK
    const fill = sectorInfo?.fill || colors.TRANSPARENT
    return (
      <Fragment key={`${coord1.lat}/${coord1.lng}`}>
        <tr>
          <td>
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
          </td>
          <td>
            <InputWithSuffix
              key = 'a1'
              readOnly={readOnly}
              value={azimut1}
              onChange={!readOnly ? this.azimut1ChangHandler : null }
              onFocus={!readOnly ? this.onFocusHandler : null }
              onBlur={!readOnly ? this.azimutBlurHandler : null}
              suffix={i18n.ABBR_GRADUS}
              error={azimut1IsWrong}
            />
          </td>
          <td>
            <InputWithSuffix
              key = 'a2'
              readOnly={readOnly}
              value={ azimut2}
              onChange={!readOnly ? this.azimut2ChangHandler : null }
              onFocus={!readOnly ? this.onFocusHandler : null }
              onBlur={!readOnly ? this.azimutBlurHandler : null}
              suffix={i18n.ABBR_GRADUS}
              error={azimut2IsWrong}
            />
          </td>
          <td>
            <Input.TextArea
              value={amplifierT}
              name={'amplifier'}
              onChange={this.sectorAmplifierChangeHandler}
              onFocus={!readOnly ? this.onFocusHandler : null }
              onBlur={!readOnly ? this.onBlurHandler : null}
              disabled={readOnly}
              rows={1}
            />
          </td>
          <td>
            <ColorPicker
              color={color}
              disabled={readOnly}
              onChange={this.sectorColorChangeHandler}
              zIndex={COLOR_PICKER_Z_INDEX}
              presetColors={PRESET_COLORS}
            />
          </td>
          <td>
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
          </td>
          <td>
            <FormItem className={'sectorItems'}>
              { !readOnly && !addOnly && (<IconHovered
                icon={IconNames.DELETE_24_DEFAULT}
                hoverIcon={IconNames.DELETE_24_HOVER}
                onClick={this.removeSectorClickHandler}
              />)}
            </FormItem>
          </td>
        </tr>
      </Fragment>)
  }
}
