/* global L */

import EditLine from './Edit.Line'
import DrawLine from './Draw.Line'
import EditRectangle from './Edit.Rectangle'
import DrawRectangle from './Draw.Rectangle'
import EditMarker from './Edit.Marker'

// ------------------------ Патч редактора Leaflet.PM ------------------------------------------------------------------
L.PM.Edit.Line = EditLine
L.PM.Draw.Line = DrawLine
L.PM.Edit.Rectangle = EditRectangle
L.PM.Draw.Rectangle = DrawRectangle
L.PM.Edit.Marker = EditMarker
