import React from 'react'
import {
  CesiumTerrainProvider, Cartesian3, KeyboardEventModifier,
  CameraEventType, UrlTemplateImageryProvider, TrustedServers,
} from 'cesium'
import { Viewer, Scene, Fog, CameraFlyTo, ScreenSpaceCameraController } from 'resium'
import PropTypes from 'prop-types'
import { zoom2height } from '../../utils/mapObjConvertor'
import SignsLayer from './SignsLayer'

TrustedServers.add('172.16.97.17', '80')

const imageryProvider = new UrlTemplateImageryProvider({
  url: 'http://172.16.97.17/tiles/sat/{z}/{x}/{reverseY}.jpg',
  hasAlphaChannel: false,
  maximumLevel: 14,
  enablePickFeatures: false,
})

const terrainProvider = new CesiumTerrainProvider({
  url: 'http://172.16.97.17/tiles/terrain/',
})

// const MAX_ZOOM = zoom2height(14)
const MIN_ZOOM = zoom2height(5)
const DIV = document.createElement('div')

export default class WebMap3D extends React.PureComponent {
    static propTypes = {
      center: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }).isRequired,
      zoom: PropTypes.number.isRequired,
      objects: PropTypes.object,
      setZoom: PropTypes.func.isRequired,
      setSatelliteSource: PropTypes.func.isRequired,
    }

    componentDidMount () {
      this.props.setSatelliteSource()
    }

    shouldFly = true

    stopAutoMove = () => (this.shouldFly = false)

    // @TODO: remove terrainExaggeration after test
    render () {
      const { objects, center, zoom, setZoom } = this.props
      return (
        <Viewer
          animation={false}
          baseLayerPicker={false}
          fullscreenButton={false}
          vrButton={false}
          geocoder={false}
          homeButton={false}
          infoBox={false}
          sceneModePicker={false}
          selectionIndicator={false}
          timeline={false}
          navigationHelpButton={false}
          navigationInstructionsInitiallyVisible={false}
          scene3DOnly={true}
          imageryProvider={imageryProvider}
          terrainProvider={terrainProvider}
          creditContainer={DIV}
          creditViewport={DIV}
          terrainExaggeration={2}
        >
          <Scene>
            <Fog enabled={false}/>
          </Scene>
          {this.shouldFly &&
            <CameraFlyTo
              maximumHeight={MIN_ZOOM}
              duration={0}
              destination={Cartesian3.fromDegrees(center.lng, center.lat, zoom2height(zoom))}
              onComplete={this.stopAutoMove}
            />
          }
          <SignsLayer
            objects={objects}
            zoom={zoom}
            setZoom={setZoom}
          />
          <ScreenSpaceCameraController
            maximumZoomDistance={MIN_ZOOM}
            tiltEventTypes={CameraEventType.RIGHT_DRAG}
            rotateEventTypes={CameraEventType.LEFT_DRAG}
            lookEventTypes={[
              CameraEventType.MIDDLE_DRAG,
              { eventType: CameraEventType.LEFT_DRAG, modifier: KeyboardEventModifier.SHIFT },
            ]}
            zoomEventTypes={[
              CameraEventType.WHEEL,
              { eventType: CameraEventType.LEFT_DRAG, modifier: KeyboardEventModifier.CTRL },
            ]}
          />
        </Viewer>
      )
    }
}
