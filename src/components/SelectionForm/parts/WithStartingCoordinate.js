import React from 'react'
import { components, utils } from '@DZVIN/CommonComponents'
import L from 'leaflet'
import i18n from '../../../i18n'
import placeSearch from '../../../server/places'
import { distanceAngle } from '../../WebMap/patch/utils/sectors'
import CoordinatesMixin, { COORDINATE_PATH } from './CoordinatesMixin'

const {
  FormRow,
  Coordinates,
} = components.form

const { Coordinates: Coord } = utils

const WithStartingCoordinate = (Component) => class StartingCoordinateComponent extends CoordinatesMixin(Component) {
  startingCoordinateExitChangeHandler = async (value) => {
    if (!Coord.check(value)) {
      return
    }
    const coordArray = this.getResult().getIn(COORDINATE_PATH)
    const coordO = coordArray.get(0)
    const coordList = coordArray.map((elm) => {
      const radius = distanceAngle(coordO, elm).distance
      return L.CRS.Earth.calcPairRight(value, radius)
    })
    await this.setResult((result) => result.setIn(COORDINATE_PATH, coordList))
  }

  startingCoordinateChangeHandler = (value) => {
    // console.log(JSON.stringify(value))
  }

  renderStartingCoordinate () {
    const coord = this.getResult().getIn([ ...COORDINATE_PATH, 0 ])
    const beginCoordinate = { lat: coord.lat, lng: coord.lng }
    const canEdit = this.isCanEdit()
    return (
      <FormRow label={i18n.COORDINATES}>
        <Coordinates
          isReadOnly={!canEdit}
          coordinates={beginCoordinate}
          // onChange={this.startingCoordinateChangeHandler}
          onEnter={() => { this.onCoordinateFocusHandler(0) }}
          onBlur={() => { this.onCoordinateBlurHandler(0) }}
          onExitWithChange={canEdit ? this.startingCoordinateExitChangeHandler : null}
          onSearch={placeSearch}
        />
      </FormRow>
    )
  }
}

export default WithStartingCoordinate
