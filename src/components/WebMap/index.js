import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 'leaflet/dist/leaflet.css'
import 'leaflet.pm/dist/leaflet.pm.css'
import './leaflet.pm.patch.css'
import { Map, TileLayer } from 'leaflet'
import { Symbol } from 'milsymbol'
import 'leaflet.pm'
import { entityKindClass, initMapEvents, createTacticalSign } from './leaflet.pm.patch'

const tmp = `<svg
  width="480" height="480"
  line-point-1="24,240"
  line-point-2="456,240">
  <path
    fill="none"
    stroke="red" stroke-width="3" stroke-linecap="square"
    d="M8,240
       a16,16 0 0,1 16,-16
       h80
       l15,-23 15,23 -15,23 -15,-23
       m30,0 h106
       v-65 l-4,6 4,-15 4,15 -4,-6 v35
       l-20,0 40,0 -20,0 v15
       l-20,0 40,0 -20,0 v15
       h106
       l15,-23 15,23 -15,23 -15,-23
       m30,0 h80
       a16,16 0 0,1 16,16" />
</svg>`

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
    children: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.oneOf([ Tiles ]),
    })),
  }

  componentDidMount () {
    this.map = new Map(this.container)
    this.setMapView()
    React.Children.forEach(this.props.children, (child) => {
      if (child.type === Tiles) {
        const { source, ...rest } = child.props
        new TileLayer(source, rest).addTo(this.map)
      }
    })
    initMapEvents(this.map)

    let test = new Symbol('sfgpewrh--mt', { size: 48, direction: 45 })
    createTacticalSign(null, entityKindClass.POINT, [ [ 48.5, 35 ] ], test.asSVG(), 'black',
      this.map, test.getAnchor())

    test = new Symbol('10011500521200000800', { size: 48 })
    createTacticalSign(null, entityKindClass.POINT, [ [ 48.5, 35.5 ] ], test.asSVG(), 'black',
      this.map, test.getAnchor())

    test = new Symbol('SHGPUCDT--AI', { size: 48 })
    createTacticalSign(null, entityKindClass.POINT, [ [ 48.5, 36 ] ], test.asSVG(), 'black',
      this.map, test.getAnchor())

    createTacticalSign(null, entityKindClass.AREA, [ [ 47.8, 34.8 ], [ 48.2, 35.2 ], [ 47.8, 35 ] ], '', '#38f',
      this.map)

    createTacticalSign(null, entityKindClass.SEGMENT, [ [ 47.5, 34.5 ], [ 47.55, 34.75 ] ], tmp, 'red',
      this.map)
  }

  componentDidUpdate () {
    this.setMapView()
  }

  componentWillUnmount () {
    this.map.remove()
  }

  setMapView () {
    this.map.setView(this.props.center, this.props.zoom)
  }

  render () {
    return <div ref={(container) => (this.container = container)} style={{ height: '100%' }} />
  }
}
