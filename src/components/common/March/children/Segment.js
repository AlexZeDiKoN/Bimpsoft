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
  }

  createSelectChildren = (incomeData) => incomeData
    .map((item) => <Select.Option key={item}>{item}</Select.Option>)

  render () {
    const {
      form: { getFieldDecorator },
      indicators,
      setMarchParams,
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
        <div className='march_segment-point'>
          <FormRow>
            {
              getFieldDecorator(
                MARCH_SEGMENT_KEYS.COORDINATE_START
              )(
                <Input
                  addonAfter={point}
                  placeholder={i18n.COORDINATES}
                  onChange={({ target }) => setMarchParams({ [MARCH_SEGMENT_KEYS.COORDINATE_START]: target.value })}
                />
              )
            }
          </FormRow>
          <FormRow>
            {
              getFieldDecorator(
                MARCH_SEGMENT_KEYS.LANDMARK_START
              )(
                <Select
                  placeholder={i18n.GEOGRAPHICAL_LANDMARK}
                  onChange={(e) => setMarchParams({ [MARCH_SEGMENT_KEYS.LANDMARK_START]: e })}
                >
                  {this.createSelectChildren(geographicalLandmark)}
                </Select>
              )
            }
          </FormRow>
        </div>
        <div className='march_segment-options'>
          <FormRow>
            {
              getFieldDecorator(
                MARCH_SEGMENT_KEYS.SEGMENT
              )(
                <Select
                  placeholder={i18n.CHECK_SEGMENT}
                  onChange={(e) => setMarchParams({ [MARCH_SEGMENT_KEYS.SEGMENT]: e })}
                >
                  {this.createSelectChildren(segments)}
                </Select>
              )
            }
          </FormRow>
          <FormRow>
            {
              getFieldDecorator(
                MARCH_SEGMENT_KEYS.SEGMENT_NAME
              )(
                <Input
                  placeholder={i18n.SEGMENT_NAME}
                  onChange={({ target }) => setMarchParams({ [MARCH_SEGMENT_KEYS.SEGMENT_NAME]: target.value })}
                />
              )
            }
          </FormRow>
          <FormRow>
            {
              getFieldDecorator(
                MARCH_SEGMENT_KEYS.SEGMENT_TYPE
              )(
                <Select
                  placeholder={i18n.MARCH_TYPE}
                  onChange={(e) => this.handleMarchType(e, MARCH_SEGMENT_KEYS.SEGMENT_TYPE, indicators['МШВ002'])}
                >
                  {this.createSelectChildren(indicators['МШВ002'].typeValues)}
                </Select>
              )
            }
          </FormRow>
          <FormRow>
            {
              getFieldDecorator(
                MARCH_SEGMENT_KEYS.TERRAIN_TYPE
              )(
                <Select
                  placeholder={i18n.TERRAIN_TYPE}
                  onChange={(e) => this.handleMarchType(e, MARCH_SEGMENT_KEYS.TERRAIN_TYPE, indicators['МШВ007'])}
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
                MARCH_SEGMENT_KEYS.COORDINATE_FINISH
              )(
                <Input
                  addonAfter={point}
                  placeholder={i18n.COORDINATES}
                  onChange={({ target }) => setMarchParams({ [MARCH_SEGMENT_KEYS.COORDINATE_FINISH]: target.value })}
                />
              )
            }
          </FormRow>
          <FormRow>
            {
              getFieldDecorator(
                MARCH_SEGMENT_KEYS.LANDMARK_FINISH
              )(
                <Select
                  placeholder={i18n.GEOGRAPHICAL_LANDMARK}
                  onChange={(e) => setMarchParams({ [MARCH_SEGMENT_KEYS.LANDMARK_FINISH]: e })}
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
