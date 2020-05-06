import L from 'leaflet'

export function MilSymbolGroup (symbols) {
	let width = 0
	let height = 0
	let x = 0
	let y = 0
	let size = 0
	let strokeWidth = 0
	let object = L.SVG.create('svg')
	// If just one symbol just return that symbol
	let headquarterGroup = true
	// Checking if all symbols are headquarters
	for (const symbol of symbols) {
		if (!symbol.metadata.headquarters) {
			headquarterGroup = false
			break
		}
	}
	for (const symbol of symbols) {
		// The maximum symbol Size, this will be used for some lineWidth
		size = Math.max(width, symbol.style.size)
		// The maximum strokeWidth
		strokeWidth = Math.max(width, symbol.style.strokeWidth)
	}
	let maxX = 0
	let maxWidth = 0
	for (const symbol of symbols) {
		// Getting maximum X offset
		maxX = Math.max(maxX, symbol.symbolAnchor.x)
		// Getting max width from insertion point to right edge
		maxWidth = Math.max(maxWidth, symbol.width - symbol.symbolAnchor.x)
		// The maximum width of our SVG we will require
		width = Math.max(width, maxX + maxWidth)
	}
	if (headquarterGroup) {
		// Create headquarters group
		let lastMarker
		for (const symbol of symbols) {
			const Geometry = L.SVG.create('g')
			Geometry.setAttribute('transform', `translate(${maxX - symbol.symbolAnchor.x},${height})`)
			Geometry.setAttribute('overflow', 'visible')
			Geometry.appendChild(symbol.asDOM())
			object.appendChild(Geometry)

			// Getting the height of all symbols, but we want them to overlap a bit
			height += symbol.symbolAnchor.y - 0.3 * symbol.symbolAnchor.y
			lastMarker = symbol
		}
		if (lastMarker) {
			y = height + 0.3 * lastMarker.symbolAnchor.y
			// Adding space for the last symbol
			height += lastMarker.height - 0.7 * lastMarker.symbolAnchor.y
		}
	  x = maxX
	} else {
		// Create mixed group
		const paddingLeft = size
		for (const symbol of symbols){
			const Geometry = L.SVG.create('g')
			Geometry.setAttribute('transform', `translate(${maxX - symbol.symbolAnchor.x + paddingLeft},${height + 5})`)
			Geometry.setAttribute('overflow', 'visible')
			Geometry.appendChild(symbol.asDOM())
			object.appendChild(Geometry)

			// Getting the height of all symbols
			height += symbol.height
		}
	  y = height / 2
	  width = width + paddingLeft
	  x = 0

	  const Geometry = L.SVG.create('path')
	  const path = `M 0,${y} l ${paddingLeft / 2},0 M ${paddingLeft},5 l -${paddingLeft / 2},0 0,${height} ${paddingLeft / 2},0`
		Geometry.setAttribute('d', path)
		Geometry.setAttribute('stroke', 'black')
		Geometry.setAttribute('stroke-width', strokeWidth * size / 100)
		Geometry.setAttribute('fill', 'none')
		object.appendChild(Geometry)
		height += 10
	}

	// if(_MilSymbol.userAgentIE){svgSymbol.setAttribute("xmlns", svgNS)};
	object.setAttribute('version', 1.2)
	object.setAttribute('baseProfile', 'tiny')
	object.setAttribute('width', width)
	object.setAttribute('height', height)
	const textXML = new XMLSerializer().serializeToString(object)

	return {
		object,
		textXML,
		x,
		y,
		width,
		height,
	}
}
