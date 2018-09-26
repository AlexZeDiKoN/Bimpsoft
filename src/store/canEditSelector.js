import { createSelector } from 'reselect'
import { viewModesKeys } from '../constants'

export const canEditCurrentLayerSelector = createSelector(
  (state) => state.layers,
  (layers) => {
    const { byId, selectedId } = layers
    const layer = byId[selectedId]
    return Boolean(layer && !layer.readOnly)
  }
)

export const canEditSelector = createSelector(
  canEditCurrentLayerSelector,
  (state) => state.viewModes,
  (canEditCurrentLayer, viewModes) => canEditCurrentLayer && viewModes[viewModesKeys.edit]
)
