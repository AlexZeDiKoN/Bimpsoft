import React from 'react'
import {
  // CesiumTerrainProvider, @TODO: decomment as soon as we have working server for getting terrains
  Cartesian3, KeyboardEventModifier, HeightReference, VerticalOrigin, CameraEventType, UrlTemplateImageryProvider,
} from 'cesium'
import { Viewer, Scene, Globe, Fog, CameraFlyTo, ScreenSpaceCameraController, Entity, BillboardGraphics } from 'resium'
import PropTypes from 'prop-types'
import memoize from 'memoize-one'
import { Symbol } from '@DZVIN/milsymbol'
import { model } from '@DZVIN/MilSymbolEditor'

const imageryProvider = new UrlTemplateImageryProvider({
  url: 'http://10.8.26.153:8001/bing/{z}/{x}/{y}.webp',
  hasAlphaChannel: false,
  maximumLevel: 14,
  enablePickFeatures: false,
})

// @TODO: decomment as soon as works
// const terrainProvider = new CesiumTerrainProvider({
//   url: 'http://10.8.26.153:8000/tilesets/terrain_data/',
// })

const zoom2height = (zoom) => {
  const A = 40487.57
  const B = 0.00007096758
  const C = 91610.74
  const D = -40467.74
  return C * Math.pow((A - D) / (zoom - D) - 1, 1 / B)
}

const buildSVG = (data) => {
  const { code = '', attributes } = data
  const symbol = new Symbol(code, { ...model.parseAmplifiersConstants(attributes), size: 18 })
  return symbol.asSVG()
}

const objectsToSvg = memoize((list) => list.reduce((acc, o) => {
  if (o.type === 1) {
    const { point: { lat, lng }, id } = o
    const svg = buildSVG(o)
    const base64 = 'data:image/svg+xml;base64,' + window.btoa(svg)
    acc.push(<Entity position={Cartesian3.fromDegrees(lng, lat)} key={id}>
      <BillboardGraphics
        image={base64}
        heightReference={HeightReference.CLAMP_TO_GROUND}
        verticalOrigin={VerticalOrigin.BOTTOM}
      />
    </Entity>)
  }
  return acc
}, []))

export default class WebMap3D extends React.PureComponent {
    static propTypes = {
      children: PropTypes.any,
      // from Redux store
      center: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }).isRequired,
      zoom: PropTypes.number.isRequired,
      objects: PropTypes.object,
    }

    render () {
      const { objects, center, zoom } = this.props
      const signs = objectsToSvg(objects)
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
          // terrainProvider={terrainProvider}
          creditContainer={document.createElement('div')}
          creditViewport={document.createElement('div')}
        >
          <Scene>
            <Fog enabled={false}/>
          </Scene>
          <Globe depthTestAgainstTerrain={false}/>
          <CameraFlyTo duration={0} destination={Cartesian3.fromDegrees(center.lng, center.lat, zoom2height(zoom))} />
          {signs}
          <ScreenSpaceCameraController
            tiltEventTypes={
              CameraEventType.RIGHT_DRAG
            }
            lookEventTypes={[
              CameraEventType.MIDDLE_DRAG,
              { eventType: CameraEventType.LEFT_DRAG, modifier: KeyboardEventModifier.SHIFT },
            ]}
            rotateEventTypes={
              CameraEventType.LEFT_DRAG
            }
            zoomEventTypes={[
              CameraEventType.WHEEL,
              { eventType: CameraEventType.LEFT_DRAG, modifier: KeyboardEventModifier.CTRL },
            ]}
          />
        </Viewer>
      )
    }
}
