import L from 'leaflet'
import React from 'react'
import { components, utils } from '@DZVIN/CommonComponents'
import { Input, Select } from 'antd'
import i18n from '../../../i18n'
import { distanceAngle } from '../../WebMap/patch/utils/sectors'
import ColorPicker from '../../common/ColorPicker'
import { colors } from '../../../constants'
import { MINIMUM, MAXIMUM, EFFECTIVE } from '../../../i18n/ua'
import { colorOption } from './render'
import CoordinatesMixin, { COORDINATE_PATH } from './CoordinatesMixin'

const {
  FormRow,
  InputWithSuffix,
  FormDivider,
} = components.form

const { Coordinates: Coord } = utils
const MARKER = [ '', MINIMUM, EFFECTIVE, MAXIMUM ]
const PATH_S_INFO = [ 'attributes', 'sectorsInfo' ]
const PRESET_COLORS = Object.values(colors.values)
const COLOR_PICKER_Z_INDEX = 2000

const WithRadiiAndAmplifiers = (Component) => class RadiiAndAmplifiersComponent extends CoordinatesMixin(Component) {
  constructor (props) {
    super(props)
    this.state = {
      radiiText: [],
      amplifiers: [],
    }
  }

  setRadiusSector = (index, radiusText) => {
    this.setResult((result) => {
      const radius = Number(radiusText)
      if (Number.isFinite(radius)) {
        const coordinatesArray = result.getIn(COORDINATE_PATH).toJS()
        const coord1 = coordinatesArray[0]
        if (Coord.check(coord1)) {
          const coord2 = L.CRS.Earth.calcPairDown(coord1, radius)
          const isSet = ((coord2.lat > coordinatesArray[index - 1].lat) &&
          (index + 1) < coordinatesArray.size ? (coord2.lat < coordinatesArray[index + 1].lat) : true)
          if (isSet) {
            return result.setIn([ ...COORDINATE_PATH, index ], coord2)
          }
        }
      }
      return result
    })
  }

  // обработка изменения радиуса
  radiusChangeHandler = (index) => (radiusText) => {
    this.setRadiusSector(index, radiusText)
    const { radiiText } = this.state
    radiiText[index] = radiusText
    this.setState({ radiiText })
  }

  radiusBlurHandler = (index) => () => {
    const { radiiText = [] } = this.state
    radiiText[index] = undefined
    this.setState({ radiiText })
    this.onCoordinateBlurHandler(index)
  }

  amplifierBlurHandler = (index) => () => {
    const { amplifiers = [] } = this.state
    amplifiers[index] = undefined
    this.setState({ amplifiers })
    this.onCoordinateBlurHandler(index)
  }

  sectorFocusHandler = (index) => () => {
    this.onCoordinateFocusHandler(index)
  }

  changeSectorsInfo (info) {
    this.setResult((result) => (
      result.updateIn([ ...PATH_S_INFO, info.index ], (value) => ({ ...value, [info.name]: info.value }))
    ))
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

  renderRadiiAndAmplifiers () {
    const canEdit = this.isCanEdit()
    const formStore = this.getResult()
    const coordinatesArray = formStore.getIn(COORDINATE_PATH).toJS()
    const sectorsInfo = formStore.getIn(PATH_S_INFO).toJS()
    const coordO = coordinatesArray[0]
    const indexEnd = coordinatesArray.length - 1
    const { radiiText = [] } = this.state
    return (
      coordinatesArray.map((elm, index) => {
        const radius = radiiText[index] ? radiiText[index]
          : Math.round(distanceAngle(coordO, coordinatesArray[index]).distance)
        const sectorInfo = sectorsInfo[index] ?? {}
        const amplifierT = sectorInfo?.amplifier || ''
        const color = sectorInfo?.color || '#000000'
        const fill = sectorInfo?.fill || colors.TRANSPARENT
        const radiusIsGood = Number.isFinite(Number(radius))
        return (index !== 0) ? (
          <>
            <div key={index} className="circularzone-container__itemWidth">
              <div className="container__itemWidth50">
                <FormRow label={`${MARKER[index]} радіус`} >
                  <InputWithSuffix
                    readOnly={!canEdit}
                    value={radius}
                    onChange={canEdit ? this.radiusChangeHandler(index) : null}
                    onFocus={canEdit ? this.sectorFocusHandler(index) : null}
                    onBlur={canEdit ? this.radiusBlurHandler(index) : null}
                    suffix={`${i18n.ABBR_METERS} ${radiusIsGood ? '' : '*'}`}
                    error={!radiusIsGood}
                  />
                </FormRow>
                <FormRow label={`Ампліфікатор «Т${index}»`} >
                  <Input.TextArea
                    value={amplifierT}
                    name={'amplifier'}
                    onChange={this.sectorAmplifierChangeHandler(index)}
                    onFocus={canEdit ? this.sectorFocusHandler(index) : null}
                    onBlur={canEdit ? this.amplifierBlurHandler(index) : null}
                    disabled={!canEdit}
                    rows={1}
                  />
                </FormRow>
              </div>
              <div className="container__itemWidth50">
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
              </div>
            </div>
            { (index < indexEnd) && <FormDivider/> }
          </>)
          : ''
      })
    )
  }
}

export default WithRadiiAndAmplifiers
