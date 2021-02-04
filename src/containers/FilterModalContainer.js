import React from 'react'
import { connect, useSelector } from 'react-redux'
import { close as onClose } from '../store/actions/task'
import {
  CATALOG_FILTER_TYPE,
  CREATE_NEW_LAYER_TYPE,
  MIL_SYMBOL_FILTER_TYPE,
  TOPOGRAPHIC_OBJECT_FILTER_TYPE,
} from '../constants/modals'
import {
  catalogFilters,
  getModalData,
  catalogsFields,
  layersById,
  loadingFiltersStatus,
  getCatalogsByIds,
  catalogsTopographicByIds,
  topographicObjectsFilters,
} from '../store/selectors'
import {
  CatalogFilterModal,
  MilSymbolFilterModal,
  CreateNewLayerModal,
  TopographicObjectFilterModal,
} from '../components/Filter/Modals'
import {
  onSaveMilSymbolFilters,
  onRemoveMilSymbolFilter,
  removeFilterCatalog,
  setFilterCatalog,
  onCreateLayerAndCopyUnits,
  onSaveTopographicObjectFilter,
  onRemoveTopographicObjectFilter,
} from '../store/actions/filter'

// ------------------------------------------ Catalog Container -----------------------------------------------
const CatalogModalForm = connect(
  (store) => {
    const modalData = getModalData(store)
    return {
      data: catalogFilters(store)?.[modalData?.id],
      fields: catalogsFields(store)?.[modalData?.id],
      title: getCatalogsByIds(store)?.[modalData?.id]?.name,
      catalogId: modalData?.id,
    }
  },
  {
    onClose,
    onSave: setFilterCatalog,
    onRemove: removeFilterCatalog,
  },
)(CatalogFilterModal)

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
      ovtData: ovt?.ovtData,
      ovtKind: dictionaries.dictionaries?.ovtKind,
      ovtSubKind: dictionaries.dictionaries?.ovtSubkind,
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
    case (CATALOG_FILTER_TYPE): return <CatalogModalForm {...props}/>
    case (MIL_SYMBOL_FILTER_TYPE): return <MilSymbolModalForm {...props} isFilterMode />
    case (CREATE_NEW_LAYER_TYPE): return <CreateNewLayerModalForm {...props}/>
    case (TOPOGRAPHIC_OBJECT_FILTER_TYPE): return <TopographicObjectModalForm {...props}/>
    default: return <></>
  }
}
