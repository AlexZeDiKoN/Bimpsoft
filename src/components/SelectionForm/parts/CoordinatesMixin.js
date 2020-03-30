import PropTypes from 'prop-types'
import { utils } from '@DZVIN/CommonComponents'
import { distanceAngle, moveCoordinate } from '../../WebMap/patch/utils/sectors'
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
      const moveTo = distanceAngle(coordO, elm)
      return moveCoordinate(value, moveTo.distance, moveTo.angledeg)
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
