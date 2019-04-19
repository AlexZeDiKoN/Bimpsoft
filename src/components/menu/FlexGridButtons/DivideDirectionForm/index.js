import React from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import { Radio } from 'antd'
import FocusTrap from 'react-focus-lock'
import { HotKey, HotKeysContainer } from '../../../common/HotKeys'
import i18n from '../../../../i18n'
import * as shortcuts from '../../../../constants/shortcuts'
// @TODO: вынести на пару уровней выше
import { dividingCurrent } from '../../../../utils/flexGridOperations'
import './divideDirectionForm.css'

const { Group: RGroup } = Radio

const { default: Form, buttonCancel, buttonYes, FormItem } = components.form
const directionOptions = (list) =>
  list.map(({ value, name }) => <Radio className={'dir_option'} value={value} key={value}>{name}</Radio>)

const getName = (list, i) => {
  const name = list.get(i)
  return name ? `№${++i} "${name}"` : `№${++i}`
}

// @TODO: Не экспортируются
function calcMiddlePoint (coords) {
  const zero = { lat: 0, lng: 0 }
  if (!coords.length) { return zero }
  const sum = coords.reduce((a, p) => {
    a.lat += p.lat
    a.lng += p.lng
    return a
  }, zero)
  return { lat: sum.lat / coords.length, lng: sum.lng / coords.length }
}

function formFlexGridGeometry (eternals, directionSegments, zoneSegments) {
  return {
    point: calcMiddlePoint(eternals.reduce((result, item) => result.concat(item), [])),
    geometry: [ eternals, directionSegments, zoneSegments ],
  }
}
//
const DivideDirectionForm = (props) => {
  const { select, deselect, onCancel, flexGrid, updateAttributes, updateGeometry } = props
  const { directions, directionNames, id } = flexGrid
  const list = [ ...Array(directions) ].map((_, i) => ({ value: i, name: `${getName(directionNames, i)}` }))
  const selected = React.createRef()

  const handleSelectDirection = ({ target: { value } }) => {
    deselect()
    select({ index: value })
  }

  const handleClose = () => {
    deselect()
    onCancel()
  }

  const handleOkay = () => {
    if (selected && selected.current) {
      const { current: { state: { value } } } = selected
      const { attrProps, geometryProps } = dividingCurrent(flexGrid, value)
      updateAttributes(id, { attributes: attrProps })
      updateGeometry(id, formFlexGridGeometry(...geometryProps))
      // onOk(newData)
    }
    handleClose()
  }

  return (
    <>
      <div className="not-clickable-area"/>
      <FocusTrap className="divide_wrapper">
        <HotKeysContainer>
          <Form className="divide_form">
            <div className="divide_form_title">{i18n.DIVIDE_DIRECTION}</div>
            <div className="divide_form_desc">{i18n.DIVIDE_DIRECTION_DESC}:</div>
            <FormItem>
              <RGroup onChange={handleSelectDirection} ref={selected}>
                {directionOptions(list)}
              </RGroup>
            </FormItem>
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

DivideDirectionForm.propTypes = {
  select: PropTypes.func.isRequired,
  deselect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  // onOk: PropTypes.func.isRequired,
  flexGrid: PropTypes.object.isRequired,
  updateGeometry: PropTypes.func.isRequired,
  updateAttributes: PropTypes.func.isRequired,
}

export default DivideDirectionForm
