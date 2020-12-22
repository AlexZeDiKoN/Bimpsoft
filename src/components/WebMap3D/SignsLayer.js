import React, { Component } from 'react'
import PropTypes from 'prop-types'
import memoize from 'memoize-one'
import {
  Cartographic,
  Cartesian3,
  PolygonGeometry,
  GroundPolylineGeometry,
  GeometryInstance,
  ColorGeometryInstanceAttribute,
  PolygonHierarchy,
  PolylineColorAppearance,
} from 'cesium'
import {Camera, Globe, Entity, GroundPrimitive, Scene, Fog, GeoJsonDataSource, GroundPolylinePrimitive} from 'resium'
import { zoom2height, objectsToSvg } from '../../utils/mapObjConvertor'
import objTypes from '../../components/WebMap/entityKind'
import {isArray} from "leaflet/src/core/Util";

//import * as mapColors from "../../constants/colors";

const fromColorAlpha = (color, alpha) => {
  const _color = ColorGeometryInstanceAttribute.fromColor(color)
  _color.value[3] = alpha
  return _color
}

const instanceSophisticated = (rest, vide) => {
  const { type, options, attributes } = rest
  let instance
  console.log('rest', rest)
  if (vide === 'line') {
    switch (type) {
      case 'polyline': {
      //  const {width = 1, color, arcType = ArcType.GEODESIC} = rest
        const polyline = new GroundPolylineGeometry(options)
        instance = new GeometryInstance({
          geometry: polyline,
          attributes: attributes,
        })
        break
      }
      default:
    }
  } else {
    switch (type) {
      case 'polygon': {
        const polygon = new PolygonGeometry(options)
  //      const fillColor = fromColorAlpha(fill, alpha)
        instance = new GeometryInstance({
          geometry: polygon,
          attributes: attributes,
        })
        break
      }
      default:
    }
  }

  return instance
}


const renderEntities = memoize((signs, edit) => signs.flatMap(({ type, id, ...rest }) => {
  switch (type) {
    case objTypes.POLYGON: {
      const {fill, positions, alpha = 127} = rest
      // @TODO: make it stop rerendering
      const polygon = new PolygonGeometry({
        polygonHierarchy: new PolygonHierarchy(positions),
      })
      // @TODO: осветление цвета в утилиты!
      const fillColor = fromColorAlpha(fill, alpha)
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
    }
    case objTypes.SOPHISTICATED: {
      const { primitives, entities, ...entity } = rest
      if(entities) {
        if (isArray(entities)) {
          return entities.map((entity, ind) => <Entity key={`${id}${ind}`} onDoubleClick={edit(id)} {...entity}/>)
        } else {
          return <Entity key={id} onDoubleClick={edit(id)} {...entity}/>
        }
      }
      if(primitives) {
        const instances = {}
        if (isArray(primitives)) {
          instances.area = primitives.map((rest) => instanceSophisticated(rest, 'area')).filter(Boolean)
          instances.line = primitives.map((rest) => instanceSophisticated(rest, 'line')).filter(Boolean)
          console.log('inst', instances)
        } else {
          console.log('noArray')
          instances.area = instanceSophisticated(primitives, 'area')
          instances.line = instanceSophisticated(primitives, 'line')
        }
        const outInstances = []
        instances.line && outInstances.push(
            <GroundPolylinePrimitive
                key={`${id}line`}
                onDoubleClick={edit(id)}
                geometryInstances={instances.line}
                appearance={new PolylineColorAppearance()}
            />)
        instances.area && outInstances.push(
            <GroundPrimitive // Valid geometries are CircleGeometry, CorridorGeometry, EllipseGeometry, PolygonGeometry, and RectangleGeometry.
                key={`${id}area`}
                onDoubleClick={edit(id)}
                geometryInstances={instances.area}
            />)
        return outInstances
      }
      return <Entity key={id} onDoubleClick={edit(id)} {...entity}/>
    }
    case objTypes.CONTOUR: {
      return <GeoJsonDataSource key={id} {...rest}/>
    }
    default: {
      return <Entity key={id} onDoubleClick={edit(id)} {...rest}/>
    }
  }
}))

export default class SignsLayer extends Component {
  static propTypes = {
    objects: PropTypes.object,
    zoom: PropTypes.number.isRequired,
    setZoom: PropTypes.func.isRequired,
    editObject: PropTypes.func.isRequired,
    selected: PropTypes.array,
  }

  state = {
    signs: [],
  }

  componentDidMount () {
    const { objects } = this.props
    objects && objects.size && this.updateSigns(objects)
  }

  componentDidUpdate (prevProps) {
    const { objects, selected } = this.props
    if (objects !== prevProps.objects || selected !== prevProps.selected) {
      // @TODO: show, which objects are selected
      this.updateSigns(objects, selected)
    }
  }

  edit = (id) => this.props.editObject.bind(this, id)

  scene = React.createRef()

  updateSigns = async (objects, selected) => {
    const signs = await objectsToSvg(objects, this.positionHeightUp)
    // @TODO: show, which objects are selected
    this.setState({ signs })
  }

  checkZoom = () => {
    if (!this.scene.current) { return }
    const { zoom, setZoom } = this.props
    const camera = this.scene.current.cesiumElement.camera
    const cartographic = camera.positionCartographic
    const { latitude, height } = cartographic
    const currentZoom = zoom2height(latitude, null, height)
    currentZoom !== zoom && setZoom(currentZoom)
  }

  positionHeightUp = (position, value) => {
    if (!this.scene.current) { return position }
    const globe = this.scene.current.cesiumElement.globe
    const cartographic = Cartographic.fromCartesian(position)
    const height = globe.getHeight(cartographic) || 0
    return Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height + value)
  }

  render () {
    const { signs } = this.state
    const entities = renderEntities(signs, this.edit)
    return (
      <>
        <Scene ref={this.scene}>
          <Fog enabled={false}/>
        </Scene>
        <Globe depthTestAgainstTerrain={false}/>
        <Camera onMoveEnd={this.checkZoom}/>
        { entities }
      </>
    )
  }
}
