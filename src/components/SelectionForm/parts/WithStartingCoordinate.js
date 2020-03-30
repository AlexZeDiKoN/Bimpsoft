import React from 'react'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import placeSearch from '../../../server/places'
import CoordinatesMixin, { COORDINATE_PATH } from './CoordinatesMixin'

const {
  FormRow,
  Coordinates,
} = components.form

const WithStartingCoordinate = (Component) => class StartingCoordinateComponent extends CoordinatesMixin(Component) {
  firstCoordinateExitChangeHandler = async (value) => {
    await this.onFirstCoordinateExitChangeHandler(value)
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
          onExitWithChange={canEdit ? this.firstCoordinateExitChangeHandler : null}
          onSearch={placeSearch}
        />
      </FormRow>
    )
  }
}

export default WithStartingCoordinate
