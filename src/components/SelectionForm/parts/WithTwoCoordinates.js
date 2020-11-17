import React from 'react'
import { components } from '@C4/CommonComponents'
import L from 'leaflet'
import i18n from '../../../i18n'
import CoordinateRow from './CoordinateRow'
import CoordinatesMixin, { COORDINATE_PATH } from './CoordinatesMixin'
import { figureArea } from './render'

const {
  FormDarkPart,
} = components.form

const WithTwoCoordinates = (Component) => class TwoCoordinatesComponent extends CoordinatesMixin(Component) {
  renderTwoCoordinates (lock) {
    const coordinatesArray = this.getResult().getIn(COORDINATE_PATH).toJS()

    const readOnly = !this.isCanEdit()

    const { coordinatesType } = this.props

    return (
      <FormDarkPart>
        <div className='coordinate-width-title'>{i18n.COORDINATES}</div>
        <div className="shape-form-scrollable">
          <CoordinateRow
            readOnly={readOnly}
            coordinate={coordinatesArray[0]}
            index={0}
            onExitWithChange={this.onCoordinateExitWithChangeHandler}
            onFocus={this.onCoordinateFocusHandler}
            onBlur={this.onCoordinateBlurHandler}
            coordinatesType={coordinatesType}
          />
          <CoordinateRow
            readOnly={readOnly}
            coordinate={coordinatesArray[1]}
            index={1}
            onExitWithChange={this.onCoordinateExitWithChangeHandler}
            onFocus={this.onCoordinateFocusHandler}
            onBlur={this.onCoordinateBlurHandler}
            coordinatesType={coordinatesType}
          />
        </div>
        {lock && figureArea(L.rectangle(coordinatesArray.map(({ lat, lng }) => [ lat, lng ])))}
      </FormDarkPart>
    )
  }
}

export default WithTwoCoordinates
