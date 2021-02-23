import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { MovablePanel } from '@C4/CommonComponents'
import TopoObjModal from '../components/TopoObjModal'
import { setCatalogModal } from '../store/actions/webMap'
import { CATALOG_OBJECT_CARD } from '../i18n/ua'

const emptyFunc = () => null
const toFixed = (item, round = 6) => item ? item.toFixed(round) : item
const normalizeLocation = (item) => ({ lat: toFixed(item?.lat), lng: toFixed(item?.lng) })

const CatalogItemModal = ({ wrapper }) => {
  const data = useSelector((state) => state?.webMap?.catalogModal)
  const dispatch = useDispatch()
  const onClose = () => dispatch(setCatalogModal())
  const props = {
    serviceStatus: true,
    selectTopographicItem: emptyFunc,
    onClose,
    wrapper,
    topographicObjects: {
      visible: data.visible,
      location: normalizeLocation(data?.location),
      selectedItem: 0,
      features: data?.features,
    },
  }
  return <TopoObjModal {...props} title={CATALOG_OBJECT_CARD}/>
}

CatalogItemModal.propTypes = {
  wrapper: PropTypes.oneOf([ MovablePanel ]),
}

export default CatalogItemModal
