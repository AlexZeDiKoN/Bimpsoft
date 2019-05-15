import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Radio } from 'antd'
import * as i18n from '../../../../i18n/ua'
import BaseForm from './BaseForm'

const Divide = (props) => {
  const { deselect, select, flexGrid, ...rest } = props
  const [ selected, setSelected ] = useState(null)
  const checked = (i) => i === selected
  const computeParams = selected !== null && [ flexGrid, selected ]

  const updateHighLight = (value) => {
    deselect()
    select({ index: value })
  }

  return (
    <BaseForm
      title={i18n.DIVIDE_DIRECTION}
      description={i18n.CHOOSE_DIRECTION}
      computeParams={computeParams}
      option={Radio}
      isChecked={checked}
      updateState={setSelected}
      updateHighLight={updateHighLight}
      okBtnText={i18n.DIVIDE}
      {...rest}
    />
  )
}

Divide.propTypes = {
  deselect: PropTypes.func.isRequired,
  select: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  flexGrid: PropTypes.object.isRequired,
  list: PropTypes.array,
}

export default Divide
