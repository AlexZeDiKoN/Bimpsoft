import React from 'react'
import {
  CesiumTerrainProvider, Cartesian3, KeyboardEventModifier,
  CameraEventType, UrlTemplateImageryProvider,
} from 'cesium'
import { Viewer, Scene, Globe, Fog, CameraFlyTo, ScreenSpaceCameraController } from 'resium'
import PropTypes from 'prop-types'
import { zoom2height } from '../../utils/mapObjConvertor'
import SignsLayer from './SignsLayer'

const imageryProvider = new UrlTemplateImageryProvider({
  url: 'http://10.8.26.153:8000/bing/{z}/{x}/{y}.png',
  hasAlphaChannel: false,
  maximumLevel: 14,
  enablePickFeatures: false,
})

const terrainProvider = new CesiumTerrainProvider({
  url: 'http://10.8.26.153:8000/terrain/',
})

const MAX_ZOOM = zoom2height(14)
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
    }

    shouldFly = true

    stopAutoMove = () => (this.shouldFly = false)

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
        >
          <Scene>
            <Fog enabled={false}/>
          </Scene>
          <Globe depthTestAgainstTerrain={false}/>
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
            minimumZoomDistance={MAX_ZOOM}
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
