import React from 'react'
import Tiles from '../../components/WebMap/Tiles'
import WebMap from '../../components/WebMap'
import { entityKindClass } from '../../components/WebMap/leaflet.pm.patch'

const tmp = `<svg
  width="480" height="480"
  line-point-1="24,240"
  line-point-2="456,240">
  <path
    fill="none"
    stroke="red" stroke-width="3" stroke-linecap="square"
    d="M8,240
       a16,16 0 0,1 16,-16
       h80
       l15,-23 15,23 -15,23 -15,-23
       m30,0 h106
       v-65 l-4,6 4,-15 4,15 -4,-6 v35
       l-20,0 40,0 -20,0 v15
       l-20,0 40,0 -20,0 v15
       h106
       l15,-23 15,23 -15,23 -15,-23
       m30,0 h80
       a16,16 0 0,1 16,16" 
  />
</svg>`

const objects = [
  {
    id: 1,
    kind: entityKindClass.POINT,
    code: 'sfgpewrh--mt',
    options: { direction: 45 },
    point: [ 48.5, 35 ],
  }, {
    id: 2,
    kind: entityKindClass.POINT,
    code: '10011500521200000800',
    point: [ 48.5, 35.5 ],
  }, {
    id: 3,
    kind: entityKindClass.POINT,
    code: 'SHGPUCDT--AI',
    point: [ 48.5, 36 ],
  }, {
    id: 4,
    kind: entityKindClass.AREA,
    points: [ [ 47.8, 34.8 ], [ 48.2, 35.2 ], [ 47.8, 35 ] ],
    color: '#38f',
  }, {
    id: 5,
    kind: entityKindClass.SEGMENT,
    points: [ [ 47.5, 34.5 ], [ 47.55, 34.75 ] ],
    template: tmp,
    color: 'red',
  },
]

for (let i = 0; i < 1000; i++) {
  objects.push({
    id: i + 6,
    kind: entityKindClass.AREA,
    points: randomPoints(48, 35, 3, 3, 4),
    color: randomColor(),
  })
}

class ApplicationContent extends React.PureComponent {
  render () {
    return (
      <WebMap
        center={[ 48, 35 ]}
        zoom={7}
        objects={objects}
      >
        <Tiles
          source="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={20}
        />
      </WebMap>
    )
  }
}

/* <Tiles
  source="http://buyalo-w8:6080/arcgis/rest/services/ATO/MapServer/tile/{z}/{y}/{x}"
  maxZoom={17}
/> */

export default ApplicationContent

function randomPoints (baseLat, baseLon, delta, minCnt, maxCnt) {
  const c = minCnt + randomInt(maxCnt - minCnt)
  const r = []
  const startLat = baseLat + delta * Math.random()
  const startLon = baseLon + delta * Math.random()
  for (let i = 0; i < c; i++) {
    r.push([
      startLat + delta * Math.random() / 25,
      startLon + delta * Math.random() / 25,
    ])
  }
  return r
}

function randomColor () {
  return `#${randomD()}${randomD()}${randomD()}`
}

function randomD () {
  const d = '0123456789abcdef'
  const p = randomInt(16)
  return d.slice(p, p + 1)
}

function randomInt (max) {
  return Math.floor(Math.random() * max)
}
