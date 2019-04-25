import React, { useState } from 'react'
import PropTypes from 'prop-types'
import memoize from 'memoize-one'
import * as R from 'ramda'
import { components } from '@DZVIN/CommonComponents'
import { Checkbox } from 'antd'
import FocusTrap from 'react-focus-lock'
import { HotKey, HotKeysContainer } from '../../../common/HotKeys'
import i18n from '../../../../i18n'
import * as shortcuts from '../../../../constants/shortcuts'
import { combineDirections } from '../../../WebMap/patch/utils/flexGrid'
import './combineDirectionsForm.css'

const { Group: CGroup } = Checkbox

const { default: Form, buttonCancel, buttonYes, FormItem } = components.form

const getList = memoize((length, list) => [ ...Array(length) ]
  .map((_, i) => ({ value: i, name: `Напрямок ${++i} ${list.get(i) || ''}` }))
)

const isDisabled = memoize((len, min, max) => (i) => len && (
  (i > max + 1 || i < min - 1) ||
  (i < max && i > min))
)

const CombineDirectionsForm = (props) => {
  const { select, deselect, onCancel, onOk, flexGrid } = props
  const { directions, directionNames, id } = flexGrid
  const [ selected, setSelected ] = useState({ list: [], from: null, to: null })

  const handleSelect = (list) => {
    if (selected.list.length < list.length) {
      const current = R.last(list)
      select({ index: current })
    } else {
      const current = R.last(selected.list)
      deselect({ index: current })
    }
    const from = Math.min(...list)
    const to = Math.max(...list)
    setSelected({ list, from, to })
  }

  const handleClose = () => {
    deselect()
    onCancel()
  }

  const handleOkay = () => {
    const { list, from, to } = selected
    if (list.length > 1) {
      const { attrProps, geometryProps } = combineDirections(flexGrid, from, to)
      onOk(id, attrProps, geometryProps)
    }
    handleClose()
  }

  const disabled = isDisabled(selected.list.length, selected.from, selected.to)
  const list = getList(directions, directionNames)

  const options = list.map(({ value, name }) =>
    <Checkbox className={'dir_option'} value={value} key={value} disabled={disabled(value)}>{name}</Checkbox>
  )

  return (
    <>
      <div className="not-clickable-area"/>
      <FocusTrap className="divide_wrapper">
        <HotKeysContainer>
          <Form className="divide_form">
            <div className="divide_form_title">{i18n.DIVIDE_DIRECTION}</div>
            <div className="divide_form_desc">{i18n.CHOOSE_DIRECTION}:</div>
            <FormItem><CGroup onChange={handleSelect} value={selected.list}>{options}</CGroup></FormItem>
            <FormItem>
              {buttonYes(handleOkay)}
              <HotKey selector={shortcuts.ESC} onKey={handleClose}/>
              {buttonCancel(handleClose)}
            </FormItem>
          </Form>
        </HotKeysContainer>
      </FocusTrap>
    </>
  )
}

CombineDirectionsForm.propTypes = {
  select: PropTypes.func.isRequired,
  deselect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  flexGrid: PropTypes.object.isRequired,
}

export default CombineDirectionsForm
