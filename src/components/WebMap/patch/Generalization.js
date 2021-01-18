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
    this.run = false
    this.layers = []
    this.domains = []
  }

  go () {
    this.resume()
  }

  start () {
    this.run = true
    this.resume()
  }

  stop () {
    this.run = false
    this.pause()
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
    if (this.run) {
      this.timer = setTimeout(this.processRebuildGroups, REBUILD_TIMEOUT)
    }
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
    const forRecreateIcon = []
    this.domains = []
    this.layers.forEach((layer) => {
      layer._generalDomain = null
      if (layer._generalGroup) {
        forRecreateIcon.push(layer)
      }
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
                if (!forRecreateIcon.includes(layer1)) {
                  forRecreateIcon.push(layer1)
                }
              }
              if (!group.layers.includes(layer2)) {
                group.layers.push(layer2)
                layer2._generalGroup = group
                if (!forRecreateIcon.includes(layer2)) {
                  forRecreateIcon.push(layer2)
                }
              }
            }
          }
        }
      }
    })

    for (const domain of this.domains) {
      for (const group of domain.groups) {
        console.log(domain.key, group.layers)
        group.layers.sort((layer1, layer2) => (layer2.object.level ?? 0) - (layer1.object.level ?? 0))
        const n = group.layers.length
        group.pos = {
          x: group.layers.reduce((acc, layer) => acc + layer._pos.x, 0) / n,
          y: group.layers.reduce((acc, layer) => acc + layer._pos.y, 0) / n,
        }
      }
    }

    forRecreateIcon.forEach((layer) => {
      layer._reinitIcon()
      layer.update()
    })

    this.timer = null
  }
}

export const calcShift = (group, layer, scale) => {
  const result = {
    x: 0,
    y: 0,
  }
  const index = group.layers.indexOf(layer)
  if (index >= 0) {
    for (let i = group.layers.length - 1; i > index; i--) {
      result.y -= group.layers[i].options.icon.state.height * scale
    }
  }

  return result
}
