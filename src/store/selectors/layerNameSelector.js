import { createSelector } from 'reselect'

export const layerNameSelector = createSelector(
  (state) => state.layers,
  (state) => state.maps,
  (layers, maps) => {
    const { byId, selectedId } = layers
    if (selectedId === null) {
      return ''
    }
    const layer = byId[selectedId]
    if (!layer) {
      return ''
    }

    const map = maps.byId[layer.mapId]
    if (!map) {
      return layer.name
    }
    return `${map.name} / ${layer.name}`
  }
)

export const mapNameSelector = createSelector(
  (state) => state.layers,
  (state) => state.maps,
  (layers, maps) => {
    const { byId, selectedId } = layers

    if (selectedId === null) {
      return ''
    }

    const layer = byId[selectedId]
    if (!layer) {
      return ''
    }

    const map = maps.byId[layer.mapId]
    if (!map) {
      return ''
    }

    return map.name
  }
)
