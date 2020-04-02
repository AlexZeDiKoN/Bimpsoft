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

const WithCoordinateAndAzimuth = (Component) => class CoordinatesAndAzimuthComponent extends Component {
  static propTypes = {
    onCoordinateFocusChange: PropTypes.func,
  }

  state = { azimuthText: null }

  coordinateChangeHandler = async (index, value) => {
    await this.setResult((result) => result.setIn([ ...COORDINATE_PATH, index ], value))
    this.setState({ azimuthText: null })
  }

  // azimuthFocusChange = (isActive, index) => {
  //   const { onCoordinateFocusChange } = this.props
  //   onCoordinateFocusChange && onCoordinateFocusChange(index, isActive)
  // }

  azimuthChangeHandler (azimuthText) {
    const azimuth = Number(azimuthText)
    if (angleDegCheck(azimuth)) {
      const formStore = this.getResult()
      const coordArray = formStore.getIn(COORDINATE_PATH)
      // console.log(JSON.stringify({ azimuth, coord1: coordArray.get(0), coord2: coordArray.get(1) }))
      const calculatedazimuth = distanceAngle(coordArray.get(0), coordArray.get(1))
      if (azimuth.toFixed(0) !== calculatedazimuth.angledeg.toFixed(0)) {
        const coord1 = coordArray.get(0)
        this.setState({ azimuthText })
        if (Coord.check(coord1)) {
          const coord2 = sphereDirect(coord1, azimuthText, calculatedazimuth.distance)
          if (Coord.check(coord2)) {
            this.coordinateChangeHandler(1, coord2)
          }
        }
      }
    }
  }

  coordinateFocusChange (isActive, index) {
    const { onCoordinateFocusChange } = this.props
    onCoordinateFocusChange && onCoordinateFocusChange(index, isActive)
  }

  onCoordinateazimuthFocusHandler = this.coordinateFocusChange.bind(this, true, 0)

  onCoordinateazimuthBlurHandler = this.coordinateFocusChange.bind(this, false, 0)

  onCoordinateChangeHandler = this.coordinateChangeHandler.bind(this, 0)

  onAzimuthFocusHandler = this.coordinateFocusChange.bind(this, true, 1)

  onAzimuthBlurHandler = this.coordinateFocusChange.bind(this, false, 1)

  onAzimuthChangeHandler = this.azimuthChangeHandler.bind(this)

  renderCoordinateAndAzimuth () {
    const { azimuthText = null } = this.state
    const coordinatesArray = this.getResult().getIn(COORDINATE_PATH).toJS()
    const coordBegin = coordinatesArray[0]
    const coordEnd = coordinatesArray[1]
    const azimuth = azimuthText !== null ? azimuthText : distanceAngle(coordBegin, coordEnd).angledeg.toFixed(0)
    // const azimuthInd = 1
    const canEdit = this.isCanEdit()
    const azimuthIsWrong = angleDegCheck(azimuth)
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
                onEnter={this.onCoordinateazimuthFocusHandler}
                onBlur={this.onCoordinateazimuthBlurHandler}
                onExitWithChange={canEdit ? this.onCoordinateChangeHandler : null }
                onSearch={placeSearch}
              />
            </FormItem>
            <FormRow label={i18n.AZIMUT}>
              <InputWithSuffix
                readOnly={!canEdit}
                value={azimuth}
                onChange={canEdit ? this.onAzimuthChangeHandler : null }
                onFocus={this.onAzimuthFocusHandler}
                onBlur={this.onAzimuthBlurHandler}
                suffix={i18n.ABBR_GRADUS}
                error={azimuthIsWrong}
              />
            </FormRow>
          </Fragment> : 'нет'}
      </FormRow>
    )
  }
}

export default WithCoordinateAndAzimuth
