import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox, FormRow } from '@C4/CommonComponents'
import { model } from '@C4/MilSymbolEditor'
import { AMPLIFIERS_GROUPS, COORDINATES } from '../../constants/params'
import i18n from '../../i18n'

const { symbolOptions, amplifiersData } = model

const getLabel = (id) => {
  switch (id) {
    case symbolOptions.evaluationRating: return i18n.EVALUATION_RATING
    case COORDINATES: return i18n.COORDINATES
    default: return amplifiersData[id].getText()
  }
}

const renderCheckItem = (label, value, onChange, disabled, key) =>
  <FormRow label={label} key={key} alignLabel="right">
    <Checkbox
      onChange={onChange}
      value={value}
      disabled={disabled}
    />
  </FormRow>

export const AmplifiersChecker = ({ value = {}, onChange, disabled }) => {
  const isAllChecked = Object.values(value).every(Boolean)

  const onChangeAll = ({ target: { value: currentV } }) => {
    const changedValues = Object.fromEntries(
      Object.keys(value).map((item) => [ item, currentV ]),
    )
    onChange(changedValues)
  }

  const renderCheckGroup = (ids, index) => {
    const label = ids.map(getLabel).join(', ')
    const currentValue = ids.every((id) => value[id])

    const onChangeHandler = ({ target: { value: currentV } }) => {
      const changed = Object.fromEntries(ids.map((id) => [ id, currentV ]))
      onChange({ ...value, ...changed })
    }

    return renderCheckItem(label, currentValue, onChangeHandler, disabled, index)
  }

  return <div className={'amplifiers-container'}>
    {renderCheckItem(i18n.ALL, isAllChecked, onChangeAll, disabled)}
    {AMPLIFIERS_GROUPS.map(renderCheckGroup)}
  </div>
}

AmplifiersChecker.displayName = 'AmplifiersChecker'
AmplifiersChecker.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
}
