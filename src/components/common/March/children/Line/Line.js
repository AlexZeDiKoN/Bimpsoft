import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Select, Icon } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../../../i18n'
import { MarchKeys } from '../../../../../constants'

const { FormRow } = components.form
const { MARCH_SEGMENT_KEYS, MARCH_TEMPLATES } = MarchKeys

// TODO: test data
const segmentsExmp = [ 'Створити вручну', 'segment one', 'segment two', 'segment three' ]

class Line extends Component {
    handleAddPoint = () => {
      const { marchType: { id }, addPoint, index } = this.props
      addPoint(index, MARCH_TEMPLATES[id].optional)
    }

    handleDeleteSegment = () => {
      const { index, deleteSegment } = this.props
      deleteSegment(index)
    }

    handleChangeIndicator = (key, indicator) =>
      (e) => this.props.setIndicator(e, key, indicator)

    render () {
      const {
        marchType: { id },
        index,
        line,
        createChildren,
        onChange,
        indicators,
      } = this.props
      const isVisibleAddBtn = MARCH_TEMPLATES[id] && MARCH_TEMPLATES[id].hasOptional
      return (
        <div className='march_segment-options'>
          {isVisibleAddBtn && index > 1 && <div className='march_segment-adding'>
            <button
              onClick={this.handleAddPoint}
            >
              {i18n.ADD_SEGMENT}
            </button>
          </div>}
          <div className='march_segment-params'>
            <div className="march_segment-header">
              <span className="march_distance">0 км</span>
              <div className='march_segment-delete'>
                <button
                  onClick={this.handleDeleteSegment}
                >
                  <Icon type="delete" theme="filled"/>
                </button>
              </div>
            </div>
            <FormRow>
              <Select
                value={line[MARCH_SEGMENT_KEYS.SEGMENT]}
                placeholder={i18n.CHECK_SEGMENT}
                onChange={(e) => onChange(e, MARCH_SEGMENT_KEYS.SEGMENT)}
              >
                {createChildren(segmentsExmp)}
              </Select>
            </FormRow>
            <FormRow>
              <Input
                value={line[MARCH_SEGMENT_KEYS.SEGMENT_NAME]}
                placeholder={i18n.SEGMENT_NAME}
                onChange={({ target }) =>
                  onChange(target.value, MARCH_SEGMENT_KEYS.SEGMENT_NAME)}
              />
            </FormRow>
            <FormRow>
              <Select
                value={line[MARCH_SEGMENT_KEYS.SEGMENT_TYPE]
                  ? line[MARCH_SEGMENT_KEYS.SEGMENT_TYPE].name
                  : undefined}
                placeholder={indicators['МШВ002'].typeName}
                onChange={this.handleChangeIndicator(MARCH_SEGMENT_KEYS.SEGMENT_TYPE, indicators['МШВ002'])}
              >
                {createChildren(indicators['МШВ002'].typeValues
                  .filter((elem) => line.possibleTypes
                    .some((segment) => segment === elem.id)),
                )}
              </Select>
            </FormRow>
            <FormRow>
              <Select
                value={line[MARCH_SEGMENT_KEYS.TERRAIN_TYPE]
                  ? line[MARCH_SEGMENT_KEYS.TERRAIN_TYPE].name
                  : undefined}
                placeholder={indicators['МШВ007'].typeName}
                onChange={this.handleChangeIndicator(MARCH_SEGMENT_KEYS.TERRAIN_TYPE, indicators['МШВ007'])}
              >
                {createChildren(indicators['МШВ007'].typeValues)}
              </Select>
            </FormRow>
          </div>
        </div>
      )
    }
}

Line.propTypes = {
  line: PropTypes.object,
  index: PropTypes.number,
  marchType: PropTypes.object,
  indicators: PropTypes.object,
  onChange: PropTypes.func,
  createChildren: PropTypes.func,
  setIndicator: PropTypes.func,
  addPoint: PropTypes.func,
  deleteSegment: PropTypes.func,
}

export default Line
