import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Cartographic } from 'cesium'
import { Camera } from 'resium'
import { zoom2height, objectsToSvg } from '../../utils/mapObjConvertor'

export default class SignsLayer extends Component {
  static propTypes = {
    objects: PropTypes.object,
    zoom: PropTypes.number.isRequired,
    setZoom: PropTypes.func.isRequired,
  }

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

  camera = React.createRef()

  render () {
    const { objects } = this.props
    const signs = objectsToSvg(objects)
    return (
      <>
        <Camera ref={this.camera} onMoveEnd={this.checkZoom}/>
        { signs }
      </>
    )
  }
}
