import React from 'react'
import { connect, useSelector } from 'react-redux'
import { close as onClose } from '../store/actions/task'
import { CATALOG_FILTER_TYPE, CREATE_NEW_LAYER_TYPE, MIL_SYMBOL_FILTER_TYPE } from '../constants/modals'
import {
  catalogFilters,
  getModalData,
  catalogsFields,
  layersById,
  loadingFiltersStatus,
} from '../store/selectors'
import { CatalogFilterModal, MilSymbolFilterModal, CreateNewLayerModal } from '../components/Filter/Modals'
import {
  onSaveMilSymbolFilters,
  onRemoveMilSymbolFilter,
  removeFilterCatalog,
  setFilterCatalog, onCreateLayerAndCopyUnits,
} from '../store/actions/filter'

// ------------------------------------------ Catalog Container -----------------------------------------------
const CatalogModalForm = connect(
  (store) => {
    const modalData = getModalData(store)
    const catalogFieldsData = catalogsFields(store)?.[modalData?.id]
    return {
      data: catalogFilters(store)?.[modalData?.id],
      fields: catalogFieldsData?.attributes,
      title: catalogFieldsData?.name,
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
  ({ orgStructures, ovt, ...store }) => {
    const modalData = getModalData(store)
    return {
      ...modalData,
      layerData: layersById(store)?.[modalData?.data?.layer],
      orgStructures: {
        byIds: orgStructures.byIds,
        roots: orgStructures.roots,
      },
      ovtData: ovt?.ovtData,
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

// ------------------------------------------ Filter Modals Switch ------------------------------------------------
export default function FilterModalContainer (props) {
  const type = useSelector((state) => getModalData(state)?.type)
  switch (type) {
    case (CATALOG_FILTER_TYPE): return <CatalogModalForm {...props}/>
    case (MIL_SYMBOL_FILTER_TYPE): return <MilSymbolModalForm {...props}/>
    case (CREATE_NEW_LAYER_TYPE): return <CreateNewLayerModalForm {...props}/>
    default: return <></>
  }
}
