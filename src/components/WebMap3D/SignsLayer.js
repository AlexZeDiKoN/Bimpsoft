import React, { Component } from 'react'
import PropTypes from 'prop-types'
import memoize from 'memoize-one'
import {
  Cartographic, Cartesian3, PolygonGeometry, SceneMode,
  GeometryInstance, ColorGeometryInstanceAttribute, PolygonHierarchy,
} from 'cesium'
import { Camera, Globe, Entity, GroundPrimitive, Scene, Fog, GeoJsonDataSource } from 'resium'
import { zoom2height, objectsToSvg } from '../../utils/mapObjConvertor'
import objTypes from '../../components/WebMap/entityKind'

const renderEntities = memoize((signs) => signs.map(({ type, id, ...rest }) => {
  if (type === objTypes.POLYGON) {
    const { fill, positions } = rest
    // @TODO: make it stop rerendering
    const polygon = new PolygonGeometry({
      polygonHierarchy: new PolygonHierarchy(positions),
    })
    // @TODO: осветление цвета в утилиты!
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
  } else if (type === objTypes.CONTOUR) {
    return <GeoJsonDataSource key={id} { ...rest }/>
  } else {
    return <Entity key={id} { ...rest }/>
  }
}))

// @TODO: in constants
const MIN_PITCH = -Math.PI / 2
const MAX_PITCH = 0
const MIN_HEIGHT = 200

export default class SignsLayer extends Component {
  static propTypes = {
    objects: PropTypes.object,
    zoom: PropTypes.number.isRequired,
    setZoom: PropTypes.func.isRequired,
  }

  state = {
    signs: [],
  }

  componentDidMount () {
    const { objects } = this.props
    objects && objects.size && this.updateSigns(objects)
  }

  componentDidUpdate (prevProps) {
    const { objects } = this.props
    this.updateSigns(objects, prevProps.objects)
  }

  scene = React.createRef()

  updateSigns = async (objects, prevObjects) => {
    if (objects !== prevObjects) {
      const signs = await objectsToSvg(objects, this.positionHeightUp)
      this.setState({ signs })
    }
  }

  checkZoom = () => {
    this.fixCameraUnderground()
    if (!this.scene.current) { return }
    const { zoom, setZoom } = this.props
    const camera = this.scene.current.cesiumElement.camera
    const cartographic = Cartographic.fromCartesian(camera.position)
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

  fixCameraUnderground = () => {
    if (!this.scene.current) { return }
    const scene = this.scene.current.cesiumElement
    const camera = scene.camera
    if (camera._suspendTerrainAdjustment && scene.mode === SceneMode.SCENE3D) {
      camera._suspendTerrainAdjustment = false
      camera._adjustHeightForTerrain()
    }
    let pitch = camera.pitch
    if (pitch > MAX_PITCH || pitch < MIN_PITCH) {
      scene.screenSpaceCameraController.enableTilt = false

      // clamp the pitch
      if (pitch > MAX_PITCH) {
        pitch = MAX_PITCH
      } else if (pitch < MIN_PITCH) {
        pitch = MIN_PITCH
      }

      const destination = Cartesian3.fromRadians(
        camera.positionCartographic.longitude,
        camera.positionCartographic.latitude,
        Math.max(camera.positionCartographic.height, MIN_HEIGHT))

      camera.setView({
        destination: destination,
        orientation: { pitch },
      })
      scene.screenSpaceCameraController.enableTilt = true
    }
  }

  render () {
    const { signs } = this.state
    const entities = renderEntities(signs)
    return (
      <>
        <Scene ref={this.scene}>
          <Fog enabled={false}/>
        </Scene>
        <Globe depthTestAgainstTerrain={false}/>
        <Camera onMoveEnd={this.checkZoom} onChange={this.fixCameraUnderground}/>
        { entities }
      </>
    )
  }
}
