import PropTypes from 'prop-types'
import { utils } from '@C4/CommonComponents'
import { distanceAzimuth, moveCoordinate } from '../../WebMap/patch/utils/sectors'
const { Coordinates: Coord } = utils

export const COORDINATE_PATH = [ 'geometry' ]

const CoordinatesMixin = (Component) => class CoordinatesComponent extends Component {
  static propTypes = {
    onCoordinateFocusChange: PropTypes.func,
  }

  onCoordinateExitWithChangeHandler = (index, value) => {
    this.setResult((result) => result.setIn([ ...COORDINATE_PATH, index ], value))
  }

  onFirstCoordinateExitChangeHandler = (value) => {
    if (!Coord.check(value)) {
      return
    }
    const coordArray = this.getResult().getIn(COORDINATE_PATH)
    const coordO = coordArray.get(0)
    const coordList = coordArray.map((elm) => {
      return moveCoordinate(value, distanceAzimuth(coordO, elm))
    })
    this.setResult((result) => result.setIn(COORDINATE_PATH, coordList))
  }

  onAllCoordinateChangeHandler = (newCoord) => {
    const coordArray = this.getResult().getIn(COORDINATE_PATH)
    const coordList = coordArray.map((elm, ind) => {
      return newCoord[ind] ?? {}
    })
    this.setResult((result) => result.setIn(COORDINATE_PATH, coordList))
  }

  coordinateFocusChange (isActive, index) {
    const { onCoordinateFocusChange } = this.props
    onCoordinateFocusChange && onCoordinateFocusChange(index, isActive)
  }

  onCoordinateFocusHandler = this.coordinateFocusChange.bind(this, true)

  onCoordinateBlurHandler = this.coordinateFocusChange.bind(this, false)
}

export default CoordinatesMixin
