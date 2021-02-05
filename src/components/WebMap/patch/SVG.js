import L from 'leaflet'
import entityKind, { entityKindNonFillable, GROUPS } from '../entityKind'
import {
  getAmplifiers,
  stroked,
  waved,
  getLineEnds,
  blockage,
  drawLineHatch,
  getPointAmplifier,
} from '../../../utils/svg/lines'
import { evaluateColor } from '../../../constants/colors'
import { FONT_FAMILY, FONT_WEIGHT } from '../../../utils/svg'
import { settings } from '../../../constants/drawLines'
import { narr } from './FlexGrid'
import { prepareLinePath, makeRegionGroup } from './utils/SVG'
import { calcControlPoint, prepareBezierPath } from './utils/Bezier'
import { setClassName, scaleValue, interpolateSize } from './utils/helpers'
import {
  getFontSize,
  getStrokeWidth,
} from './Sophisticated/utils'
import './SVG.css'

// ------------------------ Патч ядра Leaflet для візуалізації поліліній і полігонів засобами SVG ----------------------

const DASH_ON = false

const massCenter = (array) => {
  const zero = { x: 0, y: 0 }
  if (!array || !array.length) {
    return zero
  }
  const sum = array.reduce(({ x: ax, y: ay }, { x, y }) => ({ x: ax + x, y: ay + y }), zero)
  return {
    x: sum.x / array.length,
    y: sum.y / array.length,
  }
}

const { _initPath, _updateStyle, _setPath, _addPath, _removePath, _updateCircle } = L.SVG.prototype

L.SVG.include({
  _initPath: function (layer) {
    layer._outlinePath = L.SVG.create('path')
    L.DomUtil.addClass(layer._outlinePath, 'leaflet-interactive leaflet-interactive-outline')

    layer._shadowPath = L.SVG.create('path')
    L.DomUtil.addClass(layer._shadowPath, 'dzvin-path-shadow')

    _initPath.call(this, layer)
  },

  _setLayerPathStyle: function (layer, style, className) {
    if (layer.options.tsType === entityKind.FLEXGRID || layer.options.tsType === entityKind.OLOVO) {
      layer._pathes.forEach((path) => this._setPathStyle(layer, path, style, className))
      layer._olovo && this._setPathStyle(layer, layer._olovo, style, className)
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
        shadowColor, opacity = 1, hidden, selected, inActiveLayer, locked, color, weight, highlighted,
        dashArray, dashOffset, lineCap = 'round',
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
        _shadowPath.setAttribute('stroke-linecap', lineCap)
        _shadowPath.setAttribute('stroke-width', `${weight + 4}px`)

        if (dashArray && DASH_ON) {
          _shadowPath.setAttribute('stroke-dasharray', dashArray)
        } else {
          _shadowPath.removeAttribute('stroke-dasharray')
        }

        if (dashOffset && DASH_ON) {
          _shadowPath.setAttribute('stroke-dashoffset', dashOffset)
        } else {
          _shadowPath.removeAttribute('stroke-dashoffset')
        }
      } else {
        _shadowPath.setAttribute('display', 'none')
      }
    }

    if (layer.options.fill && entityKindNonFillable.indexOf(layer.options.tsType) >= 0) {
      layer.options.fill = false
    }

    // здесь опции слоя устанавливаются атрибутами в _path
    _updateStyle.call(this, layer)

    _amplifierGroup && _amplifierGroup.setAttribute('stroke', color)
    _lineEndsGroup && _lineEndsGroup.setAttribute('stroke', color)
    _lineEndsGroup && _lineEndsGroup.setAttribute('fill', color)

    this._setLayerPathStyle(layer, {
      opacity,
      display: hidden && !selected ? 'none' : '',
    }, {
      'dzvin-path-selected-on-active-layer': selected && inActiveLayer,
      'dzvin-path-selected': selected && !inActiveLayer,
      'dzvin-path-locked': locked || highlighted,
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

    if (layer._amplifierGroup) { // переустанавливаем группу выше линии
      this._rootGroup.appendChild(layer._amplifierGroup)
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

  _updateCircle: function (layer) {
    const kind = layer.options?.tsType
    let amplifiers = {
      maskPath: [],
      group: '',
    }
    if (kind === entityKind.CIRCLE && layer._point && layer.options.showAmplifiers) {
      const bounds = layer._map._renderer._bounds
      const zoom = layer._map.getZoom()
      const scale = 1
      // сборка pointAmplifier в центре круга
      if (layer.object?.attributes?.pointAmplifier) {
        const options = {
          centroid: layer._point,
          bounds,
          scale,
          zoom,
          tsType: kind, // тип линии
          amplifier: layer.object.attributes.pointAmplifier,
        }
        amplifiers = getPointAmplifier(options)
      }
    }
    this._setMask(layer, amplifiers.group, amplifiers.maskPath)
    _updateCircle.call(this, layer)
  },

  _updatePoly: function (layer, closed) {
    let result = L.SVG.pointsToPath(layer._rings, closed)
    let resultFilled = ''
    const lineType = layer.lineType || 'solid'
    const skipStart = layer.options?.skipStart
    const skipEnd = layer.options?.skipEnd
    const kind = layer.options?.tsType
    const length = layer._rings?.length === 1 && layer._rings[0].length
    const fullPolygon = kind === entityKind.POLYGON && length >= 3
    const fullPolyline = kind === entityKind.POLYLINE && length >= 2
    const fullArea = kind === entityKind.AREA && length >= 3
    const fullCurve = kind === entityKind.CURVE && length >= 2
    const simpleFigures = (kind === entityKind.RECTANGLE || kind === entityKind.SQUARE)
    if (simpleFigures) {
      this._updateMask(layer, false, true)
    } else if (kind === entityKind.SEGMENT && length === 2 && layer.options.tsTemplate) {
      const js = layer.options.tsTemplate
      if (js && js.svg && js.svg.path && js.svg.path[0] && js.svg.path[0].$ && js.svg.path[0].$.d) {
        result = prepareLinePath(js, js.svg.path[0].$.d, layer._rings[0])
      }
    } else if (kind === entityKind.SOPHISTICATED && layer.lineDefinition) {
      if (!layer._rings || !layer._rings[0]) {
        result = ''
      } else {
        const container = {
          d: '',
          mask: '',
          amplifiers: '',
          layer,
        }
        layer._rings[0] = layer._latlngs.map(layer._map.latLngToLayerPoint.bind(layer._map))
        try {
          layer.lineDefinition.render(container, layer._rings[0], scaleValue(1000, layer) / 1000)
        } catch (e) {
          console.warn(e)
        }
        result = container.d
        this._setMask(layer, container.amplifiers, container.mask)
      }
    } else if (GROUPS.GROUPED.includes(kind) && length === 2) {
      result = 'm0,0'
      if (kind === entityKind.GROUPED_REGION && layer._groupChildren) {
        result = makeRegionGroup(layer)
      }
    } else if (fullPolygon) {
      layer.options.fillRule = 'nonzero'
      switch (lineType) {
        case 'waved':
          result = this._buildWaved(layer, false, true)
          break
        case 'stroked':
          result += this._buildStroked(layer, false, true)
          break
        case 'blockage':
        case 'moatAntiTankUnfin':
        case 'trenches':
          result = this._buildBlockage(layer, false, true, lineType, true)
          break
        case 'blockageWire':
          result = this._buildBlockage(layer, false, true, lineType)
          break
        // залишаємо початкову лінію
        case 'solidWithDots':
          layer.options.lineCap = 'round'
        // eslint-disable-next-line no-fallthrough
        case 'blockageSpiral2':
        case 'blockageSpiral3':
        case 'blockageWireHigh':
        case 'blockageIsolation':
        case 'blockageWire1':
        case 'blockageWire2':
        case 'blockageWireFence':
        case 'blockageWireLow':
        case 'blockageSpiral':
          result += this._buildBlockage(layer, false, true, lineType)
          break
        // необхідна заливка елементів лінії
        case 'rowMinesLand':
        case 'moatAntiTank':
        case 'moatAntiTankMine':
        case 'rowMinesAntyTank':
          resultFilled = this._buildElementFilled(layer, false, true, lineType)
          break
        default:
          break
      }
      this._updateMask(layer, false, true)
      this._updateLineFilled(layer, resultFilled)
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
        case 'blockage':
        case 'moatAntiTankUnfin':
        case 'trenches':
          result = this._buildBlockage(layer, false, false, lineType, true)
          break
        case 'blockageWire':
          result = this._buildBlockage(layer, false, false, lineType)
          break
        // залишаємо початкову лінію
        case 'solidWithDots':
          layer.options.lineCap = 'round'
        // eslint-disable-next-line no-fallthrough
        case 'blockageIsolation':
        case 'blockageWire1':
        case 'blockageWire2':
        case 'blockageWireFence':
        case 'blockageWireLow':
        case 'blockageWireHigh':
        case 'blockageSpiral':
        case 'blockageSpiral2':
        case 'blockageSpiral3':
          result += this._buildBlockage(layer, false, false, lineType)
          break
        // необхідна заливка
        case 'rowMinesLand':
        case 'moatAntiTank':
        case 'moatAntiTankMine':
        case 'rowMinesAntyTank':
          resultFilled = this._buildElementFilled(layer, false, false, lineType)
          break
        default:
          break
      }
      this._updateMask(layer, false, false)
      this._updateLineEnds(layer, false)
      this._updateLineFilled(layer, resultFilled)
      result += ` m1,1`
    } else if (fullArea) {
      layer.options.fillRule = 'nonzero'
      result = prepareBezierPath(layer._rings[0], true)
      switch (lineType) {
        case 'waved':
          result = this._buildWaved(layer, true, true)
          break
        case 'stroked':
          result += this._buildStroked(layer, true, true)
          break
        // не залишаємо початкову лінію
        case 'blockage':
        case 'moatAntiTankUnfin':
        case 'trenches':
          result = this._buildBlockage(layer, true, true, lineType, true)
          break
        case 'blockageWire':
          result = this._buildBlockage(layer, true, true, lineType)
          break
        // залишаємо початкову лінію
        case 'solidWithDots':
          layer.options.lineCap = 'round'
        // eslint-disable-next-line no-fallthrough
        case 'blockageIsolation':
        case 'blockageWire1':
        case 'blockageWire2':
        case 'blockageWireFence':
        case 'blockageWireLow':
        case 'blockageWireHigh':
        case 'blockageSpiral':
        case 'blockageSpiral2':
        case 'blockageSpiral3':
          result += this._buildBlockage(layer, true, true, lineType)
          break
        // необхідна заливка
        case 'rowMinesLand':
        case 'moatAntiTank':
        case 'moatAntiTankMine':
        case 'rowMinesAntyTank':
          resultFilled = this._buildElementFilled(layer, true, true, lineType)
          break
        default:
          break
      }
      this._updateMask(layer, true, true)
      this._updateLineFilled(layer, resultFilled)
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
        // не залишаємо початкову лінію
        case 'blockage':
        case 'moatAntiTankUnfin':
        case 'trenches':
          result = this._buildBlockage(layer, true, false, lineType, true)
          break
        case 'blockageWire':
          result = this._buildBlockage(layer, true, false, lineType)
          break
        // залишаємо початкову лінію
        case 'solidWithDots':
          layer.options.lineCap = 'round'
        // eslint-disable-next-line no-fallthrough
        case 'blockageIsolation':
        case 'blockageWire1':
        case 'blockageWire2':
        case 'blockageWireFence':
        case 'blockageWireLow':
        case 'blockageWireHigh':
        case 'blockageSpiral':
        case 'blockageSpiral2':
        case 'blockageSpiral3':
          result += this._buildBlockage(layer, true, false, lineType)
          break
        // необхідна заливка
        case 'rowMinesLand':
        case 'moatAntiTank':
        case 'moatAntiTankMine':
        case 'rowMinesAntyTank':
          resultFilled = this._buildElementFilled(layer, true, false, lineType)
          break
        default:
          break
      }
      this._updateMask(layer, true, false)
      this._updateLineEnds(layer, true)
      this._updateLineFilled(layer, resultFilled)
    }
    this._setPath(layer, result)
  },

  _updateMask: function (layer, bezier, locked) {
    const bounds = layer._map._renderer._bounds
    if (!layer.points || layer.oldRings !== layer._rings[0]) {
      const pointsG = Array.isArray(layer._latlngs[0]) ? layer._latlngs[0] : layer._latlngs
      const points = pointsG.map((pointG) => {
        if (pointG && pointG.lat && pointG.lng) {
          return layer._map.latLngToLayerPoint(pointG)
        } else {
          return null
        }
      }).filter(Boolean) || []

      if (bezier) {
        points.forEach((point, ind, points) => {
          if (!locked && (ind === 0 || ind === points.length - 1)) {
            point.cp1 = { x: point.x, y: point.y }
            point.cp2 = { x: point.x, y: point.y }
          } else {
            const indP = ind === 0 ? points.length - 1 : ind - 1
            const indN = ind === points.length - 1 ? 0 : ind + 1
            const [ cp1, cp2 ] = calcControlPoint(
              [ points[indP].x, points[indP].y ],
              [ point.x, point.y ],
              [ points[indN].x, points[indN].y ])
            point.cp1 = { x: cp1[0], y: cp1[1] }
            point.cp2 = { x: cp2[0], y: cp2[1] }
          }
        })
      }
      layer.oldRings = layer._rings[0]
      layer.points = points
    }
    const amplifiers = getAmplifiers({
      points: layer.points,
      bezier,
      locked,
      bounds,
      scale: 1.0,
      zoom: layer._map.getZoom(),
      tsType: layer.options.tsType,
      showTextAmplifiers: layer.options.showAmplifiers,
    }, layer.object)

    if (layer.object?.attributes?.hatch) {
      amplifiers.group += drawLineHatch(layer, scaleValue(1000, layer) / 1000, layer.object?.attributes?.hatch)
    }

    this._setMask(layer, amplifiers.group, amplifiers.maskPath)
  },

  _setMask: function (layer, amplifiers, mask) {
    if (Array.isArray(mask)) {
      mask = mask.length ? `<path fill="black" fill-rule="nonzero" d="${mask.join(' ')}" />` : null
    }
    if (mask) {
      const boundsLayer = layer._map?._renderer?._bounds
      const vb = boundsLayer
        ? [
          boundsLayer.min.x,
          boundsLayer.min.y,
          boundsLayer.max.x - boundsLayer.min.x,
          boundsLayer.max.y - boundsLayer.min.y,
        ]
        : [ 0, 0, '100%', '100%' ] // крайний случай, череват частичной или полной потерей изображения знака
      mask = `<rect fill="white" x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" />${mask}`
      layer.getMask().innerHTML = mask
      const maskURL = `url(#mask-${layer.object?.id ?? 'NewObject'})`
      layer._path.setAttribute('mask', maskURL)
      layer._shadowPath.setAttribute('mask', maskURL)
    } else {
      layer.deleteMask && layer.deleteMask()
      layer._path.removeAttribute('mask')
      layer._shadowPath.removeAttribute('mask')
    }
    if (amplifiers) {
      layer.getAmplifierGroup().innerHTML = amplifiers
    } else {
      layer.deleteAmplifierGroup && layer.deleteAmplifierGroup()
    }
  },

  _buildWaved: function (layer, bezier, locked, inverse) {
    const bounds = layer._map._renderer._bounds
    return waved(layer._rings[0], layer.object?.attributes, bezier, locked, bounds, 1.0,
      layer._map.getZoom(), inverse)
  },

  // сборка линии с засечками
  _buildStroked: function (layer, bezier, locked) {
    const bounds = layer._map._renderer._bounds
    return stroked(
      layer._rings[0],
      layer.object?.attributes,
      bezier,
      locked,
      bounds,
      1.0,
      layer._map.getZoom(),
    )
  },

  // сборка остальных типов линий
  _buildBlockage: function (layer, bezier, locked, lineType, setEnd) {
    const bounds = layer._map._renderer._bounds
    return blockage(
      layer._rings[0],
      layer.object?.attributes,
      bezier,
      locked,
      bounds,
      layer.scaleOptions, //  1.0,
      layer._map.getZoom(),
      false,
      lineType,
      setEnd)
  },

  _buildElementFilled: function (layer, bezier, locked, lineType, setEnd) {
    const bounds = layer._map._renderer._bounds
    const colorLine = layer.object?.attributes?.color || 'black'
    const d = blockage(layer._rings[0], layer.object?.attributes, bezier, locked, bounds, layer.scaleOptions, //  1.0,
      layer._map.getZoom(), false, lineType, setEnd)
    return `<path fill="${evaluateColor(colorLine)}" fill-rule="nonzero" stroke-width="${1}" d="${d}"/>`
  },

  _updateLineFilled: function (layer, resultFilled) {
    layer.getAmplifierGroup().innerHTML += `${resultFilled}`
  },

  _updateLineEnds: function (layer, bezier) {
    const graphicSize = interpolateSize(layer._map.getZoom(), settings.GRAPHIC_AMPLIFIER_SIZE)
    const { left, right } = getLineEnds(
      layer._rings[0],
      layer.object?.attributes,
      bezier,
      layer.options.weight,
      graphicSize,
    )
    if (!left && !right) {
      return layer.deleteLineEndsGroup && layer.deleteLineEndsGroup()
    }
    layer.getLineEndsGroup().innerHTML = `${left}${right}`
  },

  _initFlexGrid: function (grid) {
    const group = L.SVG.create('g')
    const {
      className, interactive, zoneLines, directionLines, boundaryLine, borderLine, highlight, olovo, shadow,
      highlightMain, borderLineOlovo,
    } = grid.options
    grid._path = group
    if (className) {
      L.DomUtil.addClass(group, className)
    }
    if (!olovo) {
      grid._shadow = L.SVG.create('path')
    }
    grid._zones = L.SVG.create('path')
    grid._directions = L.SVG.create('path')
    grid._boundary = L.SVG.create('path')
    grid._border = L.SVG.create('path')
    grid._highlighted = L.SVG.create('path')
    grid._highlightMain = L.SVG.create('path')
    grid._pathes = [
      grid._zones,
      grid._highlighted,
      grid._directions,
      grid._boundary,
      grid._border,
      grid._highlightMain,
    ]
    if (interactive) {
      grid._pathes.forEach((path) => L.DomUtil.addClass(path, 'leaflet-interactive'))
    }
    if (!olovo) {
      this._updateStyle({ _path: grid._shadow, options: shadow })
    }
    this._updateStyle({ _path: grid._directions, options: directionLines })
    this._updateStyle({ _path: grid._zones, options: olovo ? directionLines : zoneLines })
    this._updateStyle({ _path: grid._boundary, options: olovo ? directionLines : boundaryLine })
    this._updateStyle({ _path: grid._border, options: olovo ? borderLineOlovo : borderLine })
    this._updateStyle({ _path: grid._highlighted, options: highlight })
    this._updateStyle({ _path: grid._highlightMain, options: highlightMain })
    if (!olovo) {
      group.appendChild(grid._shadow)
    }
    grid._pathes.forEach((path) => group.appendChild(path))
    if (olovo) {
      grid._olovo = L.SVG.create('g')
      grid._title = L.SVG.create('text')
      grid._title.style.userSelect = 'none'
      grid._olovo.appendChild(grid._title)
      this._recreateGridCells(grid)
      group.appendChild(grid._olovo)
    }
    this._layers[L.Util.stamp(grid)] = grid
  },

  _recreateGridCells: function (grid) {
    const { zones, directions } = grid.options
    grid._cells && grid._cells.forEach((row) => row.forEach((item) => item.remove()))
    grid._cells = narr(directions).map(() => narr(zones).map(() => {
      const text = L.SVG.create('text')
      text.style.userSelect = 'none'
      grid._olovo.appendChild(text)
      return text
    }))
  },

  _prepareTextAmplifier: function (layer, text, title, point, center = false, color) {
    text.innerHTML = title
    text.setAttribute('x', point.x)
    text.setAttribute('y', point.y)
    text.setAttribute('font-family', FONT_FAMILY)
    text.setAttribute('font-weight', FONT_WEIGHT)
    text.setAttribute('stroke', 'none')
    text.setAttribute('fill', color || 'black')
    text.setAttribute('font-size', getFontSize(layer))
    if (center) {
      text.setAttribute('text-anchor', 'middle')
      text.setAttribute('alignment-baseline', 'central')
    }
  },

  _updateFlexGrid: function (grid) {
    const { olovo, title, start, color, strokeWidth, directions, zones } = grid.options
    const border = prepareBezierPath(grid._borderLine(), true)
    if (!olovo) {
      const bounds = grid._map._renderer._bounds
      const path = `M${bounds.min.x} ${bounds.min.y}L${bounds.min.x} ${bounds.max.y}L${bounds.max.x} ${bounds.max.y}L${bounds.max.x} ${bounds.min.y}Z`
      grid._shadow.setAttribute('d', `${path}${border}`)
      grid._boundary.setAttribute('d', prepareBezierPath(grid._boundaryLine()))
    }
    grid._zones.setAttribute('d', grid._zoneLines().map(prepareBezierPath).join(''))
    grid._directions.setAttribute('d', grid._directionLines().map(prepareBezierPath).join(''))
    grid._border.setAttribute('d', border)
    grid._highlighted.setAttribute('d', this._getHighlightDirectionsArea(grid))
    grid._highlightMain.setAttribute('d', this._getHighlightMainDirectionsArea(grid))
    if (olovo) {
      this._prepareTextAmplifier(grid, grid._title, title, grid.eternalRings[0][0])
      if (grid._cells.length !== directions || !grid._cells[0] || grid._cells[0].length !== zones) {
        this._recreateGridCells(grid)
      }
      grid._cells.forEach((row, dirIdx) => row.forEach((item, zoneIdx) =>
        this._prepareTextAmplifier(grid, item, `${start + dirIdx * 10 + zoneIdx}`, massCenter([
          grid.eternalRings[dirIdx][zoneIdx],
          grid.eternalRings[dirIdx + 1][zoneIdx],
          grid.eternalRings[dirIdx][zoneIdx + 1],
          grid.eternalRings[dirIdx + 1][zoneIdx + 1],
        ]), true),
      ))

      const width = strokeWidth ? getStrokeWidth(grid, strokeWidth) : false
      grid._pathes.forEach((path) => {
        if (width) {
          path.setAttribute('stroke-width', width)
        }
        if (color) {
          path.setAttribute('stroke', color)
        }
      })
    }
  },

  _getHighlightDirectionsArea: function (grid) {
    return grid.highlightedDirections && grid.highlightedDirections.length
      ? grid.highlightedDirections.reduce((acc, index) => acc + grid.cellRings[index].join(''), '')
      : ''
  },

  _getHighlightMainDirectionsArea: function (grid) {
    if (grid.highlightedMainDirection !== null) {
      if (grid.cellRings.length > grid.highlightedMainDirection) {
        return grid.cellRings[grid.highlightedMainDirection].join('')
      } else {
        grid.highlightedMainDirection = null
      }
    }
    return ''
  },
})
