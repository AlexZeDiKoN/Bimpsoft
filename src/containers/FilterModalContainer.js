import React from 'react'
import { connect, useSelector } from 'react-redux'
import { close } from '../store/actions/task'
import { CATALOG_FILTER_TYPE, MIL_SYMBOL_FILTER_TYPE } from '../constants/modals'
import { catalogFilters, getModalData, catalogsFields } from '../store/selectors'
import { CatalogFilterModal, MilSymbolFilterModal } from '../components/Filter/Modals'
import {
  onSaveMilSymbolFilters,
  onRemoveMilSymbolFilter,
  removeFilterCatalog,
  setFilterCatalog,
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
    onClose: close,
    onSave: setFilterCatalog,
    onRemove: removeFilterCatalog,
  },
)(CatalogFilterModal)

// ------------------------------------------ Mil Symbol Container -------------------------------------------
const MilSymbolModalForm = connect(
  ({ orgStructures, ovt, ...store }) => {
    return {
      ...getModalData(store),
      orgStructures: {
        byIds: orgStructures.byIds,
        roots: orgStructures.roots,
      },
      ovtData: ovt?.ovtData,
    }
  },
  {
    onClose: close,
    onSave: onSaveMilSymbolFilters,
    onRemove: onRemoveMilSymbolFilter,
  },
)(MilSymbolFilterModal)

// ------------------------------------------ Filter Modals Switch ------------------------------------------------
export default function FilterModalContainer (props) {
  const type = useSelector((state) => getModalData(state)?.type)
  switch (type) {
    case (CATALOG_FILTER_TYPE): return <CatalogModalForm {...props}/>
    case (MIL_SYMBOL_FILTER_TYPE): return <MilSymbolModalForm {...props}/>
    default: return <></>
  }
}
