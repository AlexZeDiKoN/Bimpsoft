import { MARCH_TYPES } from '../../../../constants/March'
import { uuid } from '../../../../components/WebMap/patch/Sophisticated/utils'
const { OWN_RESOURCES, BY_RAILROAD, BY_SHIPS } = MARCH_TYPES

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

const defaultSegment = (segmentType) => {
  const specificFields = {}

  switch (segmentType) {
    case OWN_RESOURCES:
      specificFields.segmentType = OWN_RESOURCES
      specificFields.children = [ defaultChild() ]
      break
    case BY_RAILROAD:
      specificFields.segmentType = BY_RAILROAD
      break
    case BY_SHIPS:
      specificFields.segmentType = BY_SHIPS
      break
    default:
      specificFields.segmentType = OWN_RESOURCES
      specificFields.children = [ defaultChild() ]
  }

  return {
    id: uuid(),
    name: '',
    refPoint: '',
    terrain: 69,
    velocity: 30,
    coordinate: {},
    required: false,
    editableName: true,
    metric: getDefaultMetric(),
    children: [],
    ...specificFields,
  }
}

const getAllowedTypeSegments = (segments, segmentId) => {
  const allowedType = {
    [OWN_RESOURCES]: OWN_RESOURCES,
    [BY_RAILROAD]: BY_RAILROAD,
    [BY_SHIPS]: BY_SHIPS,
  }

  //const prevSegment = segments[segmentId]
  //const nextSegment = segments[segmentId + 1]

  //delete allowedType[prevSegment.segmentType]
  //delete allowedType[nextSegment.segmentType]

  return Object.values(allowedType)
}

export default {
  getDefaultMetric,
  defaultChild,
  defaultSegment,
  getAllowedTypeSegments,
}
