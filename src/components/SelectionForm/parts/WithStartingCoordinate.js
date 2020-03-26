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
  startingCoordinateExitChangeHandler = async (value) => {
    await this.onCoordinateExitWithChangeHandler(0, value)
    // TODO нужно изменить все координаты
  }

  startingCoordinateChangeHandler = (value) => {
    // console.log(JSON.stringify(value))
  }

  renderStartingCoordinate () {
    const beginCoordinate = this.getResult().getIn([ ...COORDINATE_PATH, 0 ]).toJS()
    const canEdit = this.isCanEdit()
    return (
      <FormRow label={i18n.COORDINATES}>
        <Coordinates
          isReadOnly={!canEdit}
          coordinates={beginCoordinate}
          onChange={this.startingCoordinateChangeHandler}
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
