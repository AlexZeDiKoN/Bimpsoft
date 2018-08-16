/* global L */
import { Symbol } from '@DZVIN/milsymbol'

// const MilSymbolIcon = L.Layer.extend({
// options: {
//   // @section
//   // @aka DivIcon options
//   iconSize: [ 12, 12 ], // also can be set through CSS
//
//   // iconAnchor: (Point),
//   // popupAnchor: (Point),
//
//   // @option html: String = ''
//   // Custom HTML code to put inside the div element, empty by default.
//   code: 10000000000000000000,
//
//   // @option bgPos: Point = [0, 0]
//   // Optional relative position of the background, in pixels
//   bgPos: null,
//
//   className: 'leaflet-div-icon-z',
// },
//
// createIcon: function (oldIcon) {
//   const { code } = this.options
//   console.log('zzzz',this.options)
//   const symbol = new Symbol(code)
//   const svg = symbol.asDOM()
//   console.log(svg)
//
//   return svg
// },
//
// createShadow: function () {
//   return null
// },
// })
const MilSymbolIcon = L.Layer.extend({
  options: {
    code: '10000000000000000000',
    amplificators: {},
  },

  initialize: function (latlng, options) {

    L.Util.setOptions(this, options)
    this._latlng = L.latLng(latlng)
  },

  onAdd: function (map) {
    const { code, amplificators } = this.options

    var pane = map.getPane(this.options.pane)
    const symbol = new Symbol(code, { size: 42, ...amplificators })
    this._container = symbol.asDOM()

    pane.appendChild(this._container)

    // Calculate initial position of container with `L.Map.latLngToLayerPoint()`, `getPixelOrigin()` and/or `getPixelBounds()`
    this._update()
    this._initInteraction()

    // Add and position children elements if needed

    map.on('zoomend viewreset', this._update, this)
  },

  onRemove: function (map) {
    L.DomUtil.remove(this._container)
    map.off('zoomend viewreset', this._update, this)
  },

  _update: function () {
    // Recalculate position of container
    var pos = this._map.latLngToLayerPoint(this._latlng).round()
    L.DomUtil.setPosition(this._container, pos)

    // Add/remove/reposition children elements if needed
  },
  _initInteraction: function () {
    L.DomUtil.addClass(this._container, 'leaflet-interactive')

    this.addInteractiveTarget(this._container)

    // if (MarkerDrag) {
    //   var draggable = this.options.draggable
    //   if (this.dragging) {
    //     draggable = this.dragging.enabled()
    //     this.dragging.disable()
    //   }
    //
    //   this.dragging = new MarkerDrag(this)
    //
    //   if (draggable) {
    //     this.dragging.enable()
    //   }
    // }
  },
})
export default MilSymbolIcon
