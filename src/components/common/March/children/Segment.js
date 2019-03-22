import React, { Component } from 'react'
import { Input, Icon, Select } from 'antd'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../../i18n'
import { MarchKeys } from '../../../../constants'

// TODO: test data
const geographicalLandmark = [ 'landmark one', 'landmark two', 'landmark three' ]
const segments = [ 'segment one', 'segment two', 'segment three' ]

export default class Segment extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    indicators: PropTypes.object.isRequired,
    setMarchParams: PropTypes.func,
    index: PropTypes.number,
    item: PropTypes.object,
    segments: PropTypes.array,
  }

  setSegmentParams = (incomeData, key) => {
    const { segments, index, setMarchParams } = this.props
    segments[index][key] = incomeData
    setMarchParams({ segments: segments })
  }

  createSelectChildren = (incomeData) => incomeData
    .map((item) => <Select.Option key={item.name ? item.name : item}>{item.name ? item.name : item}</Select.Option>)

  render () {
    const {
      form: { getFieldDecorator },
      indicators,
      setMarchParams,
      item,
      index,
    } = this.props
    const { MARCH_SEGMENT_KEYS } = MarchKeys
    const { FormRow } = components.form

    const point = <div
      className='segment_point'
      onClick={() => console.log('set coordinate')}
    >
      <Icon type="environment" theme="filled" />
    </div>

    return (
      <div className='march_segment'>
        {index === 0 && <div className='march_segment-point'>
          <FormRow>
            {
              getFieldDecorator(
                `${MARCH_SEGMENT_KEYS.COORDINATE_START}${index}`
              )(
                <Input
                  addonAfter={point}
                  placeholder={i18n.COORDINATES}
                  onChange={({ target }) => this.setSegmentParams(target.value, MARCH_SEGMENT_KEYS.COORDINATE_START) }
                />
              )
            }
          </FormRow>
          <FormRow>
            {
              getFieldDecorator(
                `${MARCH_SEGMENT_KEYS.LANDMARK_START}${index}`
              )(
                <Select
                  placeholder={i18n.GEOGRAPHICAL_LANDMARK}
                  onChange={(e) => this.setSegmentParams(e, MARCH_SEGMENT_KEYS.LANDMARK_START)}
                >
                  {this.createSelectChildren(geographicalLandmark)}
                </Select>
              )
            }
          </FormRow>
        </div>}
        <div className='march_segment-options'>
          <FormRow>
            {
              getFieldDecorator(
                `${MARCH_SEGMENT_KEYS.SEGMENT}${index}`
              )(
                <Select
                  placeholder={i18n.CHECK_SEGMENT}
                  onChange={(e) => this.setSegmentParams(e, MARCH_SEGMENT_KEYS.SEGMENT)}
                >
                  {this.createSelectChildren(segments)}
                </Select>
              )
            }
          </FormRow>
          <FormRow>
            {
              getFieldDecorator(
                `${MARCH_SEGMENT_KEYS.SEGMENT_NAME}${index}`
              )(
                <Input
                  placeholder={i18n.SEGMENT_NAME}
                  onChange={({ target }) => this.setSegmentParams(target.value, MARCH_SEGMENT_KEYS.SEGMENT_NAME)}
                />
              )
            }
          </FormRow>
          <FormRow>
            {
              getFieldDecorator(
                `${MARCH_SEGMENT_KEYS.SEGMENT_TYPE}${index}`
              )(
                <Select
                  placeholder={i18n.MARCH_TYPE}
                  onChange={(e) => this.setSegmentParams(e, MARCH_SEGMENT_KEYS.SEGMENT_TYPE)}
                >
                  {this.createSelectChildren(indicators['МШВ002'].typeValues)}
                </Select>
              )
            }
          </FormRow>
          <FormRow>
            {
              getFieldDecorator(
                `${MARCH_SEGMENT_KEYS.TERRAIN_TYPE}${index}`
              )(
                <Select
                  placeholder={i18n.TERRAIN_TYPE}
                  onChange={(e) => this.setSegmentParams(e, MARCH_SEGMENT_KEYS.TERRAIN_TYPE)}
                >
                  {this.createSelectChildren(indicators['МШВ007'].typeValues)}
                </Select>
              )
            }
          </FormRow>
        </div>
        <div className='march_segment-point'>
          <FormRow>
            {
              getFieldDecorator(
                `${MARCH_SEGMENT_KEYS.COORDINATE_FINISH}${index}`
              )(
                <Input
                  addonAfter={point}
                  placeholder={i18n.COORDINATES}
                  onChange={({ target }) => this.setSegmentParams(target.value, MARCH_SEGMENT_KEYS.COORDINATE_FINISH)}
                />
              )
            }
          </FormRow>
          <FormRow>
            {
              getFieldDecorator(
                `${MARCH_SEGMENT_KEYS.LANDMARK_FINISH}${index}`
              )(
                <Select
                  placeholder={i18n.GEOGRAPHICAL_LANDMARK}
                  onChange={(e) => this.setSegmentParams(e, MARCH_SEGMENT_KEYS.LANDMARK_FINISH)}
                >
                  {this.createSelectChildren(geographicalLandmark)}
                </Select>
              )
            }
          </FormRow>
        </div>
      </div>
    )
  }
}
