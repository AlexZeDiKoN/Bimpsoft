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
  const coord1 = coordinatesArray.get(0)
  let width = 0
  if (Coord.check(coord1)) {
    const coord2 = coordinatesArray.get(1)
    if (Coord.check(coord2)) {
      const corner1 = L.latLng(coord1)
      const corner2 = L.latLng(coord2)
      const bounds = L.latLngBounds(corner1, corner2)
      const northWest = bounds.getNorthWest()
      width = northWest.distanceTo(bounds.getNorthEast())
      width = Math.round(width)
    }
  }
  return width
}

const WithCoordinateAndWidth = (Component) => class CoordinateAndWidthComponent extends CoordinatesMixin(Component) {
  state = { widthText: null }

  coordinateChangeHandler = (index, newCoord) => {
    this.setState({ widthText: null })
    this.setResult((result) => result.setIn([ ...COORDINATE_PATH, index ], newCoord))
  }

  onCoordinateBlurHandler = (index) => {
    this.coordinateFocusChange(index, false)
    this.setResult((result) => {
      const coordinatesArray = result.getIn(COORDINATE_PATH)
      const coord1 = coordinatesArray.get(0)
      const coord2 = coordinatesArray.get(1)
      if (Coord.check(coord1) && Coord.check(coord2)) {
        const bounds = L.latLngBounds(coord1, coord2)
        const northWest = bounds.getNorthWest()
        const southEast = bounds.getSouthEast()
        return result.updateIn(COORDINATE_PATH, (coordinates) => coordinates.set(0, northWest).set(1, southEast))
      }
    })
  }

  widthChangeHandler = (widthText) => {
    this.setResult((result) => {
      const width = Number(widthText)
      if (Number.isFinite(width)) {
        const coordinatesArray = result.getIn(COORDINATE_PATH)
        const coord1 = coordinatesArray.get(0)
        if (Coord.check(coord1)) {
          const { lat, lng } = coord1
          const southEast = L.latLng({ lat, lng }).toBounds(width * 2).getSouthEast()
          const coord2 = Coord.round({ lat: southEast.lat, lng: southEast.lng })
          result = result.updateIn(COORDINATE_PATH, (coordinates) => coordinates.set(1, coord2))
        }
      }
      return result
    })
    this.setState({ widthText })
  }

  widthBlurHandler = () => this.setState({ widthText: null })

  renderCoordinateAndWidth () {
    const coordinatesArray = this.getResult().getIn(COORDINATE_PATH)
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
            coordinate={coordinatesArray.get(0)}
            index={0}
            readOnly={!canEdit}
            onChange={canEdit ? this.coordinateChangeHandler : null }
            onBlur={this.onCoordinateBlurHandler}
            onFocus={this.onCoordinateFocusHandler}
          />
          <CoordinateRow
            label={i18n.SOUTH_EAST}
            coordinate={coordinatesArray.get(1)}
            index={1}
            readOnly={!canEdit}
            onChange={canEdit ? this.coordinateChangeHandler : null }
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
