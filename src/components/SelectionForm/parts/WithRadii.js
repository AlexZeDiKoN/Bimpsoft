import L from 'leaflet'
import React from 'react'
import { components, utils } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import { distanceAngle } from '../../WebMap/patch/utils/sectors'
import CoordinatesMixin, { COORDINATE_PATH } from './CoordinatesMixin'

const {
  FormRow,
  InputWithSuffix,
} = components.form

const { Coordinates: Coord } = utils
const MARKER = [ '', 'А', 'Б', 'В', 'Г' ]

const WithRadii = (Component) => class RadiiComponent extends CoordinatesMixin(Component) {
  constructor (props) {
    super(props)
    this.state = {
      radiiText: [],
    }
  }

  isGoodRadiusRight = (radius, coordArray, index) => {
    if (!Number.isFinite(radius)) {
      return false
    }
    const coord1 = coordArray[0]
    let isGood = false
    if (Coord.check(coord1)) {
      const coord2 = L.CRS.Earth.calcPairRight(coord1, radius)
      switch (index) {
        case 1:
          isGood = coord2.lng > coordArray[index + 1].lng
          break
        case 2:
        case 3:
          isGood = (coord2.lng > coordArray[index + 1].lng) && (coord2.lng < coordArray[index - 1].lng)
          break
        case 4:
          isGood = (coord2.lng > coordArray[0].lng) && (coord2.lng < coordArray[index - 1].lng)
          break
        default:
          isGood = false
      }
    }
    return isGood
  }

  radiusChangeHandler = (index) => (radiusText) => {
    this.setResult((result) => {
      const radius = Number(radiusText)
      const coordinatesArray = result.getIn(COORDINATE_PATH).toJS()
      const isSet = this.isGoodRadiusRight(radius, coordinatesArray, index)
      if (isSet) {
        const coord2 = L.CRS.Earth.calcPairRight(coordinatesArray[0], radius)
        return result.setIn([ ...COORDINATE_PATH, index ], coord2)
      }
      return result
    })
    const { radiiText } = this.state
    radiiText[index] = radiusText
    this.setState({ radiiText })
  }

  radiiBlurHandler = (index) => () => {
    const { radiiText = [] } = this.state
    radiiText[index] = undefined
    this.setState({ radiiText })
    this.onCoordinateBlurHandler(index)
  }

  radiiFocusHandler = (index) => () => {
    this.onCoordinateFocusHandler(index)
  }

  renderRadii () {
    const canEdit = this.isCanEdit()
    const coordinatesArray = this.getResult().getIn(COORDINATE_PATH).toJS()
    const coordO = coordinatesArray[0]
    const { radiiText = [] } = this.state
    return (
      <div>
        {coordinatesArray.map((elm, index) => {
          const radius = radiiText[index] ? radiiText[index]
            : Math.round(distanceAngle(coordO, coordinatesArray[index]).distance)
          const radiusIsGood = this.isGoodRadiusRight(Number(radius), coordinatesArray, index)
          return (index !== 0) ? (
            <FormRow key={index} label={`${i18n.RADIUS} «${MARKER[index]}»`}>
              <InputWithSuffix
                readOnly={!canEdit}
                value={radius}
                onChange={canEdit ? this.radiusChangeHandler(index) : null}
                onFocus={canEdit ? this.radiiFocusHandler(index) : null}
                onBlur={canEdit ? this.radiiBlurHandler(index) : null}
                suffix={`${i18n.ABBR_METERS} ${radiusIsGood ? '' : '*'}`}
                error={!radiusIsGood}
              />
            </FormRow>) : ''
        })}
      </div>
    )
  }
}

export default WithRadii
