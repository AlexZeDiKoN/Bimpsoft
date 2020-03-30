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

  radiusChangeHandler = (index) => (radiusText) => {
    this.setResult((result) => {
      const radius = Number(radiusText)
      if (Number.isFinite(radius)) {
        const coordinatesArray = result.getIn(COORDINATE_PATH).toJS()
        const coord1 = coordinatesArray[0]
        if (Coord.check(coord1)) {
          const coord2 = L.CRS.Earth.calcPairRight(coord1, radius)
          let isSet
          switch (index) {
            case 1:
              isSet = coord2.lng > coordinatesArray[index + 1].lng
              break
            case 2:
            case 3:
              isSet = (coord2.lng > coordinatesArray[index + 1].lng) && (coord2.lng < coordinatesArray[index - 1].lng)
              break
            case 4:
              isSet = (coord2.lng > coordinatesArray[0].lng) && (coord2.lng < coordinatesArray[index - 1].lng)
              break
            default: isSet = false
          }
          if (isSet) {
            return result.setIn([ ...COORDINATE_PATH, index ], coord2)
          }
        }
      }
      return result
    })
    const { radiiText } = this.state
    radiiText[index] = radiusText
    this.setState({ radiiText })
  }

  radiiBlurHandler = (index) => () => {
    const { radiiText = [] } = this.state
    const radius = Number(radiiText[index])
    radiiText[index] = undefined
    this.setState({ radiiText })
    this.onCoordinateBlurHandler(index)
    this.setResult((result) => {
      if (Number.isFinite(radius)) {
        const coordinatesArray = result.getIn(COORDINATE_PATH)
        const coord1 = coordinatesArray.get(0)
        if (Coord.check(coord1)) {
          const coord2 = L.CRS.Earth.calcPairRight(coord1, radius)
          result = result.updateIn(COORDINATE_PATH, (coordinates) => coordinates.set(index, coord2))
        }
      }
      return result
    })
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
          const radiusIsWrong = !Number.isFinite(Number(radius))
          return (index !== 0) ? (
            <FormRow key={radius} label={`${i18n.RADIUS} «${MARKER[index]}»`}>
              <InputWithSuffix
                readOnly={!canEdit}
                value={radius}
                onChange={canEdit ? this.radiusChangeHandler(index) : null}
                onFocus={canEdit ? this.radiiFocusHandler(index) : null}
                onBlur={canEdit ? this.radiiBlurHandler(index) : null}
                suffix={i18n.ABBR_METERS}
                error={radiusIsWrong}
              />
            </FormRow>) : ''
        })}
      </div>
    )
  }
}

export default WithRadii
