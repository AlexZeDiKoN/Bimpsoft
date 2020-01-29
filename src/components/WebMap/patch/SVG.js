/* global L */
import entityKind, { entityKindNonFillable, GROUPS } from '../entityKind'
import { getAmplifiers, stroked, waved, getLineEnds } from '../../../utils/svg/lines'
import { prepareLinePath, makeHeadGroup, makeLandGroup } from './utils/SVG'
import { prepareBezierPath } from './utils/Bezier'
import { setClassName } from './utils/helpers'
import './SVG.css'

// ------------------------ Патч ядра Leaflet для візуалізації поліліній і полігонів засобами SVG ----------------------

const { _initPath, _updateStyle, _setPath, _addPath, _removePath } = L.SVG.prototype

L.SVG.include({
  _initPath: function (layer) {
    layer._outlinePath = L.SVG.create('path')
    L.DomUtil.addClass(layer._outlinePath, 'leaflet-interactive leaflet-interactive-outline')

    layer._shadowPath = L.SVG.create('path')
    L.DomUtil.addClass(layer._shadowPath, 'dzvin-path-shadow')

    _initPath.call(this, layer)
  },

  _setLayerPathStyle: function (layer, style, className) {
    if (layer.options.tsType === entityKind.FLEXGRID) {
      layer._pathes.forEach((path) => this._setPathStyle(layer, path, style, className))
    } else {
      this._setPathStyle(layer, layer._path, style, className)
    }
  },

  _setPathStyle: function (layer, path, style, className) {
    const { _amplifierGroup, _lineEndsGroup, _outlinePath, _shadowPath } = layer
    if (style) {
      for (const item of Object.keys(style)) {
        if (path.style[item] !== style[item]) {
          path.style[item] = style[item]
          _outlinePath && (_outlinePath.style[item] = style[item])
          _shadowPath && (_shadowPath.style[item] = style[item])
        }
        _amplifierGroup && (_amplifierGroup.style[item] = style[item])
        _lineEndsGroup && (_lineEndsGroup.style[item] = style[item])
      }
    }
    if (className) {
      for (const item of Object.keys(className)) {
        setClassName(path, item, className[item])
        _amplifierGroup && setClassName(_amplifierGroup, item, className[item])
        _lineEndsGroup && setClassName(_lineEndsGroup, item, className[item])
      }
    }
  },

  _updateStyle: function (layer) {
    const {
      options: {
        shadowColor, opacity = 1, hidden, selected, inActiveLayer, locked, color, weight,
        fillColor, fillOpacity, fillRule,
      },
      _shadowPath,
      _amplifierGroup,
      _lineEndsGroup,
    } = layer

    if (_shadowPath) {
      layer.options.fill = layer.options.fill || (layer.options.tsType && !shadowColor)
      if (shadowColor) {
        _shadowPath.removeAttribute('display')
        _shadowPath.setAttribute('stroke', shadowColor)
        _shadowPath.setAttribute('fill', 'none')
        _shadowPath.setAttribute('stroke-linejoin', 'round')
        _shadowPath.setAttribute('stroke-width', `${weight + 4}px`)

        _shadowPath.setAttribute('fill', fillColor || color)
        _shadowPath.setAttribute('fill-opacity', fillOpacity)
        _shadowPath.setAttribute('fill-rule', fillRule || 'evenodd')
      } else {
        _shadowPath.setAttribute('display', 'none')
      }
    }

    if (layer.options.fill && entityKindNonFillable.indexOf(layer.options.tsType) >= 0) {
      layer.options.fill = false
    }
    _updateStyle.call(this, layer)

    _amplifierGroup && _amplifierGroup.setAttribute('stroke', color)
    _lineEndsGroup && _lineEndsGroup.setAttribute('stroke', color)
    _lineEndsGroup && _lineEndsGroup.setAttribute('fill', color)

    this._setLayerPathStyle(layer, {
      opacity,
      display: hidden ? 'none' : '',
    }, {
      'dzvin-path-selected-on-active-layer': selected && inActiveLayer,
      'dzvin-path-selected': selected && !inActiveLayer,
      'dzvin-path-locked': locked,
    })
  },

  _addPath: function (layer) {
    if (layer._shadowPath) {
      this._rootGroup.appendChild(layer._shadowPath)
    }

    if (layer._outlinePath) {
      this._rootGroup.appendChild(layer._outlinePath)
      layer.addInteractiveTarget(layer._outlinePath)
    }

    _addPath.call(this, layer)
  },

  _setPath: function (layer, path) {
    _setPath.call(this, layer, path)
    layer._outlinePath.setAttribute('d', path)
    layer._shadowPath.setAttribute('d', path)
  },

  _removePath: function (layer) {
    _removePath.call(this, layer)

    if (layer._outlinePath) {
      L.DomUtil.remove(layer._outlinePath)
      layer.removeInteractiveTarget(layer._outlinePath)
    }

    if (layer._shadowPath) {
      L.DomUtil.remove(layer._shadowPath)
    }

    layer.deleteMask && layer.deleteMask()
    layer.deleteAmplifierGroup && layer.deleteAmplifierGroup()
    layer.deleteLineEndsGroup && layer.deleteLineEndsGroup()
  },

  _updatePoly: function (layer, closed) {
    let result = L.SVG.pointsToPath(layer._rings, closed)
    const lineType = layer.lineType || 'solid'
    const skipStart = layer.options?.skipStart
    const skipEnd = layer.options?.skipEnd
    const kind = layer.options?.tsType
    const length = layer._rings?.length === 1 && layer._rings[0].length
    const fullPolygon = kind === entityKind.POLYGON && length >= 3
    const fullPolyline = kind === entityKind.POLYLINE && length >= 2
    const fullArea = kind === entityKind.AREA && length >= 3
    const fullCurve = kind === entityKind.CURVE && length >= 2
    if (kind === entityKind.SEGMENT && length === 2 && layer.options.tsTemplate) {
      const js = layer.options.tsTemplate
      if (js && js.svg && js.svg.path && js.svg.path[0] && js.svg.path[0].$ && js.svg.path[0].$.d) {
        result = prepareLinePath(js, js.svg.path[0].$.d, layer._rings[0])
      }
    } else if (GROUPS.GROUPED.includes(kind) && length === 2) {
      const parts = []
      const line = layer._rings[0]
      result = parts.length === 0
        ? ''
        : kind === entityKind.GROUPED_HEAD
          ? makeHeadGroup(line, parts)
          : makeLandGroup(line, parts)
    } else if (fullPolygon) {
      switch (lineType) {
        case 'waved':
          result = this._buildWaved(layer, false, true)
          break
        case 'stroked':
          result += this._buildStroked(layer, false, true)
          break
        default:
          break
      }
      this._updateMask(layer, false, true)
    } else if (fullPolyline) {
      switch (lineType) {
        case 'waved':
          result = this._buildWaved(layer, false, false)
          break
        case 'waved2':
          result = this._buildWaved(layer, false, false, true)
          break
        case 'stroked':
          result += this._buildStroked(layer, false, false)
          break
        default:
          break
      }
      this._updateMask(layer, false, false)
      this._updateLineEnds(layer, false)
      result += ` m1,1`
    } else if (fullArea) {
      result = prepareBezierPath(layer._rings[0], true)
      switch (lineType) {
        case 'waved':
          result = this._buildWaved(layer, true, true)
          break
        case 'stroked':
          result += this._buildStroked(layer, true, true)
          break
        default:
          break
      }
      this._updateMask(layer, true, true)
    } else if (fullCurve) {
      result = prepareBezierPath(layer._rings[0], false, skipStart && length > 3, skipEnd && length > 3)
      switch (lineType) {
        case 'waved':
          result = this._buildWaved(layer, true, false)
          break
        case 'waved2':
          result = this._buildWaved(layer, true, false, true)
          break
        case 'stroked':
          result += this._buildStroked(layer, true, false)
          break
        default:
          break
      }
      this._updateMask(layer, true, false)
      this._updateLineEnds(layer, true)
    }

    this._setPath(layer, result)
  },

  _updateMask: function (layer, bezier, locked) {
    const bounds = layer._map._renderer._bounds
    const amplifiers = getAmplifiers({
      points: layer._rings[0],
      intermediateAmplifierType: layer.options?.intermediateAmplifierType,
      intermediateAmplifier: layer.options?.intermediateAmplifier,
      shownIntermediateAmplifiers: layer.options?.shownIntermediateAmplifiers,
      shownNodalPointAmplifiers: layer.options?.shownNodalPointAmplifiers,
      pointAmplifier: layer.options?.pointAmplifier,
      level: layer.object?.level,
      nodalPointIcon: layer.options?.nodalPointIcon,
      bezier,
      locked,
      bounds,
      scale: 1.0,
      zoom: layer._map.getZoom(),
    })
    if (amplifiers.maskPath.length) {
      layer.getMask().innerHTML = `<path fill-rule="nonzero" fill="#ffffff" d="${amplifiers.maskPath.join(' ')}" />`
      layer._path.setAttribute('mask', `url(#mask-${layer.object.id})`)
      layer._shadowPath.setAttribute('mask', `url(#mask-${layer.object.id})`)
    } else {
      layer.deleteMask && layer.deleteMask()
      layer._path.removeAttribute('mask')
      layer._shadowPath.removeAttribute('mask')
    }
    if (amplifiers.group) {
      layer.getAmplifierGroup().innerHTML = amplifiers.group
    } else {
      layer.deleteAmplifierGroup && layer.deleteAmplifierGroup()
    }
  },

  _buildWaved: function (layer, bezier, locked, inverse) {
    const bounds = layer._map._renderer._bounds
    return waved(layer._rings[0], layer.options?.lineEnds, bezier, locked, bounds, 1.0,
      layer._map.getZoom(), inverse)
  },

  _buildStroked: function (layer, bezier, locked) {
    const bounds = layer._map._renderer._bounds
    return stroked(
      layer._rings[0],
      layer.options?.lineEnds,
      layer.options?.nodalPointIcon,
      bezier,
      locked,
      bounds,
      1.0,
      layer._map.getZoom(),
    )
  },

  _updateLineEnds: function (layer, bezier) {
    const { options: { weight }, strokeWidth } = layer
    const scale = weight * 0.6 / Math.log1p(strokeWidth) || 1
    const { left, right } = getLineEnds(
      layer._rings[0],
      layer.options?.lineEnds,
      bezier,
      scale,
    )
    if (!left && !right) {
      return layer.deleteLineEndsGroup && layer.deleteLineEndsGroup()
    }
    layer.getLineEndsGroup().innerHTML = `${left}${right}`
  },

  _initFlexGrid: function (grid) {
    const group = L.SVG.create('g')
    grid._path = group
    if (grid.options.className) {
      L.DomUtil.addClass(group, grid.options.className)
    }
    grid._shadow = L.SVG.create('path')
    grid._zones = L.SVG.create('path')
    grid._directions = L.SVG.create('path')
    grid._boundary = L.SVG.create('path')
    grid._border = L.SVG.create('path')
    grid._highlighted = L.SVG.create('path')
    grid._pathes = [ grid._zones, grid._highlighted, grid._directions, grid._boundary, grid._border ]
    if (grid.options.interactive) {
      grid._pathes.forEach((path) => L.DomUtil.addClass(path, 'leaflet-interactive'))
    }
    this._updateStyle({ _path: grid._shadow, options: grid.options.shadow })
    this._updateStyle({ _path: grid._zones, options: grid.options.zoneLines })
    this._updateStyle({ _path: grid._directions, options: grid.options.directionLines })
    this._updateStyle({ _path: grid._boundary, options: grid.options.boundaryLine })
    this._updateStyle({ _path: grid._border, options: grid.options.borderLine })
    this._updateStyle({ _path: grid._highlighted, options: grid.options.highlight })
    group.appendChild(grid._shadow)
    grid._pathes.forEach((path) => group.appendChild(path))
    this._layers[L.Util.stamp(grid)] = grid
  },

  _updateFlexGrid: function (grid) {
    const bounds = grid._map._renderer._bounds
    const path = `M${bounds.min.x} ${bounds.min.y}L${bounds.min.x} ${bounds.max.y}L${bounds.max.x} ${bounds.max.y}L${bounds.max.x} ${bounds.min.y}Z`
    const border = prepareBezierPath(grid._borderLine(), true)
    grid._shadow.setAttribute('d', `${path}${border}`)
    grid._zones.setAttribute('d', grid._zoneLines().map(prepareBezierPath).join(''))
    grid._directions.setAttribute('d', grid._directionLines().map(prepareBezierPath).join(''))
    grid._boundary.setAttribute('d', prepareBezierPath(grid._boundaryLine()))
    grid._border.setAttribute('d', border)
    grid._highlighted.setAttribute('d', this._getHighlightDirectionsArea(grid))
  },

  _getHighlightDirectionsArea: function (grid) {
    return grid.highlightedDirections && grid.highlightedDirections.length
      ? grid.highlightedDirections.reduce((acc, index) => acc + grid.cellRings[index].join(''), '')
      : ''
  },
})
