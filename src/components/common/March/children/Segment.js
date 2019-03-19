import React, { Component } from 'react'
import { Input, Icon, Select } from 'antd'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../../i18n'

// TODO: test data
const geographicalLandmark = [ 'landmark one', 'landmark two', 'landmark three' ]
const segments = [ 'segment one', 'segment two', 'segment three' ]

export default class Segment extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    indicators: PropTypes.object.isRequired,
  }

  createSelectChildren = (incomeData) => incomeData
    .map((item) => <Select.Option key={item}>{item}</Select.Option>)

  render () {
    const { form: { getFieldDecorator }, indicators } = this.props
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
            <Input
              addonAfter={point}
              onChange={({ target }) => console.log(target.value)}
            />
          </FormRow>
          <FormRow>
            <Select>
              {this.createSelectChildren(geographicalLandmark)}
            </Select>
          </FormRow>
        </div>
        <div className='march_segment-options'>
          <FormRow>
            <Select>
              {this.createSelectChildren(segments)}
            </Select>
          </FormRow>
          <FormRow>
            <Input
              onChange={({ target }) => console.log(target.value)}
            />
          </FormRow>
          <FormRow>
            {/*<IndicatorDataMapping*/}
              {/*indicator={ indicators['МШВ002'] }*/}
              {/*placeholder={i18n.MARCH_TYPE}*/}
            {/*/>*/}
          </FormRow>
          <FormRow>
            {/*<IndicatorDataMapping*/}
              {/*indicator={ indicators['МШВ007'] }*/}
              {/*placeholder={i18n.MARCH_TYPE}*/}
            {/*/>*/}
          </FormRow>
        </div>
        <div className='march_segment-point'>
          <FormRow>
            <Input
              addonAfter={point}
              onChange={({ target }) => console.log(target.value)}
            />
          </FormRow>
          <FormRow>
            <Select>
              {this.createSelectChildren(geographicalLandmark)}
            </Select>
          </FormRow>
        </div>
      </div>
    )
  }
}
