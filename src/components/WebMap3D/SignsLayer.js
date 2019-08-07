import React, { Component } from 'react'
import PropTypes from 'prop-types'
import memoize from 'memoize-one'
import {
  Cartographic, Cartesian3, PolygonGeometry,
  GeometryInstance, ColorGeometryInstanceAttribute, PolygonHierarchy,
} from 'cesium'
import { Camera, Globe, Entity, GroundPrimitiveCollection, GroundPrimitive } from 'resium'
import { zoom2height, objectsToSvg } from '../../utils/mapObjConvertor'
import objTypes from '../../components/WebMap/entityKind'

const renderEntities = memoize((signs) => signs.map(({ type, id, ...rest }) => {
  if (type === objTypes.POLYGON) {
    const { fill, positions } = rest
    // @TODO: make it stop rerendering
    const polygon = new PolygonGeometry({
      polygonHierarchy: new PolygonHierarchy(positions),
    })
    const fillColor = ColorGeometryInstanceAttribute.fromColor(fill)
    fillColor.value[3] = 127
    const instance = new GeometryInstance({
      geometry: polygon,
      attributes: {
        color: fillColor,
      },
    })

    return (
      <GroundPrimitive
        key={id}
        geometryInstances={instance}
      />
    )
  } else {
    return <Entity key={id} { ...rest }/>
  }
}))

export default class SignsLayer extends Component {
  static propTypes = {
    objects: PropTypes.object,
    zoom: PropTypes.number.isRequired,
    setZoom: PropTypes.func.isRequired,
  }

  camera = React.createRef()

  globe = React.createRef()

  checkZoom = () => {
    if (this.camera.current) {
      const { zoom, setZoom } = this.props
      const { cesiumElement: cameraInstance } = this.camera.current
      const { position } = cameraInstance
      const cartographic = Cartographic.fromCartesian(position)
      const { height } = cartographic
      const currentZoom = Math.round(zoom2height(null, height))
      currentZoom !== zoom && setZoom(currentZoom)
    }
  }

  positionHeightUp = (position, value) => {
    if (this.globe.current) {
      const { cesiumElement: globeInstance } = this.globe.current
      const cartographic = Cartographic.fromCartesian(position)
      const height = globeInstance.getHeight(cartographic) || 0
      return Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height + value)
    }
    return position
  }

  render () {
    const { objects } = this.props
    const signs = objectsToSvg(objects, this.positionHeightUp)
    const entities = renderEntities(signs)
    return (
      <>
        <Globe ref={this.globe} depthTestAgainstTerrain={false}/>
        <Camera ref={this.camera} onMoveEnd={this.checkZoom}/>
        <GroundPrimitiveCollection>
          { entities }
        </GroundPrimitiveCollection>
      </>
    )
  }
}
