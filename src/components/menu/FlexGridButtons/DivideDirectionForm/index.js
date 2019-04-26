import React, { useState } from 'react'
import PropTypes from 'prop-types'
import memoize from 'memoize-one'
import FocusTrap from 'react-focus-lock'
import { components } from '@DZVIN/CommonComponents'
import { Radio } from 'antd'
import { HotKey, HotKeysContainer } from '../../../common/HotKeys'
import i18n from '../../../../i18n'
import * as shortcuts from '../../../../constants/shortcuts'
import { changeDirections } from '../../../WebMap/patch/utils/flexGrid'
import './divideDirectionForm.css'

const { default: Form, buttonCancel, buttonYes, FormItem } = components.form

const getList = memoize((length, list) => [ ...Array(length) ]
  .map((_, i) => ({ value: i, name: `${i18n.DIRECTION} ${++i} ${list.get(i) || ''}` }))
)

// @TODO: отказ от использования
const DivideDirectionForm = (props) => {
  const { select, deselect, onCancel, flexGrid, onOk } = props
  const { directions, directionNames, id } = flexGrid
  const list = getList(directions, directionNames)
  const [ selected, setSelected ] = useState(null)
  const checked = (i) => i === selected
  const handleSelect = ({ target: { value } }) => {
    deselect()
    select({ index: value })
    setSelected(value)
  }

  const handleClose = () => {
    deselect()
    onCancel()
  }

  const handleOkay = () => {
    if (selected !== null) {
      const { attrProps, geometryProps } = changeDirections(flexGrid, selected)
      onOk(id, attrProps, geometryProps)
    }
    handleClose()
  }

  const options = list.map(({ value, name }) =>
    <div key={value}>
      <Radio
        className={'dir_option'}
        value={value}
        checked={checked(value)}
        onChange={handleSelect}
      >
        {name}
      </Radio>
    </div>
  )

  return (
    <>
      <div className="not-clickable-area"/>
      <FocusTrap className="divide_wrapper">
        <HotKeysContainer>
          <Form className="divide_form">
            <div className="divide_form_title">{i18n.DIVIDE_DIRECTION}</div>
            <div className="divide_form_desc">{i18n.CHOOSE_DIRECTION}:</div>
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

DivideDirectionForm.propTypes = {
  select: PropTypes.func.isRequired,
  deselect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  flexGrid: PropTypes.object.isRequired,
}

export default DivideDirectionForm
