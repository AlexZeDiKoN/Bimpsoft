import PropTypes from 'prop-types'

export const COORDINATE_PATH = [ 'geometry' ]

const CoordinatesMixin = (Component) => class CoordinatesComponent extends Component {
  static propTypes = {
    onCoordinateFocusChange: PropTypes.func,
  }

  coordinateChangeHandler = (index, newCoord) => {
    this.index = index
    this.newCoord = newCoord
  }

  coordinateFocusChange (isActive, index) {
    const { onCoordinateFocusChange } = this.props
    onCoordinateFocusChange && onCoordinateFocusChange(index, isActive)
    if (!isActive) {
      this.setResult((result) =>
        result.setIn([ ...COORDINATE_PATH, this.index ], this.newCoord)
      )
    }
  }

  onCoordinateFocusHandler = this.coordinateFocusChange.bind(this, true)

  onCoordinateBlurHandler = this.coordinateFocusChange.bind(this, false)
}

export default CoordinatesMixin
