import React from 'react'
import { connect, useSelector } from 'react-redux'
import { close } from '../store/actions/task'
import { CATALOG_FILTER_TYPE } from '../constants/modals'
import { catalogFilters, getModalData, catalogsFields } from '../store/selectors'
import { CatalogFilterModal } from '../components/Catalogs/FilterModal'
import { removeFilterCatalog, setFilterCatalog } from '../store/actions/filter'

const mapStateToProps = (store) => {
  const modalData = getModalData(store)
  const catalogFieldsData = catalogsFields(store)?.[modalData?.id]
  return {
    data: catalogFilters(store)?.[modalData?.id],
    fields: catalogFieldsData?.attributes,
    title: catalogFieldsData?.name,
    catalogId: modalData?.id,
  }
}

const mapDispatchToProps = {
  onClose: close,
  onSave: setFilterCatalog,
  onRemove: removeFilterCatalog,
}

const ModalForm = connect(mapStateToProps, mapDispatchToProps)(CatalogFilterModal)

export default function CatalogFilterContainer (props) {
  const visible = useSelector((state) => getModalData(state)?.type === CATALOG_FILTER_TYPE)
  return visible ? <ModalForm {...props} visible={visible}/> : null
}
