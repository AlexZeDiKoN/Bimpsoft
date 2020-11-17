import L from 'leaflet'
import React from 'react'
import { components, utils } from '@C4/CommonComponents'
import { Input, Select } from 'antd'
import i18n from '../../../i18n'
import { distanceAzimuth } from '../../WebMap/patch/utils/sectors'
import ColorPicker from '../../common/ColorPicker'
import { colors } from '../../../constants'
import { MINIMUM, MAXIMUM, EFFECTIVE } from '../../../i18n/ua'
import lineDefinitions from '../../WebMap/patch/Sophisticated/lineDefinitions'
import { extractLineCode } from '../../WebMap/patch/Sophisticated/utils'
import { MAX_LENGTH_TEXT } from '../../../constants/InputText'
import { colorOption } from './render'
import CoordinatesMixin, { COORDINATE_PATH } from './CoordinatesMixin'

const {
  FormRow,
  InputWithSuffix,
  FormDivider,
} = components.form

const { Coordinates: Coord } = utils
const MARKER = [ '', MINIMUM, EFFECTIVE, MAXIMUM ]
const PATH_SECTORS_INFO = [ 'attributes', 'sectorsInfo' ]
const PRESET_COLORS = Object.values(colors.values)
const COLOR_PICKER_Z_INDEX = 2000

const WithRadiiAndAmplifiers = (Component) => class RadiiAndAmplifiersComponent extends CoordinatesMixin(Component) {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      radiiText: [],
      amplifiers: [],
    }
  }

  setRadiusSector = (index, radiusText) => {
    let isSet = false
    this.setResult((result) => {
      const radius = Number(radiusText)
      if (Number.isFinite(radius)) {
        const coordinatesArray = result.getIn(COORDINATE_PATH).toJS()
        const coord1 = coordinatesArray[0]
        if (Coord.check(coord1)) {
          const coord2 = L.CRS.Earth.calcPairDown(coord1, radius)
          isSet = (coord2.lat < coordinatesArray[index - 1].lat) &&
            ((index + 1 < coordinatesArray.length) ? (coord2.lat > coordinatesArray[index + 1].lat) : true)
          if (isSet) {
            return result.setIn([ ...COORDINATE_PATH, index ], coord2)
          }
        }
      }
      return result
    })
    return Boolean(isSet)
  }

  // обработка изменения радиуса
  radiusChangeHandler = (index) => (radiusText) => {
    if (radiusText.length < 7) {
      this.setRadiusSector(index, radiusText)
      const { radiiText } = this.state
      radiiText[index] = radiusText
      this.setState({ radiiText })
    }
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

  changeSectorsInfo = (info) => {
    this.setResult((result) => (
      result.updateIn([ ...PATH_SECTORS_INFO, info.index ], (value) => ({ ...value, [info.name]: info.value }))
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

  renderRadiiAndAmplifiers (maxRows) {
    const canEdit = this.isCanEdit()
    const formStore = this.getResult()
    const coordinatesArray = formStore.getIn(COORDINATE_PATH).toJS()
    const sectorsInfo = formStore.getIn(PATH_SECTORS_INFO).toJS()
    const coordO = coordinatesArray[0]
    const indexEnd = coordinatesArray.length - 1
    const presetColor = lineDefinitions[extractLineCode(this.props.data.code)]?.presetColor
    const { radiiText = [] } = this.state
    return (
      coordinatesArray.map((elm, index) => {
        if (index === 0) {
          return ''
        }
        const prevRadius = Math.round(distanceAzimuth(coordO, coordinatesArray[index]).distance)
        const radius = radiiText[index] ? radiiText[index] : prevRadius
        const radiusIsGood = prevRadius === radius
        const sectorInfo = sectorsInfo[index] ?? {}
        const amplifierT = sectorInfo?.amplifier || ''
        const color = sectorInfo?.color || (presetColor && presetColor[index]) || '#000000'
        const fill = sectorInfo?.fill || colors.TRANSPARENT
        return <>
          <div
            className={canEdit
              ? 'circularzone-container__itemWidth'
              : 'circularzone-container__itemWidth modals-input-disabled'
            }
            key={index}>
            <FormRow label={`${MARKER[index]} ${i18n.RADIUS.toLowerCase()}`}>
              <InputWithSuffix
                readOnly={!canEdit}
                value={radius}
                onChange={canEdit ? this.radiusChangeHandler(index) : null}
                onFocus={canEdit ? this.sectorFocusHandler(index) : null}
                onBlur={canEdit ? this.radiusBlurHandler(index) : null}
                suffix={i18n.ABBR_METERS}
                error={!radiusIsGood}
              />
            </FormRow>
            <div className='radiContainer radiContainerColor'>
              <div>{i18n.LINE_COLOR}</div>
              <ColorPicker
                color={color}
                disabled={!canEdit}
                onChange={this.sectorColorChangeHandler(index)}
                zIndex={COLOR_PICKER_Z_INDEX}
                presetColors={PRESET_COLORS}
              />
            </div>
            <div className='radiContainer'>
              <div>{i18n.FILLING}</div>
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
            </div>
          </div>
          <div className='amplifier'>
            <FormRow label={`${i18n.AMPLIFIER} «Т${index}»`}>
              {maxRows === 1
                ? <Input
                  className={!canEdit ? 'modals-input-disabled' : ''}
                  value={amplifierT}
                  name={'amplifier'}
                  readOnly={!canEdit}
                  onChange={this.sectorAmplifierChangeHandler(index)}
                  disabled={!canEdit}
                  onFocus={canEdit ? this.sectorFocusHandler(index) : null}
                  onBlur={canEdit ? this.amplifierBlurHandler(index) : null}
                  maxLength={MAX_LENGTH_TEXT.TEXTAREA}
                />
                : <Input.TextArea
                  value={amplifierT}
                  name={'amplifier'}
                  className={!canEdit ? 'modals-input-disabled' : ''}
                  onChange={this.sectorAmplifierChangeHandler(index)}
                  onFocus={canEdit ? this.sectorFocusHandler(index) : null}
                  onBlur={canEdit ? this.amplifierBlurHandler(index) : null}
                  disabled={!canEdit}
                  autoSize={ maxRows ? { minRows: 1, maxRows: maxRows } : undefined}
                  rows={2}
                  maxLength={MAX_LENGTH_TEXT.TEXTAREA}
                />
              }
            </FormRow>
          </div>
          { (index < indexEnd) && <FormDivider/> }
        </>
      })
    )
  }
}

export default WithRadiiAndAmplifiers
