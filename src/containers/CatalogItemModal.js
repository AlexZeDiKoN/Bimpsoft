import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { MovablePanel } from '@C4/CommonComponents'
import TopoObjModal from '../components/TopoObjModal'
import { actionNames } from '../store/actions/webMap'

const emptyFunc = () => null

const CatalogItemModal = ({ wrapper }) => {
  const data = useSelector((state) => state?.webMap?.catalogModalData)
  const dispatch = useDispatch()
  const onClose = () => dispatch({ type: actionNames.SET_CATALOG_MODAL_DATA, payload: { visible: false } })
  const props = {
    serviceStatus: true,
    selectTopographicItem: emptyFunc,
    onClose,
    wrapper,
    topographicObjects: {
      visible: data.visible,
      location: data?.location,
      selectedItem: 0,
      features: [ {
        properties: data.properties,
      } ],
    },
  }
  return <TopoObjModal {...props} />
}

CatalogItemModal.propTypes = {
  wrapper: PropTypes.oneOf([ MovablePanel ]),
}

export default CatalogItemModal
