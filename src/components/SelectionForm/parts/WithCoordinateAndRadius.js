/* global L */
import React from 'react'
import { components } from '@DZVIN/CommonComponents'
import { List } from 'immutable'
import i18n from '../../../i18n'
import coordinates from '../../../utils/coordinates'
import CoordinateRow from './CoordinateRow'
import CoordinatesMixin from './CoordinatesMixin'

const {
  FormRow,
  FormDarkPart,
  InputWithSuffix,
} = components.form

const WithCoordinateAndRadius = (Component) => class CoordinateAndRadiusComponent extends CoordinatesMixin(Component) {
  constructor (props) {
    super(props)
    const coord1 = this.state.coordinatesArray.get(0)
    let radius = 0
    if (coord1 && !coordinates.isWrong(coord1)) {
      const coord2 = this.state.coordinatesArray.get(1)
      if (coord2 && !coordinates.isWrong(coord2)) {
        const corner1 = L.latLng(coord1)
        const corner2 = L.latLng(coord2)
        radius = Math.round(corner1.distanceTo(corner2))
      } else {
        this.state.coordinatesArray = this.state.coordinatesArray.set(1, coordinates.roundCoordinate(coord1))
      }
    }
    this.state.radius = radius
    this.state.radiusText = String(radius)
  }

  coordinateChangeHandler = (index, coordX) => this.setState((state) => {
    if (!coordX || coordinates.isWrong(coordX)) {
      return {
        coordinatesArray: state.coordinatesArray.set(index, coordX),
      }
    } else if (index === 0) {
      const { radius } = state
      const { lat, lng } = coordX
      const eastLng = L.latLng({ lat, lng }).toBounds(radius * 2).getEast()
      const coord2 = coordinates.roundCoordinate({ lat, lng: eastLng })
      const coordinatesArray = new List([ coordX, coord2 ])
      return { coordinatesArray }
    } else if (index === 1) {
      const coord1 = state.coordinatesArray.get(0)
      const corner1 = L.latLng(coord1)
      const corner2 = L.latLng(coordX)
      const radius = Math.round(corner1.distanceTo(corner2))
      const coordinatesArray = state.coordinatesArray.set(1, coordX)
      return { coordinatesArray, radius, radiusText: String(radius) }
    }
  })

  radiusChangeHandler = (radiusText) => this.setState((state) => {
    const radius = Number(radiusText)
    const newState = { radiusText }
    if (Number.isFinite(radius)) {
      const coord1 = state.coordinatesArray.get(0)
      if (coord1 && !coordinates.isWrong(coord1)) {
        const { lat, lng } = coord1
        const eastLng = L.latLng({ lat, lng }).toBounds(radius * 2).getEast()
        const coord2 = coordinates.roundCoordinate({ lat, lng: eastLng })
        newState.coordinatesArray = state.coordinatesArray.set(1, coord2)
        newState.radius = radius
      }
    }
    return newState
  })

  renderCoordinateAndRadius () {
    const {
      coordinatesArray,
      radius,
      radiusText,
    } = this.state

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
          />
          <CoordinateRow
            label={i18n.BOUND}
            coordinate={coordinatesArray.get(1)}
            index={1}
            readOnly={!canEdit}
            onChange={canEdit ? this.coordinateChangeHandler : null }
          />
          <FormRow label={i18n.RADIUS}>
            <InputWithSuffix
              readOnly={!canEdit}
              value={radiusText}
              onChange={canEdit ? this.radiusChangeHandler : null }
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
