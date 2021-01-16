import React from 'react'
import {
  CesiumTerrainProvider,
  Cartesian3,
  KeyboardEventModifier,
  ScreenSpaceEventType,
  CameraEventType,
  UrlTemplateImageryProvider,
  TrustedServers,
  Rectangle,
} from 'cesium'
import memoize from 'memoize-one'
import {
  Viewer,
  CameraFlyTo,
  ScreenSpaceCameraController,
  ImageryLayer,
  ScreenSpaceEventHandler,
  ScreenSpaceEvent,
  ImageryLayerCollection,
} from 'resium'
import PropTypes from 'prop-types'
import { zoom2height, fixTilesUrl } from '../../utils/mapObjConvertor'
import * as MapModes from '../../constants/MapModes'
import SignsLayer from './SignsLayer'
import './webMap3D.css'

const imageryProviderStableProps = {
  maximumLevel: 14,
  enablePickFeatures: false,
}

const MIN_ZOOM = zoom2height(0, 16)
const MAX_ZOOM = zoom2height(0, 5)
const DIV = document.createElement('div')

const getImageryLayers = memoize((sources) => {
  if (!sources) { return }
  return sources.filter(({ isSat }) => isSat).map((value, idx) => {
    const { tms, source: url = '' } = value || {}
    const hasAlphaChannel = idx > 0
    const provider = new UrlTemplateImageryProvider({
      url: fixTilesUrl(tms ? url.replace(/{y}/g, '{reverseY}') : url),
      hasAlphaChannel,
      ...imageryProviderStableProps,
    })
    provider.errorEvent.addEventListener(() => {}) // Remove console log on missing tile
    return <ImageryLayer key={idx} imageryProvider={provider}/>
  })
})

export default class WebMap3D extends React.PureComponent {
    static propTypes = {
      center: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }).isRequired,
      zoom: PropTypes.number.isRequired,
      boundsMap: PropTypes.object,
      mode: PropTypes.any,
      objects: PropTypes.object,
      sources: PropTypes.array,
      selected: PropTypes.array,
      source: PropTypes.object,
      setZoom: PropTypes.func.isRequired,
      setCenter: PropTypes.func.isRequired,
      setSource: PropTypes.func.isRequired,
      setMapMode: PropTypes.func.isRequired,
      editObject: PropTypes.func.isRequired,
    }

    componentDidMount () {
      if (process.env.REACT_APP_TILES) {
        const { protocol, host, port } = new URL(process.env.REACT_APP_TILES)
        TrustedServers.add(host, port || { 'http:': 80, 'https:': 443 }[protocol])
      }
      const { source, sources, mode, setMapMode } = this.props
      mode && setMapMode(MapModes.NONE)
      const terrainSource = sources.find(({ isTerrain }) => isTerrain) // Source with param isTerrain set to true
      const { source: url } = terrainSource || {}
      if (url) {
        this.terrainProvider = new CesiumTerrainProvider({ url: fixTilesUrl(url) })
        this.terrainProvider.errorEvent.addEventListener(() => {}) // Remove console log on missing tile
      }
      const { isSatellite } = sources.find(({ title }) => title === source.title)
      const defaultSource = isSatellite ? source
        : sources.find(({ isSatellite }) => isSatellite) // Source with param isSatellite set to true is a satellite view
      defaultSource && this.props.setSource(defaultSource)
    }

    render () {
      const {
        objects,
        center,
        zoom,
        setZoom,
        setCenter,
        selected,
        editObject,
        source: { sources },
        boundsMap,
      } = this.props
      const imageryLayers = getImageryLayers(sources)
      return imageryLayers
        ? (
          <Viewer
            className={'map3D_container'}
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
          >
            <ImageryLayerCollection>
              {imageryLayers}
            </ImageryLayerCollection>
            <CameraFlyTo
              maximumHeight={MAX_ZOOM}
              duration={0}
              destination={ boundsMap
                ? Rectangle.fromDegrees(
                  boundsMap.getWest(),
                  boundsMap.getSouth(),
                  boundsMap.getEast(),
                  boundsMap.getNorth())
                : Cartesian3.fromDegrees(center.lng, center.lat, zoom2height(center.lat, zoom))}
              once={true}
            />
            <SignsLayer
              objects={objects}
              zoom={zoom}
              setZoom={setZoom}
              setCenter={setCenter}
              selected={selected}
              editObject={editObject}
            />
            <ScreenSpaceEventHandler useDefault={true} >
              <ScreenSpaceEvent type={ScreenSpaceEventType.LEFT_DOUBLE_CLICK} />
            </ScreenSpaceEventHandler>
            <ScreenSpaceCameraController
              minimumZoomDistance={MIN_ZOOM}
              maximumZoomDistance={MAX_ZOOM}
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
