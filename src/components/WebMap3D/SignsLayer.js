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
  Cartesian2,
} from 'cesium'
import { Camera, Globe, Entity, GroundPrimitive, Scene, Fog, GeoJsonDataSource, GroundPolylinePrimitive } from 'resium'
import { isArray } from 'leaflet/src/core/Util'
import { objectsToSvg } from '../../utils/mapObjConvertor'
import objTypes from '../../components/WebMap/entityKind'
import { deg } from '../WebMap/patch/Sophisticated/utils'
import { ZOOMS_SCALES } from '../../constants'

// import * as mapColors from "../../constants/colors";

const fromColorAlpha = (color, alpha) => {
  const _color = ColorGeometryInstanceAttribute.fromColor(color)
  _color.value[3] = alpha
  return _color
}

const instanceSophisticated = (rest, vide) => {
  const { type, options, attributes } = rest
  let instance
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
      const { fill, positions, alpha = 127 } = rest
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
      if (entities) {
        if (isArray(entities)) {
          return entities.map((entity, ind) => <Entity key={`${id}${ind}`} onDoubleClick={edit(id)} {...entity}/>)
        } else {
          return <Entity key={id} onDoubleClick={edit(id)} {...entity}/>
        }
      }
      if (primitives) {
        const instances = {}
        if (isArray(primitives)) {
          instances.area = primitives.map((rest) => instanceSophisticated(rest, 'area')).filter(Boolean)
          instances.line = primitives.map((rest) => instanceSophisticated(rest, 'line')).filter(Boolean)
        } else {
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
    setCenter: PropTypes.func.isRequired,
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
    const { zoom, setZoom, setCenter } = this.props
    const camera = this.scene.current.cesiumElement.camera
    const canvas = this.scene.current.cesiumElement.canvas
    const ellipsoid = this.scene.current.cesiumElement.globe.ellipsoid
    const position = camera.positionCartographic
    const fovy = camera.frustum.fovy // угол обзора снизу вверх
    const { height } = position
    const magnitude = camera.getMagnitude()

    const radius = magnitude - height // радиус сферы
    const angle = Math.asin(radius / magnitude) // угол касательной от камеры к поверхности сферы
    const pitch = Math.PI / 2 + camera.pitch // угол наклона камеры
    const da = pitch + fovy / 2 - angle
    const k = (da < 0) ? 1 : (1 - da / fovy) // коэфициент уменьшения перекрытичя камеры сферой
    const pos = new Cartesian2(canvas.clientWidth / 2, canvas.clientHeight * (1 - k / 2))
    const pick = camera.pickEllipsoid(pos, ellipsoid) // геометрические координаты точки сцены карты

    // расчет масштаба
    let currentZoom = null
    const left = camera.pickEllipsoid(new Cartesian2(0, canvas.clientHeight), ellipsoid)
    const right = camera.pickEllipsoid(new Cartesian2(canvas.clientWidth, canvas.clientHeight), ellipsoid)
    if (left && right) {
      const distance = Cartesian3.distance(left, right)
      const screenResolution = 25.4 / (96 * window.devicePixelRatio) // отн.мм в пикселе
      const screenWidth = screenResolution * canvas.clientWidth // размер экрана в отн.мм
      const scaleMap = distance * 1000 / screenWidth
      // определить ближайший zoom
      let subS = Infinity
      for (const key in ZOOMS_SCALES) {
        const sub = Math.abs(ZOOMS_SCALES[key] - scaleMap)
        if (subS > sub) {
          subS = sub
          currentZoom = key
        }
      }
    }
    // расчет центра
    const center = pick ? Cartographic.fromCartesian(pick, ellipsoid) : null
    center && setCenter({ lng: deg(center.longitude), lat: deg(center.latitude) }, currentZoom)
    currentZoom && currentZoom !== zoom && setZoom(currentZoom)
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
