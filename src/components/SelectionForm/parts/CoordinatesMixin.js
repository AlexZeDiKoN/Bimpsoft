import PropTypes from 'prop-types'

export const COORDINATE_PATH = [ 'geometry' ]

const CoordinatesMixin = (Component) => class CoordinatesComponent extends Component {
  static propTypes = {
    onCoordinateFocusChange: PropTypes.func,
  }

  coordinateChangeHandler = (index, item) => this.setResult((result) =>
    result.setIn([ ...COORDINATE_PATH, index ], item)
  )

  coordinateFocusChange (isActive, index) {
    const { onCoordinateFocusChange } = this.props
    onCoordinateFocusChange && onCoordinateFocusChange(index, isActive)
  }

  onCoordinateFocusHandler = this.coordinateFocusChange.bind(this, true)

  onCoordinateBlurHandler = this.coordinateFocusChange.bind(this, false)
}

export default CoordinatesMixin
