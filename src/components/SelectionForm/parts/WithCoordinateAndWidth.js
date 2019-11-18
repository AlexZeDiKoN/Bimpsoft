/* global L */
import React from 'react'
import { components, utils } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import CoordinateRow from './CoordinateRow'
import CoordinatesMixin, { COORDINATE_PATH } from './CoordinatesMixin'

const {
  FormRow,
  FormDarkPart,
  InputWithSuffix,
} = components.form
const { Coordinates: Coord } = utils

function getWidthFromCoordinatesArray (coordinatesArray) {
  const coord1 = coordinatesArray[0]
  let width = 0
  if (Coord.check(coord1)) {
    const coord2 = coordinatesArray[1]
    if (Coord.check(coord2)) {
      const corner1 = L.latLng(coord1)
      const corner2 = L.latLng({ lng: coord2.lng, lat: coord1.lat })
      width = Math.round(corner1.distanceTo(corner2))
    }
  }
  return width
}

const WithCoordinateAndWidth = (Component) => class CoordinateAndWidthComponent extends CoordinatesMixin(Component) {
  state = { widthText: null }

  coordinateChangeHandler = async (index, value) => {
    await this.onCoordinateExitWithChangeHandler(index, value)
    this.setState({ widthText: null })
  }

  widthChangeHandler = (widthText) => {
    this.setResult((result) => {
      const width = Number(widthText)
      if (Number.isFinite(width)) {
        const coordinatesArray = result.getIn(COORDINATE_PATH)
        const calculatedWidth = getWidthFromCoordinatesArray(coordinatesArray)
        if (widthText !== calculatedWidth) {
          const coord1 = coordinatesArray.get(0)
          if (Coord.check(coord1)) {
            const coord2 = L.CRS.Earth.calcPairRightDown(coord1, width)
            result = result.updateIn(COORDINATE_PATH, (coordinates) => coordinates.set(1, coord2))
          }
          this.setState({ widthText })
        }
      }
      return result
    })
  }

  widthBlurHandler = () => this.setState({ widthText: null })

  renderCoordinateAndWidth () {
    const coordinatesArray = this.getResult().getIn(COORDINATE_PATH).toJS()
    const { widthText = null } = this.state

    const width = widthText !== null ? widthText : getWidthFromCoordinatesArray(coordinatesArray)

    const canEdit = this.isCanEdit()

    const widthIsWrong = !Number.isFinite(Number(width))

    return (
      <FormDarkPart>
        <FormRow label={i18n.COORDINATES}/>
        <div className="shape-form-scrollable">
          <CoordinateRow
            label={i18n.NORTH_WEST}
            coordinate={coordinatesArray[0]}
            index={0}
            readOnly={!canEdit}
            onExitWithChange={canEdit ? this.coordinateChangeHandler : null}
            onBlur={this.onCoordinateBlurHandler}
            onFocus={this.onCoordinateFocusHandler}
          />
          <CoordinateRow
            label={i18n.SOUTH_EAST}
            coordinate={coordinatesArray[1]}
            index={1}
            readOnly={!canEdit}
            onExitWithChange={canEdit ? this.coordinateChangeHandler : null}
            onBlur={this.onCoordinateBlurHandler}
            onFocus={this.onCoordinateFocusHandler}
          />
          <FormRow label={i18n.SIDE_SIZE}>
            <InputWithSuffix
              readOnly={!canEdit}
              value={width}
              onChange={canEdit ? this.widthChangeHandler : null }
              suffix={i18n.ABBR_METERS}
              error={widthIsWrong}
              onBlur={this.widthBlurHandler}
            />
          </FormRow>
        </div>
      </FormDarkPart>
    )
  }
}

export default WithCoordinateAndWidth
