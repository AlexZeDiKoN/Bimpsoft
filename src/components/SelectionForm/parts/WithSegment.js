import React from 'react'
import { Select } from 'antd'
import { components } from '@C4/CommonComponents'
import i18n from '../../../i18n'
import SelectionTypes from '../../../constants/SelectionTypes'
import { iconOption, iconDiv } from './render'

const { FormRow } = components.form
const { names: iconNames } = components.icons

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

const TYPE_PATH = [ 'type' ]

const WithSegment = (Component) => class SegmentComponent extends Component {
  segmentChangeHandler = (segment) => this.setResult((result) =>
    result.updateIn(TYPE_PATH, (type) => getTypeBySegment(type, segment)))

  renderSegment () {
    const type = this.getResult().getIn(TYPE_PATH) ?? SelectionTypes.AREA
    const segment = typeToSegment.get(type) ?? SEGMENT_ARC
    const segmentInfo = segments[segment]
    const canEdit = this.isCanEdit()

    const value = canEdit ? (
      <Select value={ segment } onChange={this.segmentChangeHandler} >
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
