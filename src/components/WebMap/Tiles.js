import PropTypes from 'prop-types'

export default class Tiles {
  static propTypes = {
    source: PropTypes.string.isRequired,
    minZoom: PropTypes.number,
    maxZoom: PropTypes.number,
  }
}
