import React, { Component } from 'react'
// import React, { useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import { Radio } from 'antd'
import './divideDirectionForm.css'
import FocusTrap from 'react-focus-lock'
import { HotKey, HotKeysContainer } from '../../../common/HotKeys'
import i18n from '../../../../i18n'
import * as shortcuts from '../../../../constants/shortcuts'
import { dividingCurrent } from '../../../../utils/flexGridOperations'

const { Group: RGroup } = Radio

const { default: Form, buttonCancel, buttonYes, FormItem } = components.form
const directionOptions = (list) =>
  list.map(({ value, name }) => <Radio className={'dir_option'} value={value} key={value}>{name}</Radio>)

const getName = (list, i) => {
  const name = list.get(i)
  return name ? `№${++i} "${name}"` : `№${++i}`
}
// @TODO: ДЕЛАТЬ!!!!!!
class DivideDirectionForm extends Component {
  state = {
    selected: null,
    list: [],
  }

  static getDerivedStateFromProps = (props, state) => {
    const { directions, directionNames } = props
    if (directions !== state.list.length) {
      const list = [ ...Array(directions) ].map((_, i) => ({ value: i, name: `${getName(directionNames, i)}` }))
      return { list }
    }
  }

  // @TODO: подсвечивать и заносить во внутренний редьюсер
  handleSelectDirection = (e) => {
    const { select, deselect } = this.props
    const selected = e.target.value
    deselect({})
    select({ index: selected })
    this.setState({ selected })
  }

  handleClose = () => {
    const { onCancel, deselect } = this.props
    deselect({})
    onCancel()
  }

  handleOkay = () => {
    const { selected } = this.state
    if (selected) {
      const { flexGrid } = this.props
      dividingCurrent(flexGrid, selected)
    }
    console.log('handleOkay')
    this.props.onCancel()
  }

  render () {
    const { selected, list } = this.state

    return (
      <>
        <div className="not-clickable-area"/>
        <FocusTrap className="divide_wrapper">
          <HotKeysContainer>
            <Form className="divide_form">
              <div className="divide_form_title">{i18n.DIVIDE_DIRECTION}</div>
              <div className="divide_form_desc">{i18n.DIVIDE_DIRECTION_DESC}:</div>
              <FormItem>
                <RGroup onChange={this.handleSelectDirection} value={selected}>
                  {directionOptions(list)}
                </RGroup>
              </FormItem>
              <FormItem>
                {buttonYes(this.handleOkay)}
                <HotKey selector={shortcuts.ESC} onKey={this.handleClose}/>
                {buttonCancel(this.handleClose)}
              </FormItem>
            </Form>
          </HotKeysContainer>
        </FocusTrap>
      </>
    )
  }
}

DivideDirectionForm.propTypes = {
  directionNames: PropTypes.object.isRequired,
  directions: PropTypes.number.isRequired,
  onOk: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
  select: PropTypes.func,
  deselect: PropTypes.func,
}

export default DivideDirectionForm
