import React, { Fragment } from 'react'
import { components, utils } from '@DZVIN/CommonComponents'
import PropTypes from 'prop-types'
import i18n from '../../../i18n'
import { angleDegCheck, distanceAngle, sphereDirect } from '../../WebMap/patch/utils/sectors'
import CoordinateItem from './CoordinateItem'
import CoordinatesMixin, { COORDINATE_PATH } from './CoordinatesMixin'
const { Coordinates: Coord } = utils

const {
  FormRow,
  InputWithSuffix,
} = components.form

// const { icons: { IconHovered, names: iconNames } } = components

const WithCoordinateAndAzimut = (Component) => class CoordinatesAndAzimutComponent extends CoordinatesMixin(Component) {
  static propTypes = {
    onCoordinateFocusChange: PropTypes.func,
    onCoordinateExitWithChangeHandler: PropTypes.func,
  }

  state = { editCoordinates: false, azimutText: null }

  coordinateChangeHandler = async (index, value) => {
    await this.onCoordinateExitWithChangeHandler(index, value)
    this.setState({ azimutText: null })
  }

  coordinateRemoveHandler = (index) => this.setResult((result) =>
    result.updateIn(COORDINATE_PATH, (coordinatesArray) =>
      coordinatesArray.size <= 2 ? coordinatesArray : coordinatesArray.delete(index),
    ),
  )

  azimutFocusChange (isActive, index) {
    const { onCoordinateFocusChange } = this.props
    onCoordinateFocusChange && onCoordinateFocusChange(index, isActive)
  }

  // coordinateAddHandler = () => this.setResult((result) =>
  //   result.updateIn(COORDINATE_PATH, (coordinatesArray) => coordinatesArray.push({ text: '' })),
  // )
  azimutChangeHandler = (azimutText) => {
    const azimut = Number(azimutText)
    if (angleDegCheck(azimut)) {
      const formStore = this.getResult()
      const coordArray = formStore.getIn(COORDINATE_PATH)
      // console.log(JSON.stringify({ azimut, coord1: coordArray.get(0), coord2: coordArray.get(1) }))
      const calculatedAzimut = distanceAngle(coordArray.get(0), coordArray.get(1))
      if (azimut.toFixed(0) !== calculatedAzimut.angledeg.toFixed(0)) {
        const coord1 = coordArray.get(0)
        this.setState({ azimutText })
        if (Coord.check(coord1)) {
          const coord2 = sphereDirect(coord1, azimutText, calculatedAzimut.distance)
          // L.CRS.Earth.calcPairRightDown(coord1, width)
          if (Coord.check(coord2)) {
            this.coordinateChangeHandler(1, coord2)
          }
        }
      }
    }
    // this.setResult((result) => {
    //   const azimut = Number(azimutText)
    //   if (angleDegCheck(azimut)) {
    //     const coordArray = result.getIn(COORDINATE_PATH)
    //     // console.log(JSON.stringify({ azimut, coord1: coordArray.get(0), coord2: coordArray.get(1) }))
    //     const calculatedAzimut = distanceAngle(coordArray.get(0), coordArray.get(1))
    //     if (azimut.toFixed(0) !== calculatedAzimut.angledeg.toFixed(0)) {
    //       console.log(JSON.stringify('new azimut'))
    //       const coord1 = coordArray.get(0)
    //       this.setState({ azimutText })
    //       if (Coord.check(coord1)) {
    //         const coord2 = sphereDirect(coord1, azimutText, calculatedAzimut.distance)
    //         // L.CRS.Earth.calcPairRightDown(coord1, width)
    //         // this.coordinateChangeHandler(1, coord2)
    //         result = result.updateIn(COORDINATE_PATH, (coordinates) => coordinates.set(1, coord2))
    //       }
    //     }
    //   }
    //   return result
    // })
  }

  onCoordinateChangeHandler = this.coordinateChangeHandler.bind(this)

  onAzimutFocusHandler = this.azimutFocusChange.bind(this, true, 1)

  onAzimutBlurHandler = this.azimutFocusChange.bind(this, false, 1)

  onAzimutChangeHandler = this.azimutChangeHandler.bind(this)
  // azimutBlurHandler = () => this.setState({ azimutText: null })

  renderCoordinateAndAzimut () {
    const { editCoordinates, azimutText = null } = this.state
    const formStore = this.getResult()
    const coordinatesArray = formStore.getIn(COORDINATE_PATH).toJS()
    const coordBegin = coordinatesArray[0]
    const coordEnd = coordinatesArray[1]
    // console.log(JSON.stringify({ azimutText, coordBegin, coordEnd }))
    const azimut = azimutText !== null ? azimutText : distanceAngle(coordBegin, coordEnd).angledeg.toFixed(0)
    const canEdit = this.isCanEdit()
    const readOnly = !canEdit || !editCoordinates
    const azimut1IsWrong = angleDegCheck(azimut)
    return (
      <FormRow label={i18n.COORDINATES}>
        {coordBegin
          ? <Fragment key={`${coordBegin.lat}/${coordBegin.lng}`}>
            <CoordinateItem
              coordinate={coordBegin}
              index={0}
              readOnly={readOnly}
              canRemove={false}
              onExitWithChange={canEdit ? this.onCoordinateChangeHandler : null}
              onRemove={null} // this.coordinateRemoveHandler}
              onFocus={this.onCoordinateFocusHandler}
              onBlur={this.onCoordinateBlurHandler}
            />
            <FormRow label={i18n.AZIMUT}>
              <InputWithSuffix
              // key = 'a1'
                index={1}
                readOnly={readOnly}
                value={azimut}
                onChange={!readOnly ? this.onAzimutChangeHandler : null }
                onFocus={this.onAzimutFocusHandler}
                onBlur={this.onAzimutBlurHandler}
                suffix={i18n.ABBR_GRADUS}
                error={azimut1IsWrong}
              />
            </FormRow>
          </Fragment> : 'нет'}
      </FormRow>
    )
  }
}

export default WithCoordinateAndAzimut
