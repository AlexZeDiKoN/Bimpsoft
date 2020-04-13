import L from 'leaflet'
import React from 'react'
import { components, utils } from '@DZVIN/CommonComponents'
import { Select } from 'antd'
import i18n from '../../../i18n'
import { distanceAzimuth } from '../../WebMap/patch/utils/sectors'
import ColorPicker from '../../common/ColorPicker'
import { colors } from '../../../constants'
import CoordinatesMixin, { COORDINATE_PATH } from './CoordinatesMixin'
import { colorOption } from './render'

const {
  FormRow,
  InputWithSuffix,
} = components.form

const { Coordinates: Coord } = utils
const MARKER = [ '', 'А', 'Б', 'В', 'Г' ]
const PRESET_COLORS = Object.values(colors.values)
const COLOR_PICKER_Z_INDEX = 2000

const WithRadii = (Component) => class RadiiComponent extends CoordinatesMixin(Component) {
  constructor (props) {
    super(props)
    this.state = {
      radiiText: [],
    }
  }

  isGoodRadiusRight = (radius, coordArray, index) => {
    if (!Number.isFinite(radius)) {
      return false
    }
    const coord1 = coordArray[0]
    let isGood = false
    if (Coord.check(coord1)) {
      const coord2 = L.CRS.Earth.calcPairRight(coord1, radius)
      switch (index) {
        case 1:
          isGood = coord2.lng > coordArray[index + 1].lng
          break
        case 2:
        case 3:
          isGood = (coord2.lng > coordArray[index + 1].lng) && (coord2.lng < coordArray[index - 1].lng)
          break
        case 4:
          isGood = (coord2.lng > coordArray[0].lng) && (coord2.lng < coordArray[index - 1].lng)
          break
        default:
          isGood = false
      }
    }
    return isGood
  }

  radiusChangeHandler = (index) => (radiusText) => {
    this.setResult((result) => {
      const radius = Number(radiusText)
      const coordinatesArray = result.getIn(COORDINATE_PATH).toJS()
      const isSet = this.isGoodRadiusRight(radius, coordinatesArray, index)
      if (isSet) {
        const coord2 = L.CRS.Earth.calcPairRight(coordinatesArray[0], radius)
        return result.setIn([ ...COORDINATE_PATH, index ], coord2)
      }
      return result
    })
    const { radiiText } = this.state
    radiiText[index] = radiusText
    this.setState({ radiiText })
  }

  radiiBlurHandler = (index) => () => {
    const { radiiText = [] } = this.state
    radiiText[index] = undefined
    this.setState({ radiiText })
    this.onCoordinateBlurHandler(index)
  }

  radiiFocusHandler = (index) => () => {
    this.onCoordinateFocusHandler(index)
  }

  changeSectorsInfo (info) {
    // this.setResult((result) => (
    //   result.updateIn([ ...PATH_S_INFO, info.index ], (value) => ({ ...value, [info.name]: info.value }))
    // ))
  }

  sectorAmplifierChangeHandler = (index) => ({ target: { name, value } }) => {
    this.changeSectorsInfo({ name, index, value })
  }

  sectorColorChangeHandler = (index) => (color) => {
    const name = 'color'
    const value = color
    this.changeSectorsInfo({ name, index, value })
  }

  sectorFillChangeHandler = (index) => (fill) => {
    const name = 'fill'
    const value = fill
    this.changeSectorsInfo({ name, index, value })
  }

  renderRadii () {
    const canEdit = this.isCanEdit()
    const coordinatesArray = this.getResult().getIn(COORDINATE_PATH).toJS()
    const coordO = coordinatesArray[0]
    const { radiiText = [] } = this.state
    return (
      <div>
        {coordinatesArray.map((elm, index) => {
          const radius = radiiText[index] ? radiiText[index]
            : Math.round(distanceAzimuth(coordO, coordinatesArray[index]).distance)
          const radiusIsGood = this.isGoodRadiusRight(Number(radius), coordinatesArray, index)
          const color = 'red'
          const fill = 'transparent'
          return (index !== 0) ? (
            <div key={index} className="container__itemWidth">
              <FormRow label={`${i18n.RADIUS} «${MARKER[index]}»`}>
                <InputWithSuffix
                  readOnly={!canEdit}
                  value={radius}
                  onChange={canEdit ? this.radiusChangeHandler(index) : null}
                  onFocus={canEdit ? this.radiiFocusHandler(index) : null}
                  onBlur={canEdit ? this.radiiBlurHandler(index) : null}
                  suffix={`${i18n.ABBR_METERS} ${radiusIsGood ? '' : '*'}`}
                  error={!radiusIsGood}
                />
              </FormRow>
              <FormRow label="Колір">
                <ColorPicker
                  color={color}
                  disabled={!canEdit}
                  onChange={this.sectorColorChangeHandler(index)}
                  zIndex={COLOR_PICKER_Z_INDEX}
                  presetColors={PRESET_COLORS}
                />
              </FormRow>
              <FormRow label="Заливка">
                <Select
                  value={fill}
                  disabled={!canEdit}
                  onChange={this.sectorFillChangeHandler(index)}
                >
                  {colorOption(colors.TRANSPARENT)}
                  {colorOption(colors.BLUE)}
                  {colorOption(colors.RED)}
                  {colorOption(colors.BLACK)}
                  {colorOption(colors.GREEN)}
                  {colorOption(colors.YELLOW)}
                  {colorOption(colors.WHITE)}
                </Select>
              </FormRow>
            </div>) : ''
        })}
      </div>
    )
  }
}

export default WithRadii
