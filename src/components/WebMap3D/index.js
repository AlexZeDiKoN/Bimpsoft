import React from 'react'
import {
  CesiumTerrainProvider, Cartesian3, KeyboardEventModifier,
  CameraEventType, UrlTemplateImageryProvider, TrustedServers,
} from 'cesium'
import memoize from 'memoize-one'
import { Viewer, Scene, Fog, CameraFlyTo, ScreenSpaceCameraController, ImageryLayer } from 'resium'
import PropTypes from 'prop-types'
import { zoom2height, fixTilesUrl } from '../../utils/mapObjConvertor'
import * as MapModes from '../../constants/MapModes'
import SignsLayer from './SignsLayer'

const imageryProviderStableProps = {
  hasAlphaChannel: false,
  maximumLevel: 14,
  enablePickFeatures: false,
}

const MIN_ZOOM = zoom2height(5)
const DIV = document.createElement('div')

const buildImageryProvider = memoize((url) => {
  const provider = new UrlTemplateImageryProvider({ url, ...imageryProviderStableProps })
  provider.errorEvent.addEventListener(() => {}) // Remove console log on missing tile
  return provider
})

export default class WebMap3D extends React.PureComponent {
    static propTypes = {
      center: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }).isRequired,
      zoom: PropTypes.number.isRequired,
      mode: PropTypes.any,
      objects: PropTypes.object,
      sources: PropTypes.array,
      source: PropTypes.object,
      setZoom: PropTypes.func.isRequired,
      setSource: PropTypes.func.isRequired,
      setMapMode: PropTypes.func.isRequired,
    }

    componentDidMount () {
      const { protocol, host, port } = new URL(process.env.REACT_APP_TILES)
      TrustedServers.add(host, port || { 'http:': 80, 'https:': 443 }[protocol])
      const { sources, mode, setMapMode } = this.props
      mode && setMapMode(MapModes.NONE)
      const terrainSource = sources.find(({ isTerrain }) => isTerrain) // Source with param isTerrain set to true
      const { source: url } = terrainSource || {}
      url && (this.terrainProvider = new CesiumTerrainProvider({ url: fixTilesUrl(url) }))
      // @TODO: delete sources[1]
      const defaultSource = sources.find(({ isSatellite }) => isSatellite) || sources[1] // Source with param isSatellite set to true is a satellite view
      defaultSource && this.props.setSource(defaultSource)
    }

    shouldFly = true

    stopAutoMove = () => (this.shouldFly = false)

    getImageryProvider = () => {
      const { source } = this.props
      if (source && source.sources) {
        const { sources } = this.props.source
        const satSource = sources.find(({ isSat }) => isSat)
        const { tms, source: url = '' } = satSource || {}
        const sourceURL = fixTilesUrl(tms ? url.replace(/{y}/g, '{reverseY}') : url)
        return buildImageryProvider(sourceURL)
      }
      return false
    }

    // @TODO: remove terrainExaggeration after test
    render () {
      const { objects, center, zoom, setZoom } = this.props
      const imageryProvider = this.getImageryProvider()
      return imageryProvider
        ? (
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
            imageryProvider={false}
            terrainProvider={this.terrainProvider}
            creditContainer={DIV}
            creditViewport={DIV}
            terrainExaggeration={2}
          >
            <ImageryLayer imageryProvider={imageryProvider} />
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
              tiltEventTypes={[
                CameraEventType.RIGHT_DRAG,
                CameraEventType.PINCH,
              ]}
              rotateEventTypes={CameraEventType.LEFT_DRAG}
              lookEventTypes={[
                CameraEventType.MIDDLE_DRAG,
                { eventType: CameraEventType.LEFT_DRAG, modifier: KeyboardEventModifier.SHIFT },
              ]}
              zoomEventTypes={[
                CameraEventType.WHEEL,
                CameraEventType.PINCH,
                { eventType: CameraEventType.LEFT_DRAG, modifier: KeyboardEventModifier.CTRL },
              ]}
            />
          </Viewer>
        )
        : null
    }
}
