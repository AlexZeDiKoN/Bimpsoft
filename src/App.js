import React, { Component } from 'react'
import { WebMap, Tiles } from './components/WebMap'
import './App.css'

class App extends Component {
  render () {
    return (
      <div className="App">
        <WebMap
          center={[ 48, 35 ]}
          zoom={7}
        >
          <Tiles
            source="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={20}
          />
          <Tiles
            source="http://buyalo-w8:6080/arcgis/rest/services/ATO/MapServer/tile/{z}/{y}/{x}"
            maxZoom={17}
          />
        </WebMap>
      </div>
    )
  }
}

export default App
