import L from 'leaflet'

L.PM.Edit.Sophisticated = L.PM.Edit.Line.extend({

})

function initSophisticated () {
  if (!this.options.pmIgnore) {
    this.pm = new L.PM.Edit.Sophisticated(this)
  }
}

L.Sophisticated.addInitHook(initSophisticated)
