import React, { Component, Fragment } from 'react'
import { Input, Icon, Select } from 'antd'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../../../i18n'
import { MarchKeys } from '../../../../../constants'

// TODO: test data
const geographicalLandmark = [ 'landmark one', 'landmark two', 'landmark three' ]
const segmentsExmp = [ 'segment one', 'segment two', 'segment three' ]

export default class Segment extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    indicators: PropTypes.object.isRequired,
    setMarchParams: PropTypes.func,
    addSegment: PropTypes.func,
    deleteSegment: PropTypes.func,
    index: PropTypes.number,
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
    const {
      indicators,
      index,
      addSegment,
      deleteSegment,
      segments,
    } = this.props
    const { MARCH_SEGMENT_KEYS } = MarchKeys
    const { FormRow } = components.form
    const item = segments[ index ]

    const point = <div
      className='segment_point'
      onClick={() => console.info('set coordinate')}
    >
      <Icon type="environment" theme="filled"/>
    </div>

    return (
      <div className='march_segment'>
        {item.startPoint
          ? <div className='march_segment-point'>
            <FormRow>
              <Input
                value={item[ MARCH_SEGMENT_KEYS.COORDINATE_START ]}
                addonAfter={point}
                placeholder={i18n.COORDINATES}
                onChange={({ target }) => this.setSegmentParams(target.value, MARCH_SEGMENT_KEYS.COORDINATE_START)}
              />
            </FormRow>
            <FormRow>
              <Select
                value={item[ MARCH_SEGMENT_KEYS.LANDMARK_START ]}
                placeholder={i18n.GEOGRAPHICAL_LANDMARK}
                onChange={(e) => this.setSegmentParams(e, MARCH_SEGMENT_KEYS.LANDMARK_START)}
              >
                {this.createSelectChildren(geographicalLandmark)}
              </Select>
            </FormRow>
          </div>
          : <Fragment>
            {item.default.delete && <div className='march_segment-delete'>
              <button
                onClick={() => deleteSegment(index)}
              >
                <Icon type="delete" theme="filled" />
              </button>
            </div>}
            <div className='march_segment-options'>
              {item.default.adding && <div className='march_segment-adding'>
                <button
                  onClick={() => addSegment(index)}
                >
                  {i18n.ADD_SEGMENT}
                </button>
              </div>}
              <div className='march_segment-params'>
                <FormRow>
                  <Select
                    value={item[ MARCH_SEGMENT_KEYS.SEGMENT ]}
                    placeholder={i18n.CHECK_SEGMENT}
                    onChange={(e) => this.setSegmentParams(e, MARCH_SEGMENT_KEYS.SEGMENT)}
                  >
                    {this.createSelectChildren(segmentsExmp)}
                  </Select>
                </FormRow>
                <FormRow>
                  <Input
                    value={item[ MARCH_SEGMENT_KEYS.SEGMENT_NAME ]}
                    placeholder={i18n.SEGMENT_NAME}
                    onChange={({ target }) => this.setSegmentParams(target.value, MARCH_SEGMENT_KEYS.SEGMENT_NAME)}
                  />
                </FormRow>
                <FormRow>
                  <Select
                    value={item[ MARCH_SEGMENT_KEYS.SEGMENT_TYPE ]
                      ? item[ MARCH_SEGMENT_KEYS.SEGMENT_TYPE ].name
                      : undefined}
                    placeholder={indicators[ 'МШВ002' ].typeName}
                    onChange={(e) =>
                      this.setIndicatorParam(e, MARCH_SEGMENT_KEYS.SEGMENT_TYPE, indicators[ 'МШВ002' ])}
                  >
                    {this.createSelectChildren(indicators[ 'МШВ002' ].typeValues
                      .filter((elem) => item.default.proposedSegmentTypes
                        .some((segment) => segment === elem.id)),
                    )}
                  </Select>
                </FormRow>
                <FormRow>
                  <Select
                    value={item[ MARCH_SEGMENT_KEYS.TERRAIN_TYPE ]
                      ? item[ MARCH_SEGMENT_KEYS.TERRAIN_TYPE ].name
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
                <Input
                  value={item[ MARCH_SEGMENT_KEYS.COORDINATE_FINISH ]}
                  addonAfter={point}
                  placeholder={i18n.COORDINATES}
                  onChange={({ target }) =>
                    this.setSegmentParams(target.value, MARCH_SEGMENT_KEYS.COORDINATE_FINISH)}
                />
              </FormRow>
              <FormRow>
                <Select
                  value={item[ MARCH_SEGMENT_KEYS.LANDMARK_FINISH ]}
                  placeholder={i18n.GEOGRAPHICAL_LANDMARK}
                  onChange={(e) => this.setSegmentParams(e, MARCH_SEGMENT_KEYS.LANDMARK_FINISH)}
                >
                  {this.createSelectChildren(geographicalLandmark)}
                </Select>
              </FormRow>
            </div>
          </Fragment>}
      </div>
    )
  }
}
