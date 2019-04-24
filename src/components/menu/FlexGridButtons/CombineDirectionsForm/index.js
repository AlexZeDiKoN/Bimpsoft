import React, { Component } from 'react'
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

const getName = (list, i) => `Напрямок ${++i} ${list.get(i) || ''}`
const isDisabled = memoize((len, min, max) => (i) => len && (
  (i > max || i < min) ||
  (i < max - 1 && i > min + 1))
)

// @TODO: хранить начало и конец выборки, чекбоксы вынести из группы, переделать компонент в функциональный с хуком
class CombineDirectionsForm extends Component {
  state = {
    selected: [],
    disableMin: null,
    disableMax: null,
  }

  handleSelectDirection = (selected) => {
    const { select, deselect } = this.props
    if (this.state.selected.length < selected.length) {
      const current = R.last(selected)
      select({ index: current })
    } else {
      const current = R.last(this.state.selected)
      deselect({ index: current })
    }
    const disableMin = Math.min(...selected) - 1
    const disableMax = Math.max(...selected) + 1
    this.setState({ selected, disableMin, disableMax })
  }

  handleClose = () => {
    const { deselect, onCancel } = this.props
    deselect()
    onCancel()
  }

  handleOkay = () => {
    const { selected } = this.state
    const { onOk, flexGrid } = this.props
    const { id } = flexGrid
    console.log('selected', selected)
    console.log('id', id)
    if (selected.length) {
      const { attrProps, geometryProps } = combineDirections(flexGrid, selected)
      onOk(id, attrProps, geometryProps)
    }
    this.handleClose()
  }

  getList = memoize(() => {
    const { flexGrid } = this.props
    const { directions, directionNames } = flexGrid
    return [ ...Array(directions) ].map((_, i) => ({ value: i, name: `${getName(directionNames, i)}` }))
  })

  render () {
    const { disableMin, disableMax, selected } = this.state
    const list = this.getList()
    const disabled = isDisabled(selected.length, disableMin, disableMax)
    return (
      <>
        <div className="not-clickable-area"/>
        <FocusTrap className="divide_wrapper">
          <HotKeysContainer>
            <Form className="divide_form">
              <div className="divide_form_title">{i18n.DIVIDE_DIRECTION}</div>
              <div className="divide_form_desc">{i18n.CHOOSE_DIRECTION}:</div>
              <FormItem>
                <CGroup onChange={this.handleSelectDirection} value={selected}>
                  {
                    list.map(({ value, name }, i) =>
                      <Checkbox
                        className={'dir_option'}
                        value={value}
                        key={value}
                        disabled={disabled(i)}
                      >
                        {name}
                      </Checkbox>)
                  }
                </CGroup>
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

CombineDirectionsForm.propTypes = {
  select: PropTypes.func.isRequired,
  deselect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  flexGrid: PropTypes.object.isRequired,
}

export default CombineDirectionsForm
