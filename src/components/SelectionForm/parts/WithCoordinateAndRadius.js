/* global L */
import React from 'react'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import coordinates from '../../../utils/coordinates'
import CoordinateRow from './CoordinateRow'
import CoordinatesMixin, { COORDINATE_PATH } from './CoordinatesMixin'

const {
  FormRow,
  FormDarkPart,
  InputWithSuffix,
} = components.form

function getRadiusFromCoordinatesArray (coordinatesArray) {
  const coord1 = coordinatesArray.get(0)
  let radius = 0
  if (coord1 && !coordinates.isWrong(coord1)) {
    const coord2 = coordinatesArray.get(1)
    if (coord2 && !coordinates.isWrong(coord2)) {
      const corner1 = L.latLng(coord1)
      const corner2 = L.latLng(coord2)
      radius = Math.round(corner1.distanceTo(corner2))
    }
  }
  return radius
}

const WithCoordinateAndRadius = (Component) => class CoordinateAndRadiusComponent extends CoordinatesMixin(Component) {
  state = { radiusText: null }

  coordinateChangeHandler = (index, newCoord) => {
    this.setState({ radiusText: null })
    this.setResult((result) => result.setIn([ ...COORDINATE_PATH, index ], newCoord))
  }

  radiusChangeHandler = (radiusText) => {
    this.setResult((result) => {
      const radius = Number(radiusText)
      if (Number.isFinite(radius)) {
        const coordinatesArray = result.getIn(COORDINATE_PATH)
        const coord1 = coordinatesArray.get(0)
        if (coord1 && !coordinates.isWrong(coord1)) {
          const { lat, lng } = coord1
          const eastLng = L.latLng({ lat, lng }).toBounds(radius * 2).getEast()
          const coord2 = coordinates.roundCoordinate({ lat, lng: eastLng })
          result = result.updateIn(COORDINATE_PATH, (coordinates) => coordinates.set(1, coord2))
        }
      }
      return result
    })
    this.setState({ radiusText })
  }

  radiusBlurHandler = () => this.setState({ radiusText: null })

  renderCoordinateAndRadius () {
    const coordinatesArray = this.getResult().getIn(COORDINATE_PATH)
    const { radiusText = null } = this.state

    const radius = radiusText !== null ? radiusText : getRadiusFromCoordinatesArray(coordinatesArray)

    const canEdit = this.isCanEdit()

    const radiusIsWrong = !Number.isFinite(Number(radius))

    return (
      <FormDarkPart>
        <FormRow label={i18n.COORDINATES}/>
        <div className="shape-form-scrollable">
          <CoordinateRow
            label={i18n.CENTER}
            coordinate={coordinatesArray.get(0)}
            index={0}
            readOnly={!canEdit}
            onChange={canEdit ? this.coordinateChangeHandler : null }
            onBlur={this.onCoordinateBlurHandler}
            onFocus={this.onCoordinateFocusHandler}
          />
          <CoordinateRow
            label={i18n.BOUND}
            coordinate={coordinatesArray.get(1)}
            index={1}
            readOnly={!canEdit}
            onChange={canEdit ? this.coordinateChangeHandler : null }
            onBlur={this.onCoordinateBlurHandler}
            onFocus={this.onCoordinateFocusHandler}
          />
          <FormRow label={i18n.RADIUS}>
            <InputWithSuffix
              readOnly={!canEdit}
              value={radius}
              onChange={canEdit ? this.radiusChangeHandler : null }
              onBlur={canEdit ? this.radiusBlurHandler : null}
              suffix={i18n.ABBR_METERS}
              isWrong={radiusIsWrong}
            />
          </FormRow>
        </div>
      </FormDarkPart>
    )
  }
}

export default WithCoordinateAndRadius
