import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, Select, Icon } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../../../i18n'
import { MarchKeys } from '../../../../../constants'

const { FormRow } = components.form
const { MARCH_SEGMENT_KEYS, MARCH_TEMPLATES, MARCH_INDICATORS_GROUP } = MarchKeys

// TODO: test data
const segmentsExmp = [
  'Створити вручну', 'segment one', 'segment two', 'segment three',
]

let FORM_DECORATOR_ID = 0

class Line extends Component {
  handleAddPoint = () => {
    const { marchType: { id }, addPoint, index } = this.props
    addPoint(index, MARCH_TEMPLATES[ id ].optional)
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
      form: { getFieldDecorator },
    } = this.props
    const isVisibleAddBtn = MARCH_TEMPLATES[ id ] && MARCH_TEMPLATES[ id ].hasOptional
    const indicatorSegment = indicators[ MARCH_INDICATORS_GROUP.segmentType ]
    const indicatorTerrain = indicators[ MARCH_INDICATORS_GROUP.terrainType ]

    return (
      <div className='march_segment-options'>
        {isVisibleAddBtn && index > 1 && <div className='march_segment-adding'>
          <button
            onClick={this.handleAddPoint}
            type="button"
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
                type="button"
                onFocus={(e) => e.preventDefault()}
              >
                <Icon type="delete" theme="filled"/>
              </button>
            </div>
          </div>
          <FormRow>
            {getFieldDecorator(`Line${FORM_DECORATOR_ID++}`,
              {
                rules: [ { required: true } ],
                initialValue: line[ MARCH_SEGMENT_KEYS.SEGMENT ],
              },
            )(<Select
              placeholder={i18n.CHECK_SEGMENT}
              onChange={(e) => onChange(e, MARCH_SEGMENT_KEYS.SEGMENT)}
            >
              {createChildren(segmentsExmp)}
            </Select>)}
          </FormRow>
          <FormRow>
            {getFieldDecorator(`Line${FORM_DECORATOR_ID++}`,
              {
                rules: [ { required: true } ],
                initialValue: line[ MARCH_SEGMENT_KEYS.SEGMENT_NAME ],
              },
            )(<Input
              placeholder={i18n.SEGMENT_NAME}
              onChange={({ target }) => {
                onChange(target.value, MARCH_SEGMENT_KEYS.SEGMENT_NAME)
              }
              }
            />)}
          </FormRow>
          <FormRow>
            {getFieldDecorator(`Line${FORM_DECORATOR_ID++}`, {
              rules: [ { required: true } ],
              initialValue: line[ MARCH_SEGMENT_KEYS.SEGMENT_TYPE ] && line[ MARCH_SEGMENT_KEYS.SEGMENT_TYPE ].name,
            },
            )(<Select
              placeholder={indicatorSegment.typeName}
              onChange={this.handleChangeIndicator(
                MARCH_SEGMENT_KEYS.SEGMENT_TYPE, indicatorSegment)}
            >
              {createChildren(indicatorSegment.typeValues
                .filter((elem) => line.possibleTypes
                  .some((segment) => segment === elem.id)),
              )}
            </Select>)}
          </FormRow>
          <FormRow>
            {getFieldDecorator(`Line${FORM_DECORATOR_ID++}`, {
              rules: [ { required: true } ],
              initialValue: line[ MARCH_SEGMENT_KEYS.TERRAIN_TYPE ] && line[ MARCH_SEGMENT_KEYS.TERRAIN_TYPE ].name,
            })(<Select
              placeholder={indicatorTerrain.typeName}
              onChange={this.handleChangeIndicator(
                MARCH_SEGMENT_KEYS.TERRAIN_TYPE, indicatorTerrain)}
            >
              {createChildren(indicatorTerrain.typeValues)}
            </Select>)}
          </FormRow>
        </div>
      </div>
    )
  }
}

Line.propTypes = {
  line: PropTypes.object,
  form: PropTypes.object,
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
