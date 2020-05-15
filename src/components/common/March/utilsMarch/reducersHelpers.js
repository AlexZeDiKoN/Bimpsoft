// eslint-disable-next-line
export const uuid = () => ([ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))

const getDefaultMetric = (emptyChild = false) => {
  return {
    time: 0,
    distance: 0,
    children: emptyChild ? [] : [ { distance: 0, time: 0 } ],
    reference: { time: 0, distance: 0 },
    untilPrevios: { time: 0, distance: 0 },
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
  segmentType: 41,
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
  uuid,
}
