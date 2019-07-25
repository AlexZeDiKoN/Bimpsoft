import React from "react";
import { UrlTemplateImageryProvider, CesiumTerrainProvider, Cartesian3, CameraEventType, KeyboardEventModifier } from "cesium"
import { Viewer, Scene, Globe, Fog, CameraFlyTo, ScreenSpaceCameraController } from "resium"
import PropTypes from "prop-types";

const imageryProvider = new UrlTemplateImageryProvider({
    url: "http://10.8.26.153:8001/bing/{z}/{x}/{y}.webp",
    hasAlphaChannel: false,
    maximumLevel: 14,
    enablePickFeatures: false,
})

const terrainProvider = new CesiumTerrainProvider({
    url: "http://10.8.26.153:8000/tilesets/terrain_data/",
})

const zoom2height = (zoom) => {
    const A = 40487.57;
    const B = 0.00007096758;
    const C = 91610.74;
    const D = -40467.74;
    return C * Math.pow((A-D)/(zoom-D) -1, 1/B);
}

export default class WebMap3D extends React.PureComponent {

    static propTypes = {
        children: PropTypes.any,
        // from Redux store
        center: PropTypes.shape({
            lat: PropTypes.number,
            lng: PropTypes.number,
        }).isRequired,
        zoom: PropTypes.number.isRequired
    }

    render() {
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
                creditContainer={document.createElement('div')}
                creditViewport={document.createElement('div')}
            >
                <Scene>
                    <Fog enabled={false}/>>
                </Scene>
                <Globe depthTestAgainstTerrain={false}/>
                <CameraFlyTo duration={0} destination={Cartesian3.fromDegrees(
                    this.props.center.lng,
                    this.props.center.lat,
                    zoom2height(this.props.zoom)
                )} />
                <ScreenSpaceCameraController
                    tiltEventTypes={
                        CameraEventType.RIGHT_DRAG
                    }
                    lookEventTypes={[
                        CameraEventType.MIDDLE_DRAG,
                        {eventType : CameraEventType.LEFT_DRAG, modifier : KeyboardEventModifier.SHIFT}
                    ]}
                    rotateEventTypes={
                        CameraEventType.LEFT_DRAG
                    }
                    zoomEventTypes={[
                        CameraEventType.WHEEL,
                        {eventType : CameraEventType.LEFT_DRAG, modifier : KeyboardEventModifier.CTRL}
                    ]}
                />
            </Viewer>
        )
    }
}
