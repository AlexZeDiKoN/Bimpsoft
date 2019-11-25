import React from 'react'
import PropTypes from 'prop-types'
import { AutoComplete, Icon as AntIcon, Input } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../../../i18n'
import { MarchKeys } from '../../../../../constants'

const { MARCH_SEGMENT_KEYS } = MarchKeys

const { FormRow } = components.form
const { Icon, names } = components.icons

let FORM_DECORATOR_ID = 0

const Point = ({
  point,
  landmarks,
  index,
  segmentsLength,
  onChange,
  deletePoint,
  getLandmarks,
  createChildren,
  form: { getFieldDecorator },
}) => {
  const IS_LAST_SEGMENT = index === segmentsLength - 1
  const IS_FIRST_SEGMENT = index === 0

  const handleDelete = () => deletePoint(index)
  const handleChangeInput = ({ target }) => onChange(target.value,
    MARCH_SEGMENT_KEYS.COORDINATE)
  const handleChangeSelect = (e) => onChange(e, MARCH_SEGMENT_KEYS.LANDMARK)
  const fetchLandmarks = () => getLandmarks(point[MARCH_SEGMENT_KEYS.COORDINATE])

  const pathPoint = (
    IS_LAST_SEGMENT
      ? <Icon icon={names.MENU_MARKER_DEFAULT} className="march_path-indicator--end"/>
      : <div
        className={`march_path-indicator ${IS_FIRST_SEGMENT ? 'march_path-indicator--start' : ''}`}>
        <span/>
      </div>
  )

  return (
    <div className='march_segment-point'>
      {pathPoint}
      {!point.required &&
      <div className='march_segment-delete march_segment-point-delete'>
        <button
          onClick={handleDelete}
          type="button"
        >
          <AntIcon type="delete" theme="filled"/>
        </button>
      </div>}
      <FormRow>
        {getFieldDecorator(`Point${FORM_DECORATOR_ID++}`,
          {
            rules: [ { required: true } ],
            initialValue: point[MARCH_SEGMENT_KEYS.COORDINATE],
          },
        )(<Input
          addonAfter={<div
            className='segment_point'
            onClick={() => {
            }}
          >
            <AntIcon type="environment" theme="filled"/>
          </div>}
          placeholder={i18n.COORDINATES}
          onChange={handleChangeInput}
        />)}
      </FormRow>
      <FormRow>
        {getFieldDecorator(`Point${FORM_DECORATOR_ID++}`,
          {
            rules: [ { required: true } ],
            initialValue: point[MARCH_SEGMENT_KEYS.LANDMARK],
          },
        )(<AutoComplete
          placeholder={i18n.GEOGRAPHICAL_LANDMARK}
          onChange={handleChangeSelect}
          onFocus={fetchLandmarks}
        >
          {createChildren(landmarks)}
        </AutoComplete>)}
      </FormRow>
    </div>
  )
}

Point.propTypes = {
  point: PropTypes.object,
  landmarks: PropTypes.array,
  index: PropTypes.number,
  onChange: PropTypes.func,
  deletePoint: PropTypes.func,
  getLandmarks: PropTypes.func,
  createChildren: PropTypes.func,
  form: PropTypes.object,
  segmentsLength: PropTypes.number,
}

export default Point
