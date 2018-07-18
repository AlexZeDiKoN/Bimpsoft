import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 'leaflet/dist/leaflet.css'
import 'leaflet.pm/dist/leaflet.pm.css'
import './leaflet.pm.patch.css'
import { Map, TileLayer, Control } from 'leaflet'
import { Symbol } from '@DZVIN/milsymbol'
import i18n from '../../i18n'
import 'leaflet.pm'
import 'leaflet-minimap'
import 'leaflet-minimap/dist/Control.MiniMap.min.css'
import { entityKindClass, initMapEvents, createTacticalSign } from './leaflet.pm.patch'

const miniMapOptions = {
  width: 200,
  toggleDisplay: true,
  minimized: true,
  strings: {
    hideText: i18n.HIDE_MINIMAP,
    showText: i18n.SHOW_MINIMAP,
  },
}

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

// TODO: не найелегантніший воркераунд, оптиммізувати у випадку проблем з продуктивністю
const isTacticalSignsEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b)

export class Tiles {
  static propTypes = {
    source: PropTypes.string.isRequired,
    minZoom: PropTypes.number,
    maxZoom: PropTypes.number,
  }
}

export class WebMap extends Component {
  static propTypes = {
    center: PropTypes.arrayOf(PropTypes.number).isRequired,
    zoom: PropTypes.number.isRequired,
    objects: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      kind: PropTypes.oneOf(Object.values(entityKindClass)).isRequired,
      code: PropTypes.string,
      options: PropTypes.object,
      point: PropTypes.arrayOf(PropTypes.number),
      points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
      template: PropTypes.string,
      color: PropTypes.string,
    })),
    children: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.oneOf([ Tiles ]),
      props: PropTypes.object,
    })),
  }

  state = {
    objects: [],
    center: [ 48, 35 ],
    zoom: 7,
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    return {
      objects: nextProps.objects,
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
    this.processObjects(this.state.objects, nextState.objects)
    return !equals
  }

  componentDidUpdate () {
    this.setMapView()
  }

  componentWillUnmount () {
    this.map.remove()
  }

  setMapView () {
    if (!this.container) {
      return
    }
    this.mini = undefined
    this.map = new Map(this.container)
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
    this.state.objects.map((object) => this.addObject(object))
  }

  processObjects (oldObjects, newObjects) {
    for (const object of oldObjects) {
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
    }
  }

  deleteObject (id) {
    // todo
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

  render () {
    return <div ref={(container) => (this.container = container)} style={{ height: '100%' }} />
  }
}
