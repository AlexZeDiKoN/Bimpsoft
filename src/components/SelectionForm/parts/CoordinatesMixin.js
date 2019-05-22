import PropTypes from 'prop-types'

export const COORDINATE_PATH = [ 'geometry' ]

const CoordinatesMixin = (Component) => class CoordinatesComponent extends Component {
  static propTypes = {
    onCoordinateFocusChange: PropTypes.func,
  }

  onCoordinateExitWithChangeHandler = (index, value) => {
    this.setResult((result) => result.setIn([ ...COORDINATE_PATH, index ], value))
  }

  coordinateFocusChange (isActive, index) {
    const { onCoordinateFocusChange } = this.props
    onCoordinateFocusChange && onCoordinateFocusChange(index, isActive)
  }

  onCoordinateFocusHandler = this.coordinateFocusChange.bind(this, true)

  onCoordinateBlurHandler = this.coordinateFocusChange.bind(this, false)
}

export default CoordinatesMixin
