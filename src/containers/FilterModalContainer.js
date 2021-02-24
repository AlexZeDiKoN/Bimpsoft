import React from 'react'
import { connect, useSelector } from 'react-redux'
import { close as onClose } from '../store/actions/task'
import {
  CREATE_NEW_LAYER_TYPE,
  MIL_SYMBOL_FILTER_TYPE,
  TOPOGRAPHIC_OBJECT_FILTER_TYPE,
} from '../constants/modals'
import {
  getModalData,
  layersById,
  loadingFiltersStatus,
  catalogsTopographicByIds,
  topographicObjectsFilters,
  catalogAttributesFieldsById,
  flexGridPresent,
  isCatalogLayerFunc,
} from '../store/selectors'
import {
  MilSymbolFilterModal,
  CreateNewLayerModal,
  TopographicObjectFilterModal,
} from '../components/Filter/Modals'
import {
  onSaveMilSymbolFilters,
  onRemoveMilSymbolFilter,
  onCreateLayerAndCopyUnits,
  onSaveTopographicObjectFilter,
  onRemoveTopographicObjectFilter,
} from '../store/actions/filter'

// ------------------------------------------ Mil Symbol Container -------------------------------------------
const MilSymbolModalForm = connect(
  ({ orgStructures, ovt, dictionaries, ...store }) => {
    const modalData = getModalData(store)
    return {
      ...modalData,
      layerData: layersById(store)?.[modalData?.data?.layer],
      orgStructures: {
        byIds: orgStructures.byIds,
        roots: orgStructures.roots,
      },
      catalogAttributesFields: catalogAttributesFieldsById(modalData?.data?.layer)(store),
      ovtData: ovt?.ovtData,
      ovtKind: dictionaries.dictionaries?.ovtKind,
      ovtSubKind: dictionaries.dictionaries?.ovtSubkind,
      isCatalogLayerFunc: isCatalogLayerFunc(store),
    }
  },
  {
    onClose,
    onSave: onSaveMilSymbolFilters,
    onRemove: onRemoveMilSymbolFilter,
  },
)(MilSymbolFilterModal)

// ------------------------------------------ Create New Layer Container -------------------------------------------
const CreateNewLayerModalForm = connect((store) => ({
  disabled: loadingFiltersStatus(store),
}),
{
  onClose,
  onSave: onCreateLayerAndCopyUnits,
},
)(CreateNewLayerModal)

// ------------------------------------------ Open Topographic Object Modal -------------------------------------------
const TopographicObjectModalForm = connect((store) => {
  const modalData = getModalData(store) ?? {}
  const { name, attributes } = catalogsTopographicByIds(store)?.[modalData.id] ?? {}
  return {
    title: name,
    fields: attributes,
    data: topographicObjectsFilters(store)?.[modalData.id]?.filters,
    flexGridPresent: flexGridPresent(store),
  }
},
{
  onClose,
  onSave: onSaveTopographicObjectFilter,
  onRemove: onRemoveTopographicObjectFilter,
},
)(TopographicObjectFilterModal)

// ------------------------------------------ Filter Modals Switch ------------------------------------------------
export default function FilterModalContainer (props) {
  const type = useSelector((state) => getModalData(state)?.type)
  switch (type) {
    case (MIL_SYMBOL_FILTER_TYPE): return <MilSymbolModalForm {...props} isFilterMode />
    case (CREATE_NEW_LAYER_TYPE): return <CreateNewLayerModalForm {...props}/>
    case (TOPOGRAPHIC_OBJECT_FILTER_TYPE): return <TopographicObjectModalForm {...props}/>
    default: return <></>
  }
}
