import React, { Component } from 'react'
import { update, merge } from 'ramda'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import { MarchKeys } from '../../../../../constants'
import Point from '../Point'
import Line from '../Line'

export default class Segment extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    setMarchParams: PropTypes.func,
    index: PropTypes.number,
    segments: PropTypes.array,
  }

  indicatorItemObj = (target, indicator) => {
    const activeItem = indicator.typeValues.filter((item) => item.id === Number(target))
    return {
      indicatorId: indicator.id,
      id: activeItem[ 0 ].id,
      name: activeItem[ 0 ].name,
    }
  }

  setIndicatorParam = (data, key, indicator) => {
    const itemIndicator = this.indicatorItemObj(data, indicator)
    this.setSegmentParams(itemIndicator, key)
  }

  setSegmentParams = (data, key) => {
    const { segments, index, setMarchParams } = this.props
    const segmentsWithUpdatedParams = update(index,
      merge(segments[ index ], { [ key ]: data }), segments)
    setMarchParams({ segments: segmentsWithUpdatedParams })
  }

  createSelectChildren = (incomeData) => incomeData
    .map((item) => <Select.Option
      key={item.id ? item.id : item}>{item.name ? item.name : item}</Select.Option>)

  renderSegments = () => {
    const { index, segments, form } = this.props
    const { FIELDS_TYPE } = MarchKeys
    const item = segments[ index ]

    return item.type === FIELDS_TYPE.POINT
      ? <Point
        point={item}
        index={index}
        onChange={this.setSegmentParams}
        createChildren={this.createSelectChildren}
        form={form}
      />
      : <Line
        line={item}
        index={index}
        form={form}
        onChange={this.setSegmentParams}
        createChildren={this.createSelectChildren}
        setIndicator={this.setIndicatorParam}/>
  }

  render () {
    return <div className='march_segment'>{this.renderSegments()}</div>
  }
}
