import React from 'react'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import CoordinateRow from './CoordinateRow'
import CoordinatesMixin, { COORDINATE_PATH } from './CoordinatesMixin'

const {
  FormRow,
  FormDarkPart,
} = components.form

const WithTwoCoordinates = (Component) => class TwoCoordinatesComponent extends CoordinatesMixin(Component) {
  renderTwoCoordinates () {
    const coordinatesArray = this.getResult().getIn(COORDINATE_PATH)

    const readOnly = !this.isCanEdit()

    return (
      <FormDarkPart>
        <FormRow label={i18n.COORDINATES}/>
        <div className="shape-form-scrollable">
          <CoordinateRow
            readOnly={readOnly}
            coordinate={coordinatesArray.get(0)}
            index={0}
            onExitWithChange={this.onCoordinateExitWithChangeHandler}
            onFocus={this.onCoordinateFocusHandler}
            onBlur={this.onCoordinateBlurHandler}
          />
          <CoordinateRow
            readOnly={readOnly}
            coordinate={coordinatesArray.get(1)}
            index={1}
            onExitWithChange={this.onCoordinateExitWithChangeHandler}
            onFocus={this.onCoordinateFocusHandler}
            onBlur={this.onCoordinateBlurHandler}
          />
        </div>
      </FormDarkPart>
    )
  }
}

export default WithTwoCoordinates
