import L from 'leaflet'
import { interpolateSize } from './utils/helpers'

const REBUILD_TIMEOUT = 50
/* const FRIEND_SIZE = -1
const ENEMY_SIZE = 1
const ENEMY_AFFILIATION = 'Hostile' */
const LINE_OPTIONS = {
  interactive: false,
  noClip: true,
  color: 'black',
  weight: 1.25,
}

const plus = (p1, p2) => ({ x: p1.x + p2.x, y: p1.y + p2.y })

export default class Generalization {
  constructor (map, settings) {
    this.map = map
    this.settings = settings
    this.map.on('layeradd', this.layerAddHandler)
    this.map.on('layerremove', this.layerRemoveHandler)
    this.map.on('zoomstart', this.zoomStart)
    this.map.on('zoomend', this.resume)
    this.map.on('movestart', this.moveStart)
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
    this.clearGroups()
  }

  zoomStart = () => {
    this.pause()
    this.clearLines()
  }

  moveStart = () => {
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

  clearLines = () => {
    this.map.off('layerremove', this.layerRemoveHandler)
    for (const domain of this.domains) {
      for (const group of domain.groups) {
        for (const line of group.lines) {
          this.map.removeLayer(line)
        }
      }
    }
    this.map.on('layerremove', this.layerRemoveHandler)
  }

  clearGroups = () => {
    this.clearLines()
    this.layers.forEach((layer) => {
      layer._generalDomain = null
      if (layer._generalGroup) {
        layer._generalGroup = null
        layer._reinitIcon()
        layer.update()
      }
    })
  }

  getScale = () => interpolateSize(this.map.getZoom(), this.settings.POINT_SYMBOL_SIZE)

  // Визначення графічних позначок груп залежно від типу і орієнтації
  buildGroupLines = (group, offset) => {
    const signSize = this.getScale()
    group.offset = offset
    if (group.headquarters) {
      group.lines = [
        L.polyline([
          this.map.layerPointToLatLng(group.pos),
          this.map.layerPointToLatLng(plus(group.pos, offset)),
        ], LINE_OPTIONS),
      ]
    } else {
      group.leftSided = offset.x < 0
      const d = group.leftSided ? -1 : 1
      group.lines = [
        L.polyline([
          this.map.layerPointToLatLng(group.pos),
          this.map.layerPointToLatLng(plus(group.pos, offset)),
          this.map.layerPointToLatLng(plus(plus(group.pos, offset), { x: d * signSize, y: 0 })),
        ], LINE_OPTIONS),
        L.polyline([
          this.map.layerPointToLatLng({
            x: group.pos.x + offset.x + d * signSize * 1.25,
            y: group.pos.y + offset.y - group.height / 2,
          }),
          this.map.layerPointToLatLng({
            x: group.pos.x + offset.x + d * signSize,
            y: group.pos.y + offset.y - group.height / 2,
          }),
          this.map.layerPointToLatLng({
            x: group.pos.x + offset.x + d * signSize,
            y: group.pos.y + offset.y + group.height / 2,
          }),
          this.map.layerPointToLatLng({
            x: group.pos.x + offset.x + d * signSize * 1.25,
            y: group.pos.y + offset.y + group.height / 2,
          }),
        ], LINE_OPTIONS),
      ]
    }
    for (const line of group.lines) {
      this.map.addLayer(line)
    }
  }

  processRebuildGroups = () => {
    // Вилучаємо позначки попередніх груп з карти
    this.clearLines()

    // Ініціалізація
    const forRecreateIcon = []
    this.domains = []
    this.timer = null

    // Очищуємо попередні групи
    this.layers.forEach((layer) => {
      layer._generalDomain = null
      if (layer._generalGroup) {
        forRecreateIcon.push(layer)
      }
      layer._generalGroup = null
    })

    // Визначаємо домени і списки знаків у них
    this.layers.forEach((layer) => {
      const state = layer.options.icon.state
      if (state) {
        const { affiliation, dimension, unit, headquarters } = state.metadata
        if (unit) {
          const key = `${affiliation}_${dimension}_${headquarters}`
          let domain = this.domains.find((item) => item.key === key)
          if (!domain) {
            domain = {
              key,
              headquarters,
              // enemy: affiliation === ENEMY_AFFILIATION,
              layers: [],
              groups: [],
            }
            this.domains.push(domain)
          }
          domain.layers.push(layer)
          layer._generalDomain = domain
        }
      }
    })

    // Визначаємо в доменах групи знаків, що перекриваються
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
                  map: layer1._map,
                  domain,
                  headquarters,
                  layers: [],
                  offset: { x: 0, y: 0 },
                  orientation: {},
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

    // Розрахунок положення і розмірів груп
    const precalcGroups = () => {
      for (const domain of this.domains) {
        for (const group of domain.groups) {
          const n = group.layers.length
          group.pos = {
            x: group.layers.reduce((acc, layer) => acc + layer._pos.x, 0) / n,
            y: group.layers.reduce((acc, layer) => acc + layer._pos.y, 0) / n,
          }
          const vScale = group.headquarters ? 0.75 : 1
          group.height = group.layers.reduce((acc, layer) => acc + layer.options.icon.state.height * vScale, 0)
          group.width = group.layers.reduce((acc, layer) => Math.max(acc, layer.options.icon.state.width), 0)
          group.xAnchor = group.layers.reduce((acc, layer) =>
            Math.max(acc, layer.options.icon.state.octagonAnchor.x), 0)
          group.xAnchorLeft = group.layers.reduce((acc, layer) =>
            Math.max(acc, layer.options.icon.state.width - layer.options.icon.state.octagonAnchor.x), 0)
        }
      }
    }

    for (const domain of this.domains) {
      for (const group of domain.groups) {
        group.layers.sort((layer1, layer2) => (layer2.object.level ?? 0) - (layer1.object.level ?? 0))
      }
    }

    // Перший прохід розрахунку
    precalcGroups()

    // Перший прохід створення іконок знаків (для визначення їхніх розмірів)
    forRecreateIcon.forEach((layer) => {
      layer._reinitIcon()
    })

    // Другий прохід розрахунку
    precalcGroups()

    // Визначення орієнтації груп
    const box = { left: 1e6, top: 1e6, right: -1e6, bottom: -1e6 }
    for (const domain of this.domains) {
      for (const group of domain.groups) {
        if (group.pos.x < box.left) {
          box.left = group.pos.x
        }
        if (group.pos.x > box.right) {
          box.right = group.pos.x
        }
        if (group.pos.y < box.top) {
          box.top = group.pos.y
        }
        if (group.pos.y > box.bottom) {
          box.bottom = group.pos.y
        }
      }
    }
    box.width = box.right - box.left
    box.height = box.bottom - box.top
    for (const domain of this.domains) {
      for (const group of domain.groups) {
        group.orientation.x = group.pos.x >= box.left + box.width * 0.5
          ? 1
          : -1
        group.orientation.y = group.pos.y >= box.top + box.height * 0.625
          ? 1
          : group.pos.y >= box.top + box.height * 0.375
            ? 0
            : -1
      }
    }

    // Створення позначок груп, зі зміщенням залежно від орієнтації
    const signSize = this.getScale()
    this.map.off('layeradd', this.layerAddHandler)
    for (const domain of this.domains) {
      for (const group of domain.groups) {
        const offset = group.headquarters
          ? { x: 0, y: 0 }
          : { x: group.orientation.x * signSize, y: group.orientation.y * signSize }
        this.buildGroupLines(group, offset)
      }
    }
    this.map.on('layeradd', this.layerAddHandler)

    // Другий прохід створення іконок знаків (для визначення їхнього положення)
    forRecreateIcon.forEach((layer) => {
      layer._reinitIcon()
      layer.update()
    })
  }
}

export const calcShift = (group, layer) => {
  const l0 = group.layers[0].options.icon.state
  const vScale = group.headquarters ? 0.75 : 1
  const hShift = group.headquarters ? 0 : group.leftSided
    ? -group.xAnchorLeft - l0.scale * 1.25
    : group.xAnchor + l0.scale * 1.25
  const vShift = group.headquarters ? 0 : l0.height - l0.octagonAnchor.y
  const result = {
    x: group.pos.x + group.offset.x - layer._pos.x + hShift,
    y: group.pos.y + group.offset.y - layer._pos.y - vShift,
  }
  if (!group.headquarters) {
    result.y += group.height / 2
  }
  const index = group.layers.indexOf(layer)
  if (index >= 0) {
    for (let i = group.layers.length - 1; i > index; i--) {
      result.y -= group.layers[i].options.icon.state.height * vScale
    }
  }

  return result
}
