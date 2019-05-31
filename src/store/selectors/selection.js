import { createSelector } from 'reselect'

export const selectedList = ({ selection: { list } }) => list
const objects = ({ webMap: { objects } }) => objects

export const selectedTypes = createSelector(
  objects,
  selectedList,
  (objects, list) => list
    ? list.map((id) => objects.getIn([ id, 'type' ]))
    : []
)
