import React, { Fragment } from 'react'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import CoordinateItem from './CoordinateItem'
import CoordinatesMixin, { COORDINATE_PATH } from './CoordinatesMixin'

const {
  FormRow,
  FormDivider,
  FormDarkPart,
} = components.form

const { icons: { IconHovered, names: iconNames } } = components

const WithCoordinates = (Component) => class CoordinatesComponent extends CoordinatesMixin(Component) {
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

  renderCoordinates () {
    const { editCoordinates } = this.state
    const formStore = this.getResult()
    const coordinatesArray = formStore.getIn(COORDINATE_PATH).toJS()
    const canEdit = this.isCanEdit()
    return (
      <FormDarkPart>
        <FormRow label={i18n.NODAL_POINTS}>
          {canEdit && (<IconHovered
            icon={editCoordinates ? iconNames.BAR_2_EDIT_ACTIVE : iconNames.BAR_2_EDIT_DEFAULT}
            hoverIcon={iconNames.BAR_2_EDIT_HOVER}
            onClick={this.coordinatesEditClickHandler}
          />)}
        </FormRow>
        <FormDivider/>
        <div className="shape-form-scrollable">
          <table>
            <tbody>
              <tr>
                <th>
                  <FormRow label={i18n.COORDINATES}>
                    {canEdit && editCoordinates && <IconHovered
                      icon={iconNames.MAP_SCALE_PLUS_DEFAULT}
                      hoverIcon={iconNames.MAP_SCALE_PLUS_HOVER}
                      onClick={this.coordinateAddHandler}
                    />}
                  </FormRow>
                </th>
              </tr>
              {coordinatesArray.map((coordinate, index) => (
                <Fragment key={`${coordinate.lat}/${coordinate.lng}`}>
                  <tr>
                    <td>
                      <CoordinateItem
                        key={index}
                        coordinate={coordinate}
                        index={index}
                        readOnly={!canEdit || !editCoordinates}
                        canRemove={coordinatesArray.size > 2}
                        onExitWithChange={canEdit ? this.onCoordinateExitWithChangeHandler : null}
                        onRemove={this.coordinateRemoveHandler}
                        onFocus={this.onCoordinateFocusHandler}
                        onBlur={this.onCoordinateBlurHandler}
                      />
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </FormDarkPart>
    )
  }
}

export default WithCoordinates