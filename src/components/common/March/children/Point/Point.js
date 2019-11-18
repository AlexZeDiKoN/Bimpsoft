import React from 'react'
import PropTypes from 'prop-types'
import { AutoComplete, Icon, Input } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../../../i18n'
import { MarchKeys } from '../../../../../constants'

const { MARCH_SEGMENT_KEYS } = MarchKeys

const { FormRow } = components.form

// TODO: test data
const geographicalLandmark = [ 'landmark one', 'landmark two', 'landmark three' ]

const Point = ({ point, index, onChange, deletePoint, createChildren }) => {
  const handleDelete = () => deletePoint(index)
  const handleChangeInput = ({ target }) => onChange(target.value, MARCH_SEGMENT_KEYS.COORDINATE)
  const handleChangeSelect = (e) => onChange(e, MARCH_SEGMENT_KEYS.LANDMARK)

  return (
    <div className='march_segment-point'>
      {!point.required && <div className='march_segment-delete march_segment-point-delete'>
        <button
          onClick={handleDelete}
        >
          <Icon type="delete" theme="filled"/>
        </button>
      </div>}
      <FormRow>
        <Input
          value={point[MARCH_SEGMENT_KEYS.COORDINATE]}
          addonAfter={<div
            className='segment_point'
            onClick={() => {
            }}
          >
            <Icon type="environment" theme="filled"/>
          </div>}
          placeholder={i18n.COORDINATES}
          onChange={handleChangeInput}
        />
      </FormRow>
      <FormRow>
        <AutoComplete
          value={point[MARCH_SEGMENT_KEYS.LANDMARK]}
          placeholder={i18n.GEOGRAPHICAL_LANDMARK}
          onChange={handleChangeSelect}
        >
          {createChildren(geographicalLandmark)}
        </AutoComplete>
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
}

export default Point
