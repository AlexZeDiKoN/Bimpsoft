import { createSelector } from 'reselect'
import entityKind from '../../components/WebMap/entityKind'

export const selectedList = ({ selection: { list } }) => list
const objects = ({ webMap: { objects } }) => objects

export const selectedTypes = createSelector(
  objects,
  selectedList,
  (objects, list) => list
    ? list.map((id) => objects.getIn([ id, 'type' ]))
    : []
)

export const selectedPoints = createSelector(
  objects,
  selectedList,
  (objects, list) => list
    ? list
      .map((id) => objects.get(id).toJS())
      .filter(({ type }) => type === entityKind.POINT)
    : []
)
