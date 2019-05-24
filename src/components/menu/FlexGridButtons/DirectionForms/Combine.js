import React, { useState } from 'react'
import PropTypes from 'prop-types'
import memoize from 'memoize-one'
import { Checkbox } from 'antd'
import * as i18n from '../../../../i18n/ua'
import BaseForm from './BaseForm'

const isChecked = memoize((min, max) => (i) => min !== null && max !== null && i >= min && i <= max)
const isDisabled = memoize((min, max) => (i) => min !== null && max !== null && (
  (i > max + 1 || i < min - 1) ||
  (i < max && i > min))
)
const Combine = (props) => {
  const { deselect, select, flexGrid, ...rest } = props
  const [ selected, setSelected ] = useState({ from: null, to: null })

  const disabled = isDisabled(selected.from, selected.to)
  const checked = isChecked(selected.from, selected.to)
  const computeParams = selected.from < selected.to && [ flexGrid, selected.from, selected.to ]

  const setFromTo = (from, to) => from > to ? setSelected({ from: null, to: null }) : setSelected({ from, to })
  const updateState = (value, checked) => {
    const { from, to } = selected
    switch (true) {
      case from === null:
        return setFromTo(value, value)
      case !checked:
        return value === from ? setFromTo(from + 1, to) : setFromTo(from, to - 1)
      default:
        return value > to ? setFromTo(from, value) : setFromTo(value, to)
    }
  }

  const updateHighLight = (value, checked) => checked ? select({ index: value }) : deselect({ index: value })

  return (
    <BaseForm
      title={i18n.COMBINE_DIRECTIONS}
      description={i18n.CHOOSE_DIRECTIONS}
      computeParams={computeParams}
      isDisabled={disabled}
      isChecked={checked}
      option={Checkbox}
      updateState={updateState}
      updateHighLight={updateHighLight}
      okBtnText={i18n.COMBINE}
      {...rest}
    />
  )
}

Combine.propTypes = {
  deselect: PropTypes.func.isRequired,
  select: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  flexGrid: PropTypes.object.isRequired,
  list: PropTypes.array,
}

export default Combine
