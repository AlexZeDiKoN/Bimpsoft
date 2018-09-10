import PropTypes from 'prop-types'
import { List } from 'immutable'
import i18n from '../../../i18n'
import coordinates from '../../../utils/coordinates'

const CoordinatesMixin = (Component) => class CoordinatesComponent extends Component {
  static propTypes = {
    coordinatesArray: PropTypes.arrayOf(PropTypes.object),
  }

  constructor (props) {
    super(props)
    const coordinatesArray = props.coordinatesArray || []
    while (coordinatesArray.length < 2) {
      coordinatesArray.push(coordinates.parse(''))
    }
    this.state.coordinatesArray = List(coordinatesArray)
  }

  coordinateChangeHandler = (index, item) => this.setState((state) => ({
    coordinatesArray: state.coordinatesArray.set(index, item),
  }))

  fillResult (result) {
    super.fillResult(result)
    const { state } = this
    result.coordinatesArray = state.coordinatesArray.toJS()
  }

  getErrors () {
    const errors = super.getErrors()
    for (const coordinate of this.state.coordinatesArray) {
      if (!coordinate || coordinates.isWrong(coordinate)) {
        errors.push(i18n.INCORRECT_COORDINATE)
        break
      }
    }
    return errors
  }
}

export default CoordinatesMixin
