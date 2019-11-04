import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'
import OrgStructuresComponent from '../components/OrgStructuresComponent'
import { selection, orgStructures, webMap } from '../store/actions'
import { canEditSelector, visibleLayersSelector } from '../store/selectors'
import { catchErrors } from '../store/actions/asyncAction'

const mapStateToProps = (state) => {
  const { orgStructures, layers, webMap } = state
  const canEdit = canEditSelector(state)
  const { byIds, roots, formation, selectedId, textFilter, expandedIds, commandPostsById } = orgStructures
  const selectedLayer = layers.selectedId
  const onMapObjects = webMap.objects
  const onLayersById = visibleLayersSelector(state)
  return {
    canEdit,
    selectedId,
    textFilter,
    expandedIds,
    byIds,
    roots,
    formation,
    commandPostsById,
    selectedLayer,
    onMapObjects,
    onLayersById,
  }
}

const mapDispatchToProps = {
  selectList: selection.selectedList,
  onExpand: orgStructures.expandOrgStructureItem,
  onFilterTextChange: orgStructures.setOrgStructuresFilterText,
  onClick: orgStructures.setOrgStructureSelectedId,
  onDoubleClick: (unitID) => (dispatch, getState) => {
    const state = getState()
    const {
      webMap: { center, objects, subordinationLevel },
      selection: { preview },
    } = state
    const canEdit = canEditSelector(state)
    const unitObjects = objects.filter((object) => object.unit === unitID)
    if (unitObjects.size) {
      const selList = [ ...unitObjects.keys() ]
      const batch = preview
        ? []
        : [
          selection.selectedList(selList),
          webMap.setScaleToSelection(true),
        ]
      const minLevel = unitObjects.reduce((minLevel, { level }) => Math.min(minLevel, level), subordinationLevel)
      if (minLevel !== subordinationLevel) {
        batch.push(webMap.setSubordinationLevel(minLevel))
      }
      dispatch(batchActions(batch))
    } else if (canEdit) {
      dispatch(selection.newShapeFromUnit(unitID, center))
    }
  },
}

const OrgStructuresContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps)
)(OrgStructuresComponent)

export default OrgStructuresContainer
