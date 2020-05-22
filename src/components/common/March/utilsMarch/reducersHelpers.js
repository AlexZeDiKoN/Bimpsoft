import { MARCH_TYPES } from '../../../../constants/March'
import { uuid } from '../../../../components/WebMap/patch/Sophisticated/utils'
const { OWN_RESOURCES } = MARCH_TYPES

const getDefaultMetric = (emptyChild = false) => {
  return {
    time: 0,
    distance: 0,
    children: emptyChild ? [] : [ { distance: 0, time: 0 } ],
    reference: { time: 0, distance: 0 },
    untilPrevious: { time: 0, distance: 0 },
  }
}

const defaultChild = () => ({
  id: uuid(),
  type: 0,
  lineType: '',
  coordinate: {},
  refPoint: '',
  required: false,
  editableName: true,
  restTime: 0,
  metric: {
    time: 0,
    distance: 0,
  },
})

const defaultSegment = () => ({
  id: uuid(),
  name: '',
  refPoint: '',
  segmentType: OWN_RESOURCES,
  terrain: 69,
  velocity: 30,
  coordinate: {},
  required: false,
  editableName: true,
  metric: getDefaultMetric(),
  children: [ defaultChild() ],
})

export default {
  getDefaultMetric,
  defaultChild,
  defaultSegment,
}
