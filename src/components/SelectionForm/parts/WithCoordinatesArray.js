import React from 'react'
import { components } from '@DZVIN/CommonComponents'
import { Checkbox } from 'antd'
import i18n from '../../../i18n'
import CoordinateItem from './CoordinateItem'
import CoordinatesMixin, { COORDINATE_PATH } from './CoordinatesMixin'
import { renderStyledLine } from './render'
import {
  SUBORDINATION_LEVEL_PATH,
} from './WithSubordinationLevel'
import {
  INTERMEDIATE_AMPLIFIER_TYPES,
  INTERMEDIATE_AMPLIFIER_TYPE_PATH,
  NAME_OF_AMPLIFIERS,
} from './WithIntermediateAmplifiers'

const {
  FormRow,
  FormDivider,
  FormDarkPart,
} = components.form

const { icons: { IconHovered, names: iconNames } } = components

const WithCoordinatesArray = (Component) => class CoordinatesArrayComponent extends CoordinatesMixin(Component) {
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

  renderCoordinatesArray () {
    const { editCoordinates } = this.state
    const formStore = this.getResult()
    const coordinatesArray = formStore.getIn(COORDINATE_PATH).toJS()
    const subordinationLevel = formStore.getIn(SUBORDINATION_LEVEL_PATH)
    const currentAmplifierType = formStore.getIn(INTERMEDIATE_AMPLIFIER_TYPE_PATH)
    const canEdit = this.isCanEdit()
    const level = currentAmplifierType === INTERMEDIATE_AMPLIFIER_TYPES.LEVEL ? subordinationLevel : null
    const amplifierTypePreview = renderStyledLine('solid', level)
    const coordinatesLength = coordinatesArray.length
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
            <tr>
              <th>
                <FormRow label={i18n.AMPLIFIERS}/>
              </th>
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
              <>
                <tr>
                  <td>
                    <div className="icon-option">
                      <Checkbox disabled={!canEdit}/>
                      {amplifierTypePreview}
                    </div>
                  </td>
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
                {index !== coordinatesLength - 1 ? (
                  <tr>
                    <td><Checkbox disabled={!canEdit}/> &laquo;{NAME_OF_AMPLIFIERS}&raquo;</td>
                  </tr>
                ) : null}
              </>
            ))}
          </table>
        </div>
      </FormDarkPart>
    )
  }
}

export default WithCoordinatesArray
