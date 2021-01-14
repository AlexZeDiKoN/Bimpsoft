const REBUILD_TIMEOUT = 500

export default class Generalization {
  constructor (map) {
    this.map = map
    this.map.on('layeradd', this.layerAddHandler)
    this.map.on('layerremove', this.layerRemoveHandler)
    this.map.on('zoomstart', this.pause)
    this.map.on('zoomend', this.resume)
    this.map.on('movestart', this.pause)
    this.map.on('moveend', this.resume)
    this.timer = null
    this.layers = []
    this.domains = []
  }

  force () {
    this.resume()
  }

  pause = () => {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  resume = () => {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(this.processRebuildGroups, REBUILD_TIMEOUT)
  }

  layerAddHandler = ({ layer }) => {
    if (layer.options.generalizable) {
      this.layers.push(layer)
      this.resume()
    }
  }

  layerRemoveHandler = ({ layer }) => {
    const idx = this.layers.indexOf(layer)
    if (idx >= 0) {
      this.layers.splice(idx, 1)
      this.resume()
    }
  }

  processRebuildGroups = () => {
    console.log('processRebuildGroups')
    this.domains = []
    this.layers.forEach((layer) => {
      layer._generalDomain = null
      layer._generalGroup = null
    })
    this.layers.forEach((layer) => {
      const { affiliation, dimension, unit, headquarters } = layer.options.icon.state.metadata
      if (unit) {
        const key = `${affiliation}_${dimension}_${headquarters}`
        let domain = this.domains.find((item) => item.key === key)
        if (!domain) {
          domain = {
            key,
            headquarters,
            layers: [],
            groups: [],
          }
          this.domains.push(domain)
        }
        domain.layers.push(layer)
        layer._generalDomain = domain
      }
    })
    this.domains.forEach((domain) => {
      const { headquarters, layers, groups } = domain
      if (layers.length > 1) {
        const { scale } = layers[0].options.icon.state
        const conflictDist = scale * 1.5
        layers.forEach((layer) => {
          const { octagonAnchor, anchor } = layer.options.icon.state
          layer._octagonPos = {
            x: layer._pos.x - anchor.x + octagonAnchor.x,
            y: layer._pos.y - anchor.y + octagonAnchor.y,
          }
        })
        for (let i = 0; i < layers.length; i++) {
          const layer1 = layers[i]
          for (let j = i + 1; j < layers.length; j++) {
            const layer2 = layers[j]
            const dx = layer1._octagonPos.x - layer2._octagonPos.x
            const dy = layer1._octagonPos.y - layer2._octagonPos.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < conflictDist) {
              let group = groups.find((group) => group.layers.includes(layer1) || group.layers.includes(layer2))
              if (!group) {
                group = {
                  domain,
                  headquarters,
                  layers: [],
                }
                groups.push(group)
              }
              if (!group.layers.includes(layer1)) {
                group.layers.push(layer1)
                layer1._generalGroup = group
              }
              if (!group.layers.includes(layer2)) {
                group.layers.push(layer2)
                layer2._generalGroup = group
              }
            }
          }
        }
      }
    })

    for (const domain of this.domains) {
      for (const group of domain.groups) {
        console.log(domain.key, group.layers)
      }
    }

    this.timer = null
  }
}
