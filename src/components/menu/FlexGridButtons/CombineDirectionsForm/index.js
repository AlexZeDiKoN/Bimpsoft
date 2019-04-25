import React, { useState } from 'react'
import PropTypes from 'prop-types'
import memoize from 'memoize-one'
import { components } from '@DZVIN/CommonComponents'
import { Checkbox } from 'antd'
import FocusTrap from 'react-focus-lock'
import { HotKey, HotKeysContainer } from '../../../common/HotKeys'
import i18n from '../../../../i18n'
import * as shortcuts from '../../../../constants/shortcuts'
import { combineDirections } from '../../../WebMap/patch/utils/flexGrid'
import './combineDirectionsForm.scss'

const { default: Form, buttonCancel, buttonYes, FormItem } = components.form

const isChecked = (val, min, max) => min !== null && max !== null && val >= min && val <= max
const isDisabled = memoize((min, max) => (i) => min !== null && max !== null && (
  (i > max + 1 || i < min - 1) ||
  (i < max && i > min))
)

const getList = memoize((length, list) => [ ...Array(length) ]
  .map((_, i) => ({ value: i, name: `${i18n.DIRECTION} ${++i} ${list.get(i) || ''}` }))
)

const CombineDirectionsForm = (props) => {
  const { select, deselect, onCancel, onOk, flexGrid } = props
  const { directions, directionNames, id } = flexGrid
  const [ selected, setSelected ] = useState({ from: null, to: null })
  const disabled = isDisabled(selected.from, selected.to)
  const list = getList(directions, directionNames)

  const setFromTo = (from, to) => from > to ? setSelected({ from: null, to: null }) : setSelected({ from, to })

  const handleSelect = ({ target: { value, checked } }) => {
    const { from, to } = selected
    checked ? select({ index: value }) : deselect({ index: value })
    if (from === null) {
      return setFromTo(value, value)
    } else if (!checked) {
      return value === from ? setFromTo(from + 1, to) : setFromTo(from, to - 1)
    } else {
      return value > to ? setFromTo(from, value) : setFromTo(value, to)
    }
  }

  const handleClose = () => {
    deselect()
    onCancel()
  }

  const handleOkay = () => {
    const { from, to } = selected
    if (from < to) {
      const { attrProps, geometryProps } = combineDirections(flexGrid, from, to)
      onOk(id, attrProps, geometryProps)
    }
    handleClose()
  }

  const options = list.map(({ value, name }) =>
    <div key={value}>
      <Checkbox
        className={'dir_option'}
        value={value}
        disabled={disabled(value)}
        checked={isChecked(value, selected.from, selected.to)}
        onChange={handleSelect}
      >
        {name}
      </Checkbox>
    </div>
  )

  return (
    <>
      <div className="not-clickable-area"/>
      <FocusTrap className="divide_wrapper">
        <HotKeysContainer>
          <Form className="divide_form">
            <div className="divide_form_title">{i18n.COMBINE_DIRECTIONS}</div>
            <div className="divide_form_desc">{i18n.CHOOSE_DIRECTIONS}:</div>
            <FormItem><div>{options}</div></FormItem>
            <FormItem>
              {buttonYes(handleOkay)}
              {buttonCancel(handleClose)}
              <HotKey selector={shortcuts.ESC} onKey={handleClose}/>
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
