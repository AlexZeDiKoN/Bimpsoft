import { createSelector } from 'reselect'
import entityKind from '../../components/WebMap/entityKind'

const objects = ({ webMap: { objects } }) => objects
const flexGrid = ({ flexGrid: { flexGrid } }) => flexGrid
export const selectedList = ({ selection: { list } }) => list
export const selectedNewShape = ({ selection: { newShape } }) => newShape
export const getObjectPreview = ({ selection: { preview } }) => preview

export const selectedTypes = createSelector(
  objects,
  selectedList,
  (objects, list) => list
    ? list.map((id) => objects.getIn([ id, 'type' ]))
    : []
)

export const flexGridSelected = createSelector(
  flexGrid,
  selectedList,
  (flexGrid, list) => list && flexGrid && list.length === 1 && list[0] === flexGrid.id
)

export const selectedPoints = createSelector(
  objects,
  selectedList,
  (objects, list) => list
    ? list
      .map((id) => objects.get(id))
      .filter(Boolean)
      .map((item) => item.toJS())
      .filter(({ type, parent }) => type === entityKind.POINT && !parent)
    : []
)
