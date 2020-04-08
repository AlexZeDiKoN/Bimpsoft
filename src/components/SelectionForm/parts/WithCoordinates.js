import React, { Fragment } from 'react'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import lineDefinitions from '../../WebMap/patch/Sophisticated/lineDefinitions'
import { extractLineCode } from '../../WebMap/patch/Sophisticated/utils'
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

  coordinateAddHandler = (index) => {
    const formStore = this.getResult()
    const coordArray = formStore.getIn(COORDINATE_PATH).toJS()
    if (index + 1 < coordArray.length) { // вставка между опорными точками
      const coordNew = {
        lat: (coordArray[index + 1].lat + coordArray[index].lat) / 2,
        lng: (coordArray[index + 1].lng + coordArray[index].lng) / 2,
      }
      this.setResult((result) =>
        result.updateIn(COORDINATE_PATH, (coordinatesArray) => coordinatesArray.insert(index + 1, coordNew)))
    }
    // console.log('add', index)
    // this.setResult((result) =>
    //   result.updateIn(COORDINATE_PATH, (coordinatesArray) => coordinatesArray.push({ text: '' })),
    // )
  }

  renderCoordinates () {
    const { editCoordinates } = this.state
    const formStore = this.getResult()
    const coordinatesArray = formStore.getIn(COORDINATE_PATH).toJS()
    const canEdit = this.isCanEdit()
    const canEditCoord = canEdit && editCoordinates
    const codeLine = extractLineCode(this.props.data.code)
    const allowDelete = lineDefinitions[codeLine]?.allowDelete
    const allowMiddle = lineDefinitions[codeLine]?.allowMiddle
    const countCoordinates = coordinatesArray.length
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
                  </FormRow>
                </th>
              </tr>
              {coordinatesArray.map((coordinate, index) => {
                const canRemove = allowDelete ? allowDelete(index, countCoordinates) : countCoordinates > 2
                const canAdd = canEditCoord && (allowMiddle ? allowMiddle(index, index + 1, countCoordinates) : false)
                return (
                  <Fragment key={`${coordinate.lat}/${coordinate.lng}`}>
                    <tr>
                      <td>
                        <CoordinateItem
                          key={index}
                          coordinate={coordinate}
                          index={index}
                          readOnly={!canEditCoord}
                          canRemove={canRemove && canEditCoord }
                          onExitWithChange={canEdit ? this.onCoordinateExitWithChangeHandler : null}
                          onRemove={this.coordinateRemoveHandler}
                          onFocus={this.onCoordinateFocusHandler}
                          onBlur={this.onCoordinateBlurHandler}
                        />
                      </td>
                      <td>
                        {canAdd && <IconHovered
                          icon={iconNames.MAP_SCALE_PLUS_DEFAULT}
                          hoverIcon={iconNames.MAP_SCALE_PLUS_HOVER}
                          onClick={() => this.coordinateAddHandler(index)}
                        />}
                      </td>
                    </tr>
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </FormDarkPart>
    )
  }
}

export default WithCoordinates
