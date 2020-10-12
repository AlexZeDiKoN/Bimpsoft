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
  coordinates: {},
  refPoint: '',
  required: false,
  editableName: true,
  restTime: 0,
  metric: {
    time: 0,
    distance: 0,
  },
  route: null,
})

const defaultSegment = (type) => {
  const specificFields = {}

  switch (type) {
    case OWN_RESOURCES:
      specificFields.type = OWN_RESOURCES
      specificFields.children = [ { ...defaultChild(), type: 5 } ]
      break
    case BY_RAILROAD:
      specificFields.type = BY_RAILROAD
      break
    case BY_SHIPS:
      specificFields.type = BY_SHIPS
      break
    default:
      specificFields.type = OWN_RESOURCES
      specificFields.children = [ { ...defaultChild(), type: 5 } ]
  }

  return {
    id: uuid(),
    name: '',
    refPoint: '',
    terrain: 69,
    velocity: 30,
    coordinates: {},
    required: false,
    editableName: true,
    metric: getDefaultMetric(type !== OWN_RESOURCES),
    children: [],
    ...specificFields,
    route: null,
  }
}

const getAllowedTypeSegments = (segments, segmentId) => {
  const allowedType = {
    [OWN_RESOURCES]: OWN_RESOURCES,
    [BY_RAILROAD]: BY_RAILROAD,
    [BY_SHIPS]: BY_SHIPS,
  }

  // const prevSegment = segments[segmentId]
  // const nextSegment = segments[segmentId + 1]

  // delete allowedType[prevSegment.type]
  // delete allowedType[nextSegment.type]

  return Object.values(allowedType)
}

export default {
  getDefaultMetric,
  defaultChild,
  defaultSegment,
  getAllowedTypeSegments,
}
