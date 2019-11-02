import { createSelector } from 'reselect'
import entityKind from '../../components/WebMap/entityKind'

const objects = ({ webMap: { objects } }) => objects
export const selectedList = ({ selection: { list } }) => list

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
      .filter(({ type, parent }) => type === entityKind.POINT && !parent)
    : []
)
