export const MARCH_KEYS = {
  MARCH_NAME: 'marchName',
  MARCH_TYPE: 'marchType',
}

export const MARCH_SEGMENT_KEYS = {
  COORDINATE_START: 'coordinateStart',
  LANDMARK_START: 'landmarkStart',
  SEGMENT: 'segment',
  SEGMENT_NAME: 'segmentName',
  SEGMENT_TYPE: 'segmentType',
  TERRAIN_TYPE: 'terrainType',
  COORDINATE_FINISH: 'coordinateFinish',
  LANDMARK_FINISH: 'landmarkFinish',
}

export const MARCH_INDICATORS_GROUP = [ 'МШВ001', 'МШВ002', 'МШВ006', 'МШВ007' ]

export const MARCH_TYPES_TEMPLATES = {
  // Своїм ходом
  41: [
    {
      startPoint: true,
      complementarySegment: {
        default: {
          proposedSegmentTypes: [ 46 ],
          adding: true,
          delete: true,
        },
      },
    },
    {
      default: {
        proposedSegmentTypes: [ 45 ],
        adding: true,
        delete: false,
      },
    },
    {
      default: {
        proposedSegmentTypes: [ 47 ],
        adding: true,
        delete: false,
      },
    },
  ],
  // Залізницею
  42: [
    {
      startPoint: true,
      complementarySegment: false,
    },
    {
      default: {
        proposedSegmentTypes: [ 45, 48 ],
        adding: false,
        delete: false,
      },
    },
    {
      default: {
        proposedSegmentTypes: [ 50 ],
        adding: false,
        delete: false,
      },
    },
    {
      default: {
        proposedSegmentTypes: [ 47, 49 ],
        adding: false,
        delete: false,
      },
    },
  ],
  // Морем
  43: [
    {
      startPoint: true,
      complementarySegment: false,
    },
    {
      default: {
        proposedSegmentTypes: [ 45, 48 ],
        adding: false,
        delete: false,
      },
    },
    {
      default: {
        proposedSegmentTypes: [ 51 ],
        adding: false,
        delete: false,
      },
    },
    {
      default: {
        proposedSegmentTypes: [ 47, 49 ],
        adding: false,
        delete: false,
      },
    },
  ],
  // Комбінований
  44: [
    {
      startPoint: true,
      complementarySegment: {
        default: {
          proposedSegmentTypes: [ 46, 50, 51 ],
          adding: true,
          delete: true,
        },
      },
    },
    {
      default: {
        proposedSegmentTypes: [ 45, 48 ],
        adding: true,
        delete: false,
      },
    },
    {
      default: {
        proposedSegmentTypes: [ 47, 49 ],
        adding: true,
        delete: false,
      },
    },
  ],
}
