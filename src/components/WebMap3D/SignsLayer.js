import React, { Component } from 'react'
import PropTypes from 'prop-types'
import memoize from 'memoize-one'
import {
  Cartographic, Cartesian3, PolygonGeometry,
  GeometryInstance, ColorGeometryInstanceAttribute, PolygonHierarchy,
} from 'cesium'
import { Camera, Globe, Entity, GroundPrimitive, Scene, Fog, GeoJsonDataSource } from 'resium'
import { zoom2height, objectsToSvg } from '../../utils/mapObjConvertor'
import objTypes from '../../components/WebMap/entityKind'

const renderEntities = memoize((signs, edit) => signs.map(({ type, id, ...rest }) => {
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
    return <Entity key={id} onDoubleClick={edit(id)} { ...rest }/>
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
