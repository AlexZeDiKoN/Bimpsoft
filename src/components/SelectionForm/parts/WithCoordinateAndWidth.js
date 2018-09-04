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

const WithCoordinateAndWidth = (Component) => class CoordinateAndWidthComponent extends CoordinatesMixin(Component) {
  constructor (props) {
    super(props)
    let coord1 = this.state.coordinatesArray.get(0)
    let width = 0
    if (coord1 && !coordinates.isWrong(coord1)) {
      let coord2 = this.state.coordinatesArray.get(1)
      if (coord2 && !coordinates.isWrong(coord2)) {
        const corner1 = L.latLng(coord1)
        const corner2 = L.latLng(coord2)
        const bounds = L.latLngBounds(corner1, corner2)
        const northWest = bounds.getNorthWest()
        const southEast = bounds.getSouthEast()
        coord1 = coordinates.roundCoordinate({ lat: northWest.lat, lng: northWest.lng })
        this.state.coordinatesArray = this.state.coordinatesArray.set(0, coord1)
        coord2 = coordinates.roundCoordinate({ lat: southEast.lat, lng: southEast.lng })
        width = northWest.distanceTo(bounds.getNorthEast())
        width = Math.round(width)
      } else {
        coord2 = coord1
      }
      this.state.coordinatesArray = this.state.coordinatesArray.set(1, coord2)
    }
    this.state.width = width
    this.state.widthText = String(width)
  }

  coordinateChangeHandler = (index, coordX) => {
    if (!coordX || coordinates.isWrong(coordX)) {
      this.setState((state) => ({
        coordinatesArray: state.coordinatesArray.set(index, coordX),
      }))
    } else if (index === 0) {
      const { width } = this.state
      const { lat, lng } = coordX
      const southEast = L.latLng({ lat, lng }).toBounds(width * 2).getSouthEast()
      const coord2 = coordinates.roundCoordinate({ lat: southEast.lat, lng: southEast.lng })
      const coordinatesArray = new List([ coordX, coord2 ])
      this.setState({ coordinatesArray })
    } else if (index === 1) {
      const coord1 = this.state.coordinatesArray.get(0)
      const coord2 = this.state.coordinatesArray.get(1)
      const isLatChanged = coord2 && !coordinates.isWrong(coord2) && coord2.lat !== coordX.lat
      const corner1 = L.latLng(coord1)
      const corner2 = L.latLng(coordX)
      const bounds = L.latLngBounds(corner1, corner2)
      const northWest = bounds.getNorthWest()
      let width = northWest.distanceTo(isLatChanged ? bounds.getSouthWest() : bounds.getNorthEast())
      width = Math.round(width)
      const coordinatesArray = this.state.coordinatesArray.set(1, coordX)
      if (isLatChanged) {
        this.isLatChanged = true
      } else {
        this.isLngChanged = true
      }
      this.setState({ coordinatesArray, width, widthText: String(width) })
    }
  }

  coordinate2BlurHandler = () => {
    if (this.isLatChanged && this.isLngChanged) {
      this.isLatChanged = false
      this.isLngChanged = false
      const { width, coordinatesArray } = this.state
      const coord1 = coordinatesArray.get(0)
      if (coord1 && !coordinates.isWrong(coord1)) {
        const { lat, lng } = coord1
        const southEast = L.latLng({ lat, lng }).toBounds(width * 2).getSouthEast()
        const coord2 = { lat: southEast.lat, lng: southEast.lng }
        this.setState({ coordinatesArray: coordinatesArray.set(1, coord2) })
      }
    }
  }

  widthChangeHandler = (widthText) => {
    const width = Number(widthText)
    const newState = { widthText }
    if (Number.isFinite(width)) {
      const coord1 = this.state.coordinatesArray.get(0)
      if (coord1 && !coordinates.isWrong(coord1)) {
        const { lat, lng } = coord1
        const southEast = L.latLng({ lat, lng }).toBounds(width * 2).getSouthEast()
        const coord2 = coordinates.roundCoordinate({ lat: southEast.lat, lng: southEast.lng })
        newState.coordinatesArray = this.state.coordinatesArray.set(1, coord2)
        newState.width = width
      }
    }
    this.setState(newState)
  }

  renderCoordinateAndWidth () {
    const {
      coordinatesArray,
      width,
      widthText,
    } = this.state

    const canEdit = this.isCanEdit()

    const widthIsWrong = !Number.isFinite(Number(width))

    return (
      <FormDarkPart>
        <FormRow label={i18n.COORDINATES}/>
        <div className="shape-form-scrollable">
          <CoordinateRow
            label={'Север-захід'}
            coordinate={coordinatesArray.get(0)}
            index={0}
            readOnly={!canEdit}
            onChange={canEdit ? this.coordinateChangeHandler : null }
          />
          <CoordinateRow
            label={'Юг-схід'}
            coordinate={coordinatesArray.get(1)}
            index={1}
            readOnly={!canEdit}
            onChange={canEdit ? this.coordinateChangeHandler : null }
            onBlur={this.coordinate2BlurHandler}
          />
          <FormRow label={i18n.SIDE_SIZE}>
            <InputWithSuffix
              readOnly={!canEdit}
              value={widthText}
              onChange={canEdit ? this.widthChangeHandler : null }
              suffix={i18n.UNITS_OF_MEASURE_M}
              isWrong={widthIsWrong}
            />
          </FormRow>
        </div>
      </FormDarkPart>
    )
  }
}

export default WithCoordinateAndWidth
