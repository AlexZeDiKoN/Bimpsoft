import React from 'react'
import PropTypes from 'prop-types'
import memoize from 'memoize-one'
import i18n from '../../../../i18n'
import { changeDirections } from '../../../WebMap/patch/utils/flexGrid'

const getList = memoize((length, list) => [ ...Array(length) ]
  .map((_, i) => ({ value: i, name: `${i18n.DIRECTION} ${list.get(i) || ++i}` }))
)

const formFor = (Children) => {
  const child = (props) => {
    const { deselect, onCancel, onOk, flexGrid, ...rest } = props
    const { directions, directionNames } = flexGrid
    const list = getList(directions, directionNames)

    const handleClose = () => {
      deselect()
      onCancel()
    }

    const handleOkay = (computeParams) => {
      if (computeParams) {
        const { attrProps, geometryProps, id } = changeDirections(...computeParams)
        onOk(id, attrProps, geometryProps)
        handleClose()
      }
    }

    return (
      <Children
        deselect={deselect}
        flexGrid={flexGrid}
        list={list}
        onCancel={handleClose}
        onOk={handleOkay}
        {...rest}
      />
    )
  }

  child.propTypes = {
    select: PropTypes.func.isRequired,
    deselect: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    flexGrid: PropTypes.object.isRequired,
    onOk: PropTypes.func.isRequired,
  }

  return child
}

export default formFor
