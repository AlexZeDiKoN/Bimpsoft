import React from 'react'
// import React, { useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import { Radio } from 'antd'
import './divideDirectionForm.css'
import FocusTrap from 'react-focus-lock'
import { HotKey, HotKeysContainer } from '../../common/HotKeys'
// import i18n from '../../../i18n'
import * as shortcuts from '../../../constants/shortcuts'

const { Group: RGroup } = Radio

const { default: Form, buttonCancel, buttonYes, FormItem } = components.form
const directionOptions = (list) =>
  list.map(({ value, name }) => <Radio className={'dir_option'} value={value} key={value}>{name}</Radio>)

// @TODO: directions превращать в список опций: номер: имя или номер
// @TODO: читай то, что в ончендж
// @TODO: при ничего не вібранном не давать віполниться онОк
const DivideDirectionForm = (props) => {
  const { directions, onOk, onCancel } = props

  return (
    <>
      <div className="not-clickable-area"/>
      <FocusTrap className="confirm-delete-overflow">
        <HotKeysContainer>
          <Form className="confirm-delete">
            <FormItem>
              <RGroup onChange={'подсвечивать и заносить во внутренний редьюсер'} value={'useReducer hook use'}>
                {directionOptions(directions)}
              </RGroup>
            </FormItem>
            <FormItem>
              {buttonYes(onOk)}
              <HotKey selector={shortcuts.ESC} onKey={onCancel}/>
              {buttonCancel(onCancel)}
            </FormItem>
          </Form>
        </HotKeysContainer>
      </FocusTrap>
    </>
  )
}

DivideDirectionForm.propTypes = {
  directionNames: PropTypes.array.isRequired,
  directions: PropTypes.number.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,

}
