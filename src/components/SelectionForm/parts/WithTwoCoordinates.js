import React from 'react'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import CoordinateRow from './CoordinateRow'
import CoordinatesMixin from './CoordinatesMixin'

const {
  FormRow,
  FormDarkPart,
} = components.form

const WithTwoCoordinates = (Component) => class TwoCoordinatesComponent extends CoordinatesMixin(Component) {
  renderTwoCoordinates () {
    const {
      coordinatesArray,
    } = this.state

    const readOnly = !this.isCanEdit()

    return (
      <FormDarkPart>
        <FormRow label={i18n.COORDINATES}/>
        <div className="shape-form-scrollable">
          <CoordinateRow
            readOnly={readOnly}
            coordinate={coordinatesArray.get(0)}
            index={0}
            onChange={this.coordinateChangeHandler}
          />
          <CoordinateRow
            readOnly={readOnly}
            coordinate={coordinatesArray.get(1)}
            index={1}
            onChange={this.coordinateChangeHandler}
          />
        </div>
      </FormDarkPart>
    )
  }
}

export default WithTwoCoordinates
