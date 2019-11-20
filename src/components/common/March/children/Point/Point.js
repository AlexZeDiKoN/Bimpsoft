import React from 'react'
import PropTypes from 'prop-types'
import { AutoComplete, Icon, Input } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../../../i18n'
import { MarchKeys } from '../../../../../constants'

const { MARCH_SEGMENT_KEYS } = MarchKeys

const { FormRow } = components.form

let FORM_DECORATOR_ID = 0

// TODO: test data
const geographicalLandmark = [ 'landmark one', 'landmark two', 'landmark three' ]

const Point = ({ point, index, onChange, deletePoint, createChildren, form: { getFieldDecorator } }) => {
  const handleDelete = () => deletePoint(index)
  const handleChangeInput = ({ target }) => onChange(target.value,
    MARCH_SEGMENT_KEYS.COORDINATE)
  const handleChangeSelect = (e) => onChange(e, MARCH_SEGMENT_KEYS.LANDMARK)

  return (
    <div className='march_segment-point'>
      {!point.required &&
      <div className='march_segment-delete march_segment-point-delete'>
        <button
          onClick={handleDelete}
          type="button"
        >
          <Icon type="delete" theme="filled"/>
        </button>
      </div>}
      <FormRow>
        {getFieldDecorator(`Point${FORM_DECORATOR_ID++}`,
          {
            rules: [ { required: true } ],
            initialValue: point[ MARCH_SEGMENT_KEYS.COORDINATE ],
          },
        )(<Input
          addonAfter={<div
            className='segment_point'
            onClick={() => {
            }}
          >
            <Icon type="environment" theme="filled"/>
          </div>}
          placeholder={i18n.COORDINATES}
          onChange={handleChangeInput}
        />)}
      </FormRow>
      <FormRow>
        {getFieldDecorator(`Point${FORM_DECORATOR_ID++}`,
          {
            rules: [ { required: true } ],
            initialValue: point[ MARCH_SEGMENT_KEYS.LANDMARK ],
          },
        )(<AutoComplete
          placeholder={i18n.GEOGRAPHICAL_LANDMARK}
          onChange={handleChangeSelect}
        >
          {createChildren(geographicalLandmark)}
        </AutoComplete>)}
      </FormRow>
    </div>
  )
}

Point.propTypes = {
  point: PropTypes.object,
  index: PropTypes.number,
  onChange: PropTypes.func,
  deletePoint: PropTypes.func,
  createChildren: PropTypes.func,
  form: PropTypes.object,
}

export default Point
