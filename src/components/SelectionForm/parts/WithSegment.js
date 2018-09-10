import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'
import SelectionTypes from '../../../constants/SelectionTypes'
import { iconOption, iconDiv } from './render'
import AbstractShapeForm from './AbstractShapeForm'

const { FormRow } = components.form
const { icons: { names: iconNames } } = components

const SEGMENT_ARC = 'arc'
const SEGMENT_DIRECT = 'direct'

const segments = {
  [SEGMENT_ARC]: { text: i18n.SEGMENT_ARC, icon: iconNames.CURVE_ACTIVE },
  [SEGMENT_DIRECT]: { text: i18n.SEGMENT_DIRECT, icon: iconNames.BROKEN_LINE_ACTIVE },
}

const typeToSegment = new Map([
  [ SelectionTypes.AREA, SEGMENT_ARC ],
  [ SelectionTypes.CURVE, SEGMENT_ARC ],
  [ SelectionTypes.POLYGON, SEGMENT_DIRECT ],
  [ SelectionTypes.POLYLINE, SEGMENT_DIRECT ],
])

const getTypeBySegment = (type, segment) => {
  switch (segment) {
    case SEGMENT_DIRECT:
      switch (type) {
        case SelectionTypes.AREA:
          return SelectionTypes.POLYGON
        case SelectionTypes.CURVE:
          return SelectionTypes.POLYLINE
        default:
          return type
      }
    case SEGMENT_ARC:
      switch (type) {
        case SelectionTypes.POLYGON:
          return SelectionTypes.AREA
        case SelectionTypes.POLYLINE:
          return SelectionTypes.CURVE
        default:
          return type
      }
    default:
      return type
  }
}

const WithSegment = (Component) => class SegmentComponent extends Component {
  static propTypes = {
    ...AbstractShapeForm.propTypes,
    segment: PropTypes.string,
  }

  constructor (props) {
    super(props)
    const { type } = props
    this.state.segment = typeToSegment.has(type) ? typeToSegment.get(type) : SEGMENT_DIRECT
  }

  segmentChangeHandler = (segment) => this.setState((state) => {
    const type = getTypeBySegment(state.type, segment)
    return { segment, type }
  })

  fillResult (result) {
    super.fillResult(result)
    result.segment = this.state.segment
  }

  renderSegment () {
    const { segment } = this.state
    const segmentInfo = segments[segment]
    const canEdit = this.isCanEdit()

    const value = canEdit ? (
      <Select value={ this.state.segment } onChange={this.segmentChangeHandler} >
        {iconOption(SEGMENT_DIRECT, iconNames.BROKEN_LINE_ACTIVE, i18n.SEGMENT_DIRECT)}
        {iconOption(SEGMENT_ARC, iconNames.CURVE_ACTIVE, i18n.SEGMENT_ARC)}
      </Select>
    ) : iconDiv(segmentInfo.icon, segmentInfo.text)

    return (
      <FormRow label={i18n.LINE_SEGMENT}>
        {value}
      </FormRow>
    )
  }
}

export default WithSegment
