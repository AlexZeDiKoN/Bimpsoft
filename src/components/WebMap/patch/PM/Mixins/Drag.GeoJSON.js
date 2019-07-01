import L, { point } from 'leaflet'

const DragMixin = {
  enableLayerDrag () {
    this._tempDragPoint = null
    this._dragStartPoint = null
    this._dragEndPoint = null
    this._addRemoveClass('add', 'draggable')
    this._originalMapDragState = this._layer._map.dragging._enabled
    this._safeToCacheDragState = true
    this._layer.on('mousedown', this._dragMixinOnMouseDown, this)
  },

  disableLayerDrag () {
    this._addRemoveClass('remove', 'draggable')
    this._safeToCacheDragState = false
    this._layer.off('mousedown', this._dragMixinOnMouseDown, this)
  },

  _dragMixinOnMouseUp () {
    if (this._originalMapDragState) {
      this._layer._map.dragging.enable()
    }
    this._safeToCacheDragState = true
    this._layer._map.off('mousemove', this._dragMixinOnMouseMove, this)
    this._layer.off('mouseup', this._dragMixinOnMouseUp, this)
    if (!this._dragging) {
      return false
    }
    this._layer._dragDeltaPx = point(
      this._dragEndPoint.x - this._dragStartPoint.x,
      this._dragEndPoint.y - this._dragStartPoint.y,
    )

    // timeout to prevent click event after drag :-/
    // TODO: do it better as soon as leaflet has a way to do it better :-)
    window.setTimeout(() => {
      this._dragging = false
      this._addRemoveClass('remove', 'dragging')
      this._layer.fire('pm:dragend')
      this._fireEdit()
    }, 10)

    return true
  },

  _dragMixinOnMouseMove (e) {
    if (!this._dragging) {
      this._dragging = true
      this._addRemoveClass('add', 'dragging')
      this._layer.bringToFront()
      if (this._originalMapDragState) {
        this._layer._map.dragging.disable()
      }
      this._layer.fire('pm:dragstart')
    }
    this._onLayerDrag(e)
  },

  _dragMixinOnMouseDown (e) {
    // cancel if mouse button is NOT the left button
    if (e.originalEvent.button > 0) {
      return
    }
    if (this._safeToCacheDragState) {
      this._originalMapDragState = this._layer._map.dragging._enabled
      this._safeToCacheDragState = false
    }
    this._tempDragPoint = e.containerPoint
    this._dragStartPoint = e.containerPoint
    this._layer.on('mouseup', this._dragMixinOnMouseUp, this)
    this._layer._map.on('mousemove', this._dragMixinOnMouseMove, this)
  },

  dragging () {
    return this._dragging
  },

  _onLayerDrag (e) {
    const { containerPoint } = e
    const delta = {
      x: containerPoint.x - this._tempDragPoint.x,
      y: containerPoint.y - this._tempDragPoint.y,
    }
    this._layer.eachLayer((layer) => {
      const shiftOne = (latLng) => {
        const f = this._layer._map.project(latLng)
        const x = f.x + delta.x
        const y = f.y + delta.y
        return this._layer._map.unproject(point({ x, y }))
      }
      const shift = (coords) => Array.isArray(coords)
        ? coords.map(shift)
        : shiftOne(coords)
      if (layer.getLatLngs && layer.setLatLngs) {
        const shifted = shift(layer.getLatLngs())
        layer.setLatLngs(shifted).redraw()
      } else if (layer.getLatLng && layer.setLatLng) {
        const shifted = shift(layer.getLatLng())
        layer.setLatLng(shifted).redraw()
      } else {
        console.warn(layer)
      }
    })
    this._tempDragPoint = containerPoint
    this._dragEndPoint = containerPoint
    this._layer.fire('pm:drag')
  },

  _addRemoveClass (method, className) {
    this._layer && this._layer.eachLayer((layer) =>
      layer._path && L.DomUtil[`${method}Class`](layer._path, `leaflet-pm-${className}`))
  },
}

export default DragMixin
