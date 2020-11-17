import L from 'leaflet'
import React from 'react'
import { components, utils } from '@C4/CommonComponents'
import i18n from '../../../i18n'
import { adjustSquareCorner } from '../../WebMap/patch/utils/helpers'
import CoordinateRow from './CoordinateRow'
import CoordinatesMixin, { COORDINATE_PATH } from './CoordinatesMixin'
import { figureArea } from './render'

const {
  FormDarkPart,
  InputWithSuffix,
} = components.form
const { Coordinates: Coord } = utils

function getWidthFromCoordinatesArray (coordinatesArray) {
  const coord1 = coordinatesArray[0]
  let width = 0
  if (Coord.check(coord1)) {
    const coord2 = coordinatesArray[1]
    if (Coord.check(coord2)) {
      const corner1 = L.latLng(coord1)
      const corner2 = L.latLng({ lng: coord2.lng, lat: coord1.lat })
      width = Math.round(corner1.distanceTo(corner2))
    }
  }
  return width
}

const WithCoordinateAndWidth = (Component) => class CoordinateAndWidthComponent extends CoordinatesMixin(Component) {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      widthText: null,
    }
  }

  coordinateChangeHandler = async (index, value, isSquare) => {
    // проверка, преобразование координат для квадрата
    if (isSquare) {
      const coords = this.getResult().getIn(COORDINATE_PATH).toJS()
      const opossiteIndex = (index + 1) % 2
      const adjustValue = adjustSquareCorner(null, value, coords[opossiteIndex])
      await this.onCoordinateExitWithChangeHandler(index, adjustValue)
    } else {
      await this.onCoordinateExitWithChangeHandler(index, value)
    }
    this.setState({ widthText: null })
  }

  widthChangeHandler = (widthText) => {
    this.setResult((result) => {
      const width = Number(widthText)
      if (Number.isFinite(width)) {
        const coordinatesArray = result.getIn(COORDINATE_PATH)
        const calculatedWidth = getWidthFromCoordinatesArray(coordinatesArray)
        if (widthText !== calculatedWidth) {
          const coord1 = coordinatesArray.get(0)
          if (Coord.check(coord1)) {
            const coord2 = L.CRS.Earth.calcPairRightDown(coord1, width)
            result = result.updateIn(COORDINATE_PATH, (coordinates) => coordinates.set(1, coord2))
          }
          this.setState({ widthText })
        }
      }
      return result
    })
  }

  widthBlurHandler = () => this.setState({ widthText: null })

  renderCoordinateAndWidth (isSquare) {
    const coordinatesArray = this.getResult().getIn(COORDINATE_PATH).toJS()
    const { widthText = null } = this.state
    const { coordinatesType } = this.props

    const width = widthText !== null ? widthText : getWidthFromCoordinatesArray(coordinatesArray)

    const canEdit = this.isCanEdit()

    const widthIsWrong = !Number.isFinite(Number(width))

    return (
      <FormDarkPart>
        <div className='coordinate-width-title'>{i18n.COORDINATES}</div>
        <div className="shape-form-scrollable">
          <CoordinateRow
            label={i18n.NORTH_WEST}
            coordinate={coordinatesArray[0]}
            index={0}
            readOnly={!canEdit}
            onExitWithChange={canEdit ? (index, value) => this.coordinateChangeHandler(index, value, isSquare) : null}
            onBlur={this.onCoordinateBlurHandler}
            onFocus={this.onCoordinateFocusHandler}
            coordinatesType={coordinatesType}
          />
          <CoordinateRow
            label={i18n.SOUTH_EAST}
            coordinate={coordinatesArray[1]}
            index={1}
            readOnly={!canEdit}
            onExitWithChange={canEdit ? (index, value) => this.coordinateChangeHandler(index, value, isSquare) : null}
            onBlur={this.onCoordinateBlurHandler}
            onFocus={this.onCoordinateFocusHandler}
            coordinatesType={coordinatesType}
          />
          <div className='coordinateRow-container'>
            <div className='coordinate-title'>{i18n.SIDE_SIZE}</div>
            <InputWithSuffix
              readOnly={!canEdit}
              value={width}
              onChange={canEdit ? this.widthChangeHandler : null }
              suffix={i18n.ABBR_METERS}
              error={widthIsWrong}
              onBlur={this.widthBlurHandler}
            />
          </div>
        </div>
        {isSquare && figureArea(L.rectangle(coordinatesArray.map(({ lat, lng }) => [ lat, lng ])))}
      </FormDarkPart>
    )
  }
}

export default WithCoordinateAndWidth
