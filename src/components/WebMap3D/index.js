import React from 'react'
import {
  CesiumTerrainProvider, Cartesian3, KeyboardEventModifier,
  CameraEventType, UrlTemplateImageryProvider,
} from 'cesium'
import { Viewer, Scene, Fog, CameraFlyTo, ScreenSpaceCameraController } from 'resium'
import PropTypes from 'prop-types'
import { zoom2height } from '../../utils/mapObjConvertor'
import SignsLayer from './SignsLayer'

const imageryProviderStableProps = {
  hasAlphaChannel: false,
  maximumLevel: 14,
  enablePickFeatures: false,
}

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
      sources: PropTypes.array,
      source: PropTypes.object,
      setZoom: PropTypes.func.isRequired,
      setSource: PropTypes.func.isRequired,
    }

    componentDidMount () {
      const { sources } = this.props
      const terrainSource = sources.find(({ isTerrain }) => isTerrain) // Source with param istERRAIN set to true
      const { source: url } = terrainSource || {}
      url && (this.terrainProvider = new CesiumTerrainProvider({ url }))
      const defaultSource = sources.find(({ isSatellite }) => isSatellite) || sources[1] // Source with param isSatellite set to true is a satellite view
      this.props.setSource(defaultSource)
    }

    shouldFly = true

    stopAutoMove = () => (this.shouldFly = false)

    // @TODO: remove terrainExaggeration after test
    render () {
      const { objects, center, zoom, setZoom, source } = this.props
      const { sources = [] } = source || {}
      const satSource = sources.find(({ isSat }) => isSat)
      const { tms, source: url = '' } = satSource || {}
      const sourceURL = tms ? url.replace(/{y}/g, '{reverseY}') : url
      const imageryProvider = new UrlTemplateImageryProvider({ url: sourceURL, ...imageryProviderStableProps })
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
          terrainProvider={this.terrainProvider}
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
