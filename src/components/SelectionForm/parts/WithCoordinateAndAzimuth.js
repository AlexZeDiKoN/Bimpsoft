import React from 'react'
import { components, utils } from '@C4/CommonComponents'
import i18n from '../../../i18n'
import { angleDegCheck, distanceAzimuth, moveCoordinate } from '../../WebMap/patch/utils/sectors'
import placeSearch from '../../../server/places'
import { STRATEGY } from '../../WebMap/patch/Sophisticated/strategies'
import CoordinatesMixin from './CoordinatesMixin'

const COORDINATE_PATH = [ 'geometry' ]
const { Coordinates: Coord } = utils

const {
  FormRow,
  InputWithSuffix,
  Coordinates,
  FormItem,
} = components.form

// eslint-disable-next-line max-len
const WithCoordinateAndAzimuth = (Component) => class CoordinatesAndAzimuthComponent extends CoordinatesMixin(Component) {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      azimuthText: undefined,
    }
  }

  firstCoordinateExitChangeHandler = async (value) => {
    await this.onFirstCoordinateExitChangeHandler(value)
  }

  azimuthChangeHandler = (azimuthText) => {
    this.setState({ azimuthText })
  }

  onAzimuthBlurHandler = async () => {
    const { azimuthText } = this.state
    const azimuth = Number(azimuthText)
    if (Number.isFinite(azimuth) && angleDegCheck(azimuth)) {
      const formStore = this.getResult()
      const coordList = formStore.getIn(COORDINATE_PATH)
      const coordArray = coordList.toJS()
      const coordO = coordArray[0]
      const coordTo = distanceAzimuth(coordO, coordArray[1])
      if (azimuth.toFixed(0) !== coordTo.angledeg.toFixed(0)) {
        coordTo.angledeg = azimuth
        const coord2 = moveCoordinate(coordO, coordTo)
        if (Coord.check(coord2)) {
          const nextCoord = coordList.toJS()
          nextCoord[1] = coord2
          // перенос всех координат
          STRATEGY.shapeSectorLL(coordArray, nextCoord, 1)
          await this.onAllCoordinateChangeHandler(nextCoord)
        }
      }
    }
    this.setState({ azimuthText: undefined })
    this.onCoordinateBlurHandler(1)
  }

  onAzimuthChangeHandler = this.azimuthChangeHandler.bind(this)

  renderCoordinateAndAzimuth () {
    const coordinatesArray = this.getResult().getIn(COORDINATE_PATH).toJS()
    const coordBegin = coordinatesArray[0]
    const coordEnd = coordinatesArray[1]
    const { azimuthText } = this.state
    const azimuth = azimuthText ?? distanceAzimuth(coordBegin, coordEnd).angledeg.toFixed(0)
    const canEdit = this.isCanEdit()
    const azimuthIsWrong = !angleDegCheck(azimuth)
    const { coordinatesType } = this.props

    return (
      <FormRow label={i18n.COORDINATES}>
        {coordBegin &&
          <div className={!canEdit ? 'modals-input-disabled' : ''} key={`${coordBegin.lat}/${coordBegin.lng}`}>
            <FormItem className="coordinatesModal">
              <Coordinates
                isReadOnly={!canEdit}
                coordinates={coordBegin}
                onEnter={() => this.onCoordinateFocusHandler(0)}
                onBlur={() => this.onCoordinateBlurHandler(0)}
                onExitWithChange={canEdit ? this.firstCoordinateExitChangeHandler : null }
                onSearch={placeSearch}
                preferredType={coordinatesType}
              />
            </FormItem>
            <FormRow label={i18n.AZIMUTH}>
              <InputWithSuffix
                readOnly={!canEdit}
                value={azimuth}
                onChange={canEdit ? this.onAzimuthChangeHandler : null }
                onFocus={() => this.onCoordinateFocusHandler(1)}
                onBlur={canEdit ? this.onAzimuthBlurHandler : () => this.onCoordinateBlurHandler(1) }
                suffix={`${i18n.ABBR_GRADUS} ${azimuthIsWrong ? '*' : ''}`}
                error={azimuthIsWrong}
              />
            </FormRow>
          </div>}
      </FormRow>
    )
  }
}

export default WithCoordinateAndAzimuth
