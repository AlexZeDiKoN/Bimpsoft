import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Shortcuts } from 'react-shortcuts'
import 'leaflet/dist/leaflet.css'
import 'leaflet.pm/dist/leaflet.pm.css'
import './leaflet.pm.patch.css'
import { Map, TileLayer, Control, DomEvent, control } from 'leaflet'
import { Symbol } from '@DZVIN/milsymbol'
import { forward } from 'mgrs'
import { fromLatLon } from 'utm'
import i18n from '../../i18n'
import { layers } from '../../store/actions'
import {
  ADD_POLYLINE, ADD_POLYGON, ADD_CURVED_POLYLINE, ADD_CURVED_POLYGON, ADD_POINT_SIGN,
  // TODO: пибрати це після тестування
  LOAD_TEST_OBJECTS,
} from '../../constants/shortcuts'
import Tiles from './Tiles'
import 'leaflet.pm'
import 'leaflet-minimap/dist/Control.MiniMap.min.css'
import 'leaflet-minimap'
import 'leaflet-measure-custom/leaflet.measure/leaflet.measure.css'
import 'leaflet-measure-custom/leaflet.measure/leaflet.measure'
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min.css'
import 'leaflet-graphicscale/dist/Leaflet.GraphicScale.min'
import 'leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.css'
import 'leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.min'
import { entityKindClass, initMapEvents, createTacticalSign } from './leaflet.pm.patch'

const indicateModes = {
  count: 5,
  WGS: 0,
  WGSI: 1,
  MGRS: 2,
  UTM: 3,
  ALL: 4,
}

const miniMapOptions = {
  width: 200,
  toggleDisplay: true,
  minimized: true,
  strings: {
    hideText: i18n.HIDE_MINIMAP,
    showText: i18n.SHOW_MINIMAP,
  },
}

const z = (v) => `0${v}`.slice(-2)
const toGMS = (value, pos, neg) => {
  const sign = value > 0 ? pos : neg
  value = Math.abs(value)
  const g = Math.trunc(value)
  value = (value - g) * 60
  const m = Math.trunc(value)
  const s = Math.round((value - m) * 60)
  return `${sign} ${g}°${z(m)}'${z(s)}"` // eslint-disable-line no-irregular-whitespace
}
const utmLabel = (u) => `${u.zoneLetter}-${u.zoneNum} x${u.easting.toFixed(0)} y${u.northing.toFixed(0)}`
const Wgs84 = (lat, lng) => ` ${i18n.LATITUDE}: ${lat.toFixed(4)}   ${i18n.LONGITUDE}: ${lng.toFixed(4)}` // eslint-disable-line no-irregular-whitespace
const Wgs84I = (lat, lng) => ` ${toGMS(lat, 'N', 'S')}   ${toGMS(lng, 'E', 'W')}` // eslint-disable-line no-irregular-whitespace
const Mgrs = (lat, lng) => ` MGRS: ${forward([ lng, lat ])}` // eslint-disable-line no-irregular-whitespace
const Utm = (lat, lng) => `UTM: ${utmLabel(fromLatLon(lat, lng))}` // eslint-disable-line no-irregular-whitespace

function isTileLayersEqual (a, b) {
  for (const key of Object.keys(a)) {
    if (b[key] !== a[key]) {
      return false
    }
  }
  for (const key of Object.keys(b)) {
    if (a[key] !== b[key]) {
      return false
    }
  }
  return true
}

/* // TODO: не найелегантніший воркераунд, оптиммізувати у випадку проблем з продуктивністю
const isTacticalSignsEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b) */

const TileChild = PropTypes.shape({
  type: PropTypes.oneOf([ Tiles ]),
  props: PropTypes.object,
})

class WebMapInner extends Component {
  static propTypes = {
    // props
    center: PropTypes.arrayOf(PropTypes.number).isRequired,
    zoom: PropTypes.number.isRequired,
    // children
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(TileChild),
      TileChild,
    ]),
    // from Redux store
    objects: PropTypes.object,
    // Redux actions
    addObject: PropTypes.func,
    deleteObject: PropTypes.func,
    updateObject: PropTypes.func,
    // TODO: пибрати це після тестування
    loadTestObject: PropTypes.func,
  }

  state = {
    center: [ 48, 35 ],
    zoom: 7,
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    return {
      center: nextProps.center || prevState.center,
      zoom: nextProps.zoom || prevState.zoom,
    }
  }

  componentDidMount () {
    this.setMapView()
    this.initObjects()
  }

  shouldComponentUpdate (nextProps, nextState) {
    let equals = nextProps.children.length === this.props.children.length
    if (equals) {
      for (let i = 0; i < this.props.children.length; i++) {
        equals = equals && isTileLayersEqual(this.props.children[i].props, nextProps.children[i].props)
        if (!equals) {
          break
        }
      }
    }
    if (this.state.center !== nextState.center || this.state.zoom !== nextState.zoom) {
      this.map.setView(this.props.center, this.props.zoom)
    }
    // this.processObjects(this.state.objects, nextState.objects)
    return !equals
  }

  componentDidUpdate () {
    this.setMapView()
  }

  componentWillUnmount () {
    this.map.remove()
  }

  indicateMode = indicateModes.WGS

  toggleIndicateMode = () => {
    this.indicateMode = (this.indicateMode + 1) % indicateModes.count
  }

  setMapView () {
    if (!this.container) {
      return
    }
    this.mini = undefined
    this.map = new Map(this.container, {
      zoomControl: false,
      measureControl: true,
    })
    control.zoom({
      zoomInTitle: i18n.ZOOM_IN,
      zoomOutTitle: i18n.ZOOM_OUT,
    }).addTo(this.map)
    this.scale = control.graphicScale({
      fill: 'hollow',
    })
    this.scale._getDisplayUnit = (meters) => {
      const m = meters < 1000
      const displayUnit = ` ${i18n[m ? 'ABBR_METERS' : 'ABBR_KILOMETERS']}`
      return {
        unit: displayUnit,
        amount: m ? meters : meters / 1000,
      }
    }
    this.scale.addTo(this.map)
    this.coordinates = control.coordinates({
      position: 'topright',
      enableUserInput: false,
      customLabelFcn: ({ lng, lat }) => {
        switch (this.indicateMode) {
          case indicateModes.WGSI:
            return Wgs84I(lat, lng)
          case indicateModes.MGRS:
            return Mgrs(lat, lng)
          case indicateModes.UTM:
            return Utm(lat, lng)
          case indicateModes.ALL:
            return [ Wgs84(lat, lng), Wgs84I(lat, lng), Mgrs(lat, lng), Utm(lat, lng) ].join('<br/>')
          default: // WGS-84
            return Wgs84(lat, lng)
        }
      },
    })
    this.coordinates.addTo(this.map)
    DomEvent.addListener(this.coordinates._container, 'click', () => {
      this.toggleIndicateMode()
      this.coordinates._update({ latlng: this.coordinates._currentPos })
    }, this.coordinates)
    this.map.setView(this.props.center, this.props.zoom)
    React.Children.forEach(this.props.children, (child) => {
      if (child.type === Tiles) {
        const { source, ...rest } = child.props
        new TileLayer(source, rest).addTo(this.map)
        if (!this.mini) {
          const tileLayer = new TileLayer(source, { ...rest, minZoom: 0, maxZoom: 15 })
          this.mini = new Control.MiniMap(tileLayer, miniMapOptions).addTo(this.map)
        }
      }
    }, this)
    initMapEvents(this.map)
  }

  initObjects () {
    const { objects } = this.props
    objects.valueSeq().map((object) => this.addObject(object))
  }

  updateObjects () {
    this.props.objects.valueSeq().map((object) => console.info(object.toJS()))
    /* for (const object of oldObjects) {
      if (!newObjects.find((item) => item.id === object.id)) {
        this.deleteObject(object.id)
      }
    }
    for (const object of newObjects) {
      if (!oldObjects.find((item) => item.id === object.id)) {
        this.addObject(object)
      }
    }
    for (const object of oldObjects) {
      const newObject = newObjects.find((item) => item.id === object.id)
      if (!isTacticalSignsEqual(object, newObject)) {
        this.deleteObject(object.id)
        this.addObject(newObject)
      }
    } */
  }

  deleteObject (id) {
    // TODO
  }

  addObject ({ id, kind, code = '', options = {}, point, points, template = '', color = 'black' }) {
    let anchor
    if (kind === entityKindClass.POINT) {
      const symbol = new Symbol(code, { size: 48, ...options })
      template = symbol.asSVG()
      points = [ point ]
      anchor = symbol.getAnchor()
    }
    createTacticalSign(id, kind, points, template, color, this.map, anchor)
  }

  handleShortcuts = async (action) => {
    const { addObject } = this.props
    switch (action) {
      case ADD_POLYLINE:
        console.info('ADD_POLYLINE')
        break
      case ADD_POLYGON:
        console.info('ADD_POLYGON')
        break
      case ADD_CURVED_POLYLINE:
        console.info('ADD_CURVED_POLYLINE')
        break
      case ADD_CURVED_POLYGON: {
        console.info('ADD_CURVED_POLYGON')
        if (this.map) {
          const bounds = this.map.getBounds()
          const center = bounds.getCenter()
          const width = bounds.getEast() - bounds.getWest()
          const height = bounds.getNorth() - bounds.getSouth()
          await addObject({
            type: entityKindClass.AREA,
            geometry: [
              { lat: center.lat - height / 10, lng: center.lng },
              { lat: center.lat + height / 10, lng: center.lng - width / 10 },
              { lat: center.lat + height / 10, lng: center.lng + width / 10 },
            ],
          })
          this.updateObjects()
        }
        break
      }
      case ADD_POINT_SIGN:
        console.info('ADD_POINT_SIGN')
        break
      // TODO: пибрати це після тестування
      case LOAD_TEST_OBJECTS: {
        console.info('LOAD_TEST_OBJECTS')
        this.props.loadTestObject()
        break
      }
      default:
        console.error(`Unknown action: ${action}`)
    }
  }

  render () {
    return (
      <Shortcuts
        name='WebMap'
        handler={this.handleShortcuts}
      >
        <div ref={(container) => (this.container = container)} style={{ height: '100%' }} />
      </Shortcuts>
    )
  }
}

const WebMap = connect(
  (state) => ({
    objects: state.webMap.objects,
  }),
  (dispatch) => ({
    addObject: (object) => dispatch(layers.addObject(object)),
    deleteObject: (id) => dispatch(layers.deleteObject(id)),
    updateObject: (object) => dispatch(layers.updateObject(object)),
    // TODO: пибрати це після тестування
    loadTestObject: () => dispatch(layers.selectLayer(null)),
  }),
)(WebMapInner)
WebMap.displayName = 'WebMap'

export default WebMap
