import React, { Fragment } from 'react'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import CoordinateItem from './CoordinateItem'
import CoordinatesMixin, { COORDINATE_PATH } from './CoordinatesMixin'

const {
  FormRow,
  // FormDivider,
  // FormDarkPart,
} = components.form

// const { icons: { IconHovered, names: iconNames } } = components

const WithCoordinateBegin = (Component) => class CoordinatesComponent extends CoordinatesMixin(Component) {
  state = { editCoordinates: false }

  coordinateRemoveHandler = (index) => this.setResult((result) =>
    result.updateIn(COORDINATE_PATH, (coordinatesArray) =>
      coordinatesArray.size <= 2 ? coordinatesArray : coordinatesArray.delete(index),
    ),
  )

  coordinatesEditClickHandler = () => this.setState((state) => ({
    editCoordinates: !state.editCoordinates,
  }))

  coordinateAddHandler = () => this.setResult((result) =>
    result.updateIn(COORDINATE_PATH, (coordinatesArray) => coordinatesArray.push({ text: '' })),
  )

  renderCoordinateBegin () {
    const { editCoordinates } = this.state
    const formStore = this.getResult()
    const coordinatesArray = formStore.getIn(COORDINATE_PATH).toJS()
    const coordinateBegin = coordinatesArray[0]
    const canEdit = this.isCanEdit()
    return (
      <FormRow label={i18n.COORDINATES}>
        {coordinateBegin
          ? <Fragment key={`${coordinateBegin.lat}/${coordinateBegin.lng}`}>
            <CoordinateItem
              key={0}
              coordinate={coordinateBegin}
              index={0}
              readOnly={!canEdit || !editCoordinates}
              canRemove={false}
              onExitWithChange={canEdit ? this.onCoordinateExitWithChangeHandler : null}
              onRemove={this.coordinateRemoveHandler}
              onFocus={this.onCoordinateFocusHandler}
              onBlur={this.onCoordinateBlurHandler}
            />
          </Fragment> : 'нет'}
      </FormRow>
    )
  }
}

export default WithCoordinateBegin
