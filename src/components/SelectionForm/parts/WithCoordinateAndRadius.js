import L from 'leaflet'
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

function getRadiusFromCoordinatesArray (coordinatesArray) {
  const coord1 = coordinatesArray[0]
  let radius = 0
  if (Coord.check(coord1)) {
    const coord2 = coordinatesArray[1]
    if (Coord.check(coord2)) {
      const corner1 = L.latLng(coord1)
      const corner2 = L.latLng(coord2)
      radius = Math.round(corner1.distanceTo(corner2))
    }
  }
  return radius
}

const WithCoordinateAndRadius = (Component) => class CoordinateAndRadiusComponent extends CoordinatesMixin(Component) {
  state = { radiusText: null }

  coordinateChangeHandler = async (index, value) => {
    await this.onCoordinateExitWithChangeHandler(index, value)
    this.setState({ radiusText: null })
  }

  radiusChangeHandler = (radiusText) => {
    this.setResult((result) => {
      const radius = Number(radiusText)
      if (Number.isFinite(radius)) {
        const coordinatesArray = result.getIn(COORDINATE_PATH)
        const coord1 = coordinatesArray.get(0)
        if (Coord.check(coord1)) {
          const coord2 = L.CRS.Earth.calcPairRight(coord1, radius)
          result = result.updateIn(COORDINATE_PATH, (coordinates) => coordinates.set(1, coord2))
        }
      }
      return result
    })
    this.setState({ radiusText })
  }

  radiusBlurHandler = () => this.setState({ radiusText: null })

  renderCoordinateAndRadius () {
    const coordinatesArray = this.getResult().getIn(COORDINATE_PATH).toJS()
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
            coordinate={coordinatesArray[0]}
            index={0}
            readOnly={!canEdit}
            onExitWithChange={canEdit ? this.coordinateChangeHandler : null}
            onBlur={this.onCoordinateBlurHandler}
            onFocus={this.onCoordinateFocusHandler}
          />
          <CoordinateRow
            label={i18n.BOUND}
            coordinate={coordinatesArray[1]}
            index={1}
            readOnly={!canEdit}
            onExitWithChange={canEdit ? this.coordinateChangeHandler : null}
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
              error={radiusIsWrong}
            />
          </FormRow>
        </div>
      </FormDarkPart>
    )
  }
}

export default WithCoordinateAndRadius
