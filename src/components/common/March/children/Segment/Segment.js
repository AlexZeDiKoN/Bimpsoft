import React, { Component, Fragment } from 'react'
import { Input, Icon, Select } from 'antd'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../../../i18n'
import { MarchKeys } from '../../../../../constants'

// TODO: test data
const geographicalLandmark = [ 'landmark one', 'landmark two', 'landmark three' ]
const segments = [ 'segment one', 'segment two', 'segment three' ]

export default class Segment extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    indicators: PropTypes.object.isRequired,
    setMarchParams: PropTypes.func,
    addSegment: PropTypes.func,
    index: PropTypes.number,
    template: PropTypes.object,
    segments: PropTypes.array,
  }

  indicatorItemObj = (target, indicator) => {
    const activeItem = indicator.typeValues.filter((item) => item.id === +target)
    return {
      indicatorId: indicator.id,
      id: activeItem[ 0 ].id,
      name: activeItem[ 0 ].name,
    }
  }

  setIndicatorParam = (data, key, indicator) => {
    const { segments, index, setMarchParams } = this.props
    segments[ index ][ key ] = this.indicatorItemObj(data, indicator)
    setMarchParams({ segments: segments })
  }

  setSegmentParams = (incomeData, key) => {
    const { segments, index, setMarchParams } = this.props
    segments[ index ][ key ] = incomeData
    setMarchParams({ segments: segments })
  }

  createSelectChildren = (incomeData) => incomeData
    .map((item) => <Select.Option key={item.id ? item.id : item}>{item.name ? item.name : item}</Select.Option>)

  render () {
    console.log(this.props)
    const {
      form: { getFieldDecorator },
      indicators,
      index,
      template,
      addSegment,
    } = this.props
    const { MARCH_SEGMENT_KEYS } = MarchKeys
    const { FormRow } = components.form

    const point = <div
      className='segment_point'
      onClick={() => console.log('set coordinate')}
    >
      <Icon type="environment" theme="filled"/>
    </div>

    return (
      <div className='march_segment'>
        {template.startPoint
          ? <div className='march_segment-point'>
            <FormRow>
              {
                getFieldDecorator(
                  `${MARCH_SEGMENT_KEYS.COORDINATE_START}${template.id}`,
                )(
                  <Input
                    addonAfter={point}
                    placeholder={i18n.COORDINATES}
                    onChange={({ target }) => this.setSegmentParams(target.value, MARCH_SEGMENT_KEYS.COORDINATE_START)}
                  />,
                )
              }
            </FormRow>
            <FormRow>
              {
                getFieldDecorator(
                  `${MARCH_SEGMENT_KEYS.LANDMARK_START}${template.id}`,
                )(
                  <Select
                    placeholder={i18n.GEOGRAPHICAL_LANDMARK}
                    onChange={(e) => this.setSegmentParams(e, MARCH_SEGMENT_KEYS.LANDMARK_START)}
                  >
                    {this.createSelectChildren(geographicalLandmark)}
                  </Select>,
                )
              }
            </FormRow>
          </div>
          : <Fragment>
            <div className='march_segment-options'>
              <div className='march_segment-adding'>
                {template.default.adding && <button
                  onClick={() => addSegment(index)}
                >
                  {i18n.ADD_SEGMENT}
                </button>}
              </div>
              <div className='march_segment-params'>
                <FormRow>
                  {
                    getFieldDecorator(
                      `${MARCH_SEGMENT_KEYS.SEGMENT}${template.id}`,
                    )(
                      <Select
                        placeholder={i18n.CHECK_SEGMENT}
                        onChange={(e) => this.setSegmentParams(e, MARCH_SEGMENT_KEYS.SEGMENT)}
                      >
                        {this.createSelectChildren(segments)}
                      </Select>,
                    )
                  }
                </FormRow>
                <FormRow>
                  {
                    getFieldDecorator(
                      `${MARCH_SEGMENT_KEYS.SEGMENT_NAME}${template.id}`,
                    )(
                      <Input
                        placeholder={i18n.SEGMENT_NAME}
                        onChange={({ target }) => this.setSegmentParams(target.value, MARCH_SEGMENT_KEYS.SEGMENT_NAME)}
                      />,
                    )
                  }
                </FormRow>
                <FormRow>
                  <Select
                    value={template[ MARCH_SEGMENT_KEYS.SEGMENT_TYPE ]
                      ? template[ MARCH_SEGMENT_KEYS.SEGMENT_TYPE ].name
                      : undefined}
                    placeholder={indicators[ 'МШВ002' ].typeName}
                    onChange={(e) =>
                      this.setIndicatorParam(e, MARCH_SEGMENT_KEYS.SEGMENT_TYPE, indicators[ 'МШВ002' ])}
                  >
                    {this.createSelectChildren(indicators[ 'МШВ002' ].typeValues
                      .filter((elem) => template.default.proposedSegmentTypes
                        .some((segment) => segment === elem.id)),
                    )}
                  </Select>
                </FormRow>
                <FormRow>
                  <Select
                    value={template[MARCH_SEGMENT_KEYS.TERRAIN_TYPE]
                      ? template[MARCH_SEGMENT_KEYS.TERRAIN_TYPE].name
                      : undefined}
                    placeholder={indicators[ 'МШВ007' ].typeName}
                    onChange={(e) =>
                      this.setIndicatorParam(e, MARCH_SEGMENT_KEYS.TERRAIN_TYPE, indicators[ 'МШВ007' ])}
                  >
                    {this.createSelectChildren(indicators[ 'МШВ007' ].typeValues)}
                  </Select>
                </FormRow>
              </div>
            </div>
            <div className='march_segment-point'>
              <FormRow>
                {
                  getFieldDecorator(
                    `${MARCH_SEGMENT_KEYS.COORDINATE_FINISH}${template.id}`,
                  )(
                    <Input
                      addonAfter={point}
                      placeholder={i18n.COORDINATES}
                      onChange={({ target }) =>
                        this.setSegmentParams(target.value, MARCH_SEGMENT_KEYS.COORDINATE_FINISH)}
                    />,
                  )
                }
              </FormRow>
              <FormRow>
                {
                  getFieldDecorator(
                    `${MARCH_SEGMENT_KEYS.LANDMARK_FINISH}${template.id}`,
                  )(
                    <Select
                      placeholder={i18n.GEOGRAPHICAL_LANDMARK}
                      onChange={(e) => this.setSegmentParams(e, MARCH_SEGMENT_KEYS.LANDMARK_FINISH)}
                    >
                      {this.createSelectChildren(geographicalLandmark)}
                    </Select>,
                  )
                }
              </FormRow>
            </div>
          </Fragment>}
      </div>
    )
  }
}
