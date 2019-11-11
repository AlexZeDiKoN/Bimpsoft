import { getNextLayerIdInSelectedMap, getNextLayerIdInNextMap, getNextLayerId } from './layers'

const allLayersById = {
  layer1_1: {
    layerId: 'layer1_1',
    mapId: 'map1',
  },
  layer1_2: {
    layerId: 'layer1_2',
    mapId: 'map1',
  },
  layer1_3: {
    layerId: 'layer1_3',
    mapId: 'map1',
  },
  layer1_4: {
    layerId: 'layer1_4',
    mapId: 'map1',
  },
  layer2_1: {
    layerId: 'layer2_1',
    mapId: 'map2',
  },
  layer2_2: {
    layerId: 'layer2_2',
    mapId: 'map2',
  },
}

describe('getNextLayerIdInSelectedMap', () => {
  it('should return next layer id in selected map', () => {
    expect(getNextLayerIdInSelectedMap(allLayersById, 'layer1_2')).toBe('layer1_3')
  })

  it('should support exclude predicate', () => {
    const nextLayerId = getNextLayerIdInSelectedMap(
      allLayersById,
      'layer1_2',
      (layer) => layer.layerId === 'layer1_3' || layer.layerId === 'layer1_4',
    )
    expect(nextLayerId).toBe('layer1_1')
  })

  it(`should return next layer from the start of layers in selected map if there is no layers towards current one`, () => {
    expect(getNextLayerIdInSelectedMap(allLayersById, 'layer1_4')).toBe('layer1_1')
  })

  it('should return null if there is no currently selected layer', () => {
    expect(getNextLayerIdInSelectedMap(allLayersById, null)).toBe(null)
  })

  it('should return null if there is no next layer in selected map', () => {
    const allLayersById = {
      layer1_1: {
        layerId: 'layer1_1',
        mapId: 'map1',
      },
      layer2_1: {
        layerId: 'layer2_1',
        mapId: 'map2',
      },
      layer2_2: {
        layerId: 'layer2_2',
        mapId: 'map2',
      },
    }
    expect(getNextLayerIdInSelectedMap(allLayersById, 'layer1_1')).toBe(null)
  })
})

describe('getNextLayerIdInNextMap', () => {
  it('should return next layer in next map', () => {
    expect(getNextLayerIdInNextMap(allLayersById, 'layer1_2')).toBe('layer2_1')
  })

  it('should support exclude predicate', () => {
    const nextLayerId = getNextLayerIdInNextMap(
      allLayersById,
      'layer1_2',
      (layer) => layer.layerId === 'layer2_1',
    )
    expect(nextLayerId).toBe('layer2_2')
  })

  it('should return null if there is no next layer in next map', () => {
    const nextLayerId = getNextLayerIdInNextMap(
      allLayersById,
      'layer1_2',
      (layer) => layer.layerId === 'layer2_1' || layer.layerId === 'layer2_2',
    )
    expect(nextLayerId).toBe(null)
  })

  it('should return layer from the start of the maps if there is no available at the end', () => {
    const allLayersById = {
      layer1_1: {
        layerId: 'layer1_1',
        mapId: 'map1',
      },
      layer2_1: {
        layerId: 'layer2_1',
        mapId: 'map2',
      },
      layer3_1: {
        layerId: 'layer3_1',
        mapId: 'map3',
      },
    }

    const nextLayerId = getNextLayerIdInNextMap(
      allLayersById,
      'layer2_2',
      (layer) => layer.layerId === 'layer3_1',
    )
    expect(nextLayerId).toBe('layer1_1')
  })
})

describe('getNextLayerId', () => {
  it('should return next layer id in current map if available', () => {
    expect(getNextLayerId(allLayersById, 'layer1_2')).toBe('layer1_3')
  })

  it('should support custom exclude predicate', () => {
    const allLayersById = {
      layer1_1: {
        layerId: 'layer1_1',
        mapId: 'map1',
      },
      layer1_2: {
        layerId: 'layer1_2',
        mapId: 'map1',
      },
      layer1_3: {
        layerId: 'layer1_3',
        mapId: 'map1',
      },
    }
    const nextLayerId = getNextLayerId(allLayersById, 'layer1_1', (l) => l.layerId === 'layer1_2')
    expect(nextLayerId).toBe('layer1_3')
  })

  it('should return next layer in next map if there is no available layers in current map', () => {
    const allLayersById = {
      layer1_1: {
        layerId: 'layer1_1',
        mapId: 'map1',
      },
      layer1_2: {
        layerId: 'layer1_2',
        mapId: 'map1',
      },
      layer2_1: {
        layerId: 'layer2_1',
        mapId: 'map2',
      },
    }
    const nextLayerId = getNextLayerId(allLayersById, 'layer1_1', (l) => l.layerId === 'layer1_2')
    expect(nextLayerId).toBe('layer2_1')
  })

  it('should return null if there is no any available layer', () => {
    const allLayersById = {
      layer1_1: {
        layerId: 'layer1_1',
        mapId: 'map1',
      },
      layer2_1: {
        layerId: 'layer2_1',
        mapId: 'map2',
      },
    }
    const nextLayerId = getNextLayerId(allLayersById, 'layer1_1', (l) => l.layerId === 'layer2_1')
    expect(nextLayerId).toBe(null)
  })
})
