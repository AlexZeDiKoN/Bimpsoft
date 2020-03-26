import React, { Fragment } from 'react'
import { components, utils } from '@DZVIN/CommonComponents'
import PropTypes from 'prop-types'
import i18n from '../../../i18n'
import { angleDegCheck, distanceAngle, sphereDirect } from '../../WebMap/patch/utils/sectors'
import placeSearch from '../../../server/places'
const COORDINATE_PATH = [ 'geometry' ]
const { Coordinates: Coord } = utils

const {
  FormRow,
  InputWithSuffix,
  Coordinates,
  FormItem,
} = components.form

// const { icons: { IconHovered, names: iconNames } } = components

const WithCoordinateAndAzimut = (Component) => class CoordinatesAndAzimutComponent extends Component {
  static propTypes = {
    onCoordinateFocusChange: PropTypes.func,
  }

  state = { azimutText: null }

  coordinateChangeHandler = async (index, value) => {
    await this.setResult((result) => result.setIn([ ...COORDINATE_PATH, index ], value))
    this.setState({ azimutText: null })
  }

  azimutFocusChange = (isActive, index) => () => {
    const { onCoordinateFocusChange } = this.props
    onCoordinateFocusChange && onCoordinateFocusChange(index, isActive)
  }

  azimutChangeHandler = (azimutText) => {
    const azimut = Number(azimutText)
    if (angleDegCheck(azimut)) {
      const formStore = this.getResult()
      const coordArray = formStore.getIn(COORDINATE_PATH)
      // console.log(JSON.stringify({ azimut, coord1: coordArray.get(0), coord2: coordArray.get(1) }))
      const calculatedAzimut = distanceAngle(coordArray.get(0), coordArray.get(1))
      if (azimut.toFixed(0) !== calculatedAzimut.angledeg.toFixed(0)) {
        const coord1 = coordArray.get(0)
        this.setState({ azimutText })
        if (Coord.check(coord1)) {
          const coord2 = sphereDirect(coord1, azimutText, calculatedAzimut.distance)
          if (Coord.check(coord2)) {
            this.coordinateChangeHandler(1, coord2)
          }
        }
      }
    }
    // this.setResult((result) => {
    //         result = result.updateIn(COORDINATE_PATH, (coordinates) => coordinates.set(1, coord2))
    //   return result
    // })
  }

  coordinateAzimutFocusChange (isActive, index) {
    const { onCoordinateFocusChange } = this.props
    onCoordinateFocusChange && onCoordinateFocusChange(index, isActive)
  }

  onCoordinateAzimutFocusHandler = this.coordinateAzimutFocusChange.bind(this, true, 0)

  onCoordinateAzimutBlurHandler = this.coordinateAzimutFocusChange.bind(this, false, 0)

  onCoordinateChangeHandler = this.coordinateChangeHandler.bind(this, 0)

  onAzimutFocusHandler = this.azimutFocusChange.bind(this, true)

  onAzimutBlurHandler = this.azimutFocusChange.bind(this, false)

  onAzimutChangeHandler = this.azimutChangeHandler.bind(this)

  renderCoordinateAndAzimut () {
    const { azimutText = null } = this.state
    const formStore = this.getResult()
    const coordinatesArray = formStore.getIn(COORDINATE_PATH).toJS()
    const coordBegin = coordinatesArray[0]
    const coordEnd = coordinatesArray[1]
    const azimut = azimutText !== null ? azimutText : distanceAngle(coordBegin, coordEnd).angledeg.toFixed(0)
    const azimutInd = 1
    const canEdit = this.isCanEdit()
    const azimutIsWrong = angleDegCheck(azimut)
    return (
      <FormRow label={i18n.COORDINATES}>
        {coordBegin
          ? <Fragment key={`${coordBegin.lat}/${coordBegin.lng}`}>
            <FormItem className="coordinatesModal">
              <Coordinates
                index = {0}
                isReadOnly={!canEdit}
                coordinates={coordBegin}
                onChange={null} // {this.changeHandler}
                onEnter={this.onCoordinateAzimutFocusHandler}
                onBlur={this.onCoordinateAzimutBlurHandler}
                onExitWithChange={canEdit ? this.onCoordinateChangeHandler : null }
                onSearch={placeSearch}
              />
            </FormItem>
            <FormRow label={i18n.AZIMUT}>
              <InputWithSuffix
                readOnly={!canEdit}
                value={azimut}
                onChange={canEdit ? this.onAzimutChangeHandler : null }
                onFocus={this.onAzimutFocusHandler(azimutInd)}
                onBlur={this.onAzimutBlurHandler(azimutInd)}
                suffix={i18n.ABBR_GRADUS}
                error={azimutIsWrong}
              />
            </FormRow>
          </Fragment> : 'нет'}
      </FormRow>
    )
  }
}

export default WithCoordinateAndAzimut
