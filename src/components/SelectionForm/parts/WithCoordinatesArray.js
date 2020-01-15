import React, { Fragment } from 'react'
import { components } from '@DZVIN/CommonComponents'
import { Checkbox } from 'antd'
import i18n from '../../../i18n'
import CoordinateItem from './CoordinateItem'
import CoordinatesMixin, { COORDINATE_PATH } from './CoordinatesMixin'
import { renderNodes } from './render'
import {
  NODAL_POINT_TYPE_PATH,
  NODAL_POINT_TYPES,
} from './WithNodalPointType'
import {
  NAME_OF_AMPLIFIERS,
} from './WithIntermediateAmplifiers'

const {
  FormRow,
  FormDivider,
  FormDarkPart,
} = components.form

const { icons: { IconHovered, names: iconNames } } = components

const SHOWN_INTERMEDIATE_AMPLIFIERS_PATH = [ 'attributes', 'shownIntermediateAmplifiers' ]
const SHOWN_NODAL_POINT_AMPLIFIERS_PATH = [ 'attributes', 'shownNodalPointAmplifiers' ]

const WithCoordinatesArray = (Component) => class CoordinatesArrayComponent extends CoordinatesMixin(Component) {
  state = { editCoordinates: false }

  createAmplifierShowerHandler = (path, index) => () => this.setResult((result) =>
    result.updateIn(path, (showedSet) =>
      showedSet.has(index) ? showedSet.delete(index) : showedSet.add(index),
    ),
  )

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

    const shownIntermediateAmplifiersSet = formStore.getIn(SHOWN_INTERMEDIATE_AMPLIFIERS_PATH)
    const shownNodalPointAmplifiersSet = formStore.getIn(SHOWN_NODAL_POINT_AMPLIFIERS_PATH)

    const coordinatesArray = formStore.getIn(COORDINATE_PATH).toJS()
    const nodalPointType = formStore.getIn(NODAL_POINT_TYPE_PATH)
    const canEdit = this.isCanEdit()
    const nodalPointTypePreview = renderNodes(nodalPointType)
    const coordinatesLength = coordinatesArray.length
    const noNodalPointAmplifier = nodalPointType === NODAL_POINT_TYPES.none.value
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
                <Fragment key={`${coordinate.lat}/${coordinate.lng}`}>
                  <tr>
                    <td>
                      <div className="icon-option">
                        <Checkbox
                          disabled={!canEdit || noNodalPointAmplifier}
                          checked={noNodalPointAmplifier || shownNodalPointAmplifiersSet.has(index)}
                          onChange={this.createAmplifierShowerHandler(SHOWN_NODAL_POINT_AMPLIFIERS_PATH, index)}
                        />
                        {nodalPointTypePreview}
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
                      <td><Checkbox
                        disabled={!canEdit}
                        onChange={this.createAmplifierShowerHandler(SHOWN_INTERMEDIATE_AMPLIFIERS_PATH, index)}
                        checked={shownIntermediateAmplifiersSet.has(index)}
                      /> &laquo;{NAME_OF_AMPLIFIERS}&raquo;</td>
                    </tr>
                  ) : null}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </FormDarkPart>
    )
  }
}

export default WithCoordinatesArray
