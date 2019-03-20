import React from 'react'
import PropTypes from 'prop-types'
import * as ReactDOM from 'react-dom'

const { Consumer: MapConsumer, Provider: MapProvider } = React.createContext()

const DEFAULT_PANE_NAME = 'overlayPane'

function MapPortal ({ children, paneName = DEFAULT_PANE_NAME }) {
  return <MapConsumer>
    {(map) => map && ReactDOM.createPortal(children, map.getPane(paneName))}
  </MapConsumer>
}
MapPortal.propTypes = {
  paneName: PropTypes.string,
  children: PropTypes.any,
}

class MapEventsHandler extends React.Component {
  static propTypes = {
    map: PropTypes.object.isRequired,
    events: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired,
    getInitState: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.state = props.getInitState ? props.getInitState(props.map) : {}
  }

  componentDidMount () {
    const { events } = this.props
    this.eventsToProps = Object.entries(events)
      .map(([ event, handler ]) => [ event, (e) => this.setState(handler(this.props.map, e)) ])
    this.registerEvents()
  }

  componentWillUnmount () {
    this.unregisterEvents()
  }

  registerEvents () {
    const { map } = this.props
    this.eventsToProps.forEach(([ event, callback ]) => map.on(event, callback, this.layer))
  }

  unregisterEvents () {
    const { map } = this.props
    this.eventsToProps.forEach(([ event, callback ]) => map.off(event, callback, this.layer))
  }

  render () {
    return this.props.render(this.state)
  }
}

const getZoomState = (map) => ({ zoom: map.getZoom(), animZoom: null, offset: map.getPixelOrigin(), animOffset: null })
const zoomEvents = {
  'zoomanim': (map, { center, zoom }) => ({
    zoom: map.getZoom(),
    animZoom: zoom,
    animOffset: map._getNewPixelOrigin(center, zoom),
  }),
  'zoomend': getZoomState,
}

function renderZoomable (renderFunc) {
  return <MapConsumer>
    {(map) =>
      map && <MapEventsHandler events={zoomEvents} getInitState={getZoomState} map={map} render={renderFunc}/>
    }
  </MapConsumer>
}

export { renderZoomable, MapProvider, MapConsumer, MapPortal }
