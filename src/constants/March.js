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

const MARCH_TYPES = {
  OWN_RESOURCES: 41,
  BY_RAILROAD: 42,
  BY_SHIPS: 43,
  COMBINED: 44,
}

const SEGMENT_TYPES = {
  TO_STARTING_POINT: 45,
  INTERMEDIATE: 46,
  TO_DESTINATION_POINT: 47,
  TO_BOOT_STATION: 48,
  FROM_UNLOADING_STATION: 49,
  RAILROAD: 50,
  SEA: 51,
}

export const MARCH_TYPES_TEMPLATES = {
  // Своїм ходом
  [MARCH_TYPES.OWN_RESOURCES]: [
    {
      startPoint: true,
      complementarySegment: {
        default: {
          proposedSegmentTypes: [ SEGMENT_TYPES.INTERMEDIATE ],
          adding: true,
          delete: true,
        },
      },
    },
    {
      default: {
        proposedSegmentTypes: [ SEGMENT_TYPES.TO_STARTING_POINT ],
        adding: true,
        delete: false,
      },
    },
    {
      default: {
        proposedSegmentTypes: [ SEGMENT_TYPES.TO_DESTINATION_POINT ],
        adding: true,
        delete: false,
      },
    },
  ],
  // Залізницею
  [MARCH_TYPES.BY_RAILROAD]: [
    {
      startPoint: true,
      complementarySegment: false,
    },
    {
      default: {
        proposedSegmentTypes: [
          SEGMENT_TYPES.TO_STARTING_POINT,
          SEGMENT_TYPES.TO_BOOT_STATION,
        ],
        adding: false,
        delete: false,
      },
    },
    {
      default: {
        proposedSegmentTypes: [ SEGMENT_TYPES.RAILROAD ],
        adding: false,
        delete: false,
      },
    },
    {
      default: {
        proposedSegmentTypes: [
          SEGMENT_TYPES.TO_DESTINATION_POINT,
          SEGMENT_TYPES.FROM_UNLOADING_STATION,
        ],
        adding: false,
        delete: false,
      },
    },
  ],
  // Морем
  [MARCH_TYPES.BY_SHIPS]: [
    {
      startPoint: true,
      complementarySegment: false,
    },
    {
      default: {
        proposedSegmentTypes: [
          SEGMENT_TYPES.TO_STARTING_POINT,
          SEGMENT_TYPES.TO_BOOT_STATION,
        ],
        adding: false,
        delete: false,
      },
    },
    {
      default: {
        proposedSegmentTypes: [ SEGMENT_TYPES.SEA ],
        adding: false,
        delete: false,
      },
    },
    {
      default: {
        proposedSegmentTypes: [
          SEGMENT_TYPES.TO_DESTINATION_POINT,
          SEGMENT_TYPES.FROM_UNLOADING_STATION,
        ],
        adding: false,
        delete: false,
      },
    },
  ],
  // Комбінований
  [MARCH_TYPES.COMBINED]: [
    {
      startPoint: true,
      complementarySegment: {
        default: {
          proposedSegmentTypes: [
            SEGMENT_TYPES.INTERMEDIATE,
            SEGMENT_TYPES.RAILROAD,
            SEGMENT_TYPES.SEA,
          ],
          adding: true,
          delete: true,
        },
      },
    },
    {
      default: {
        proposedSegmentTypes: [
          SEGMENT_TYPES.TO_STARTING_POINT,
          SEGMENT_TYPES.TO_BOOT_STATION,
        ],
        adding: true,
        delete: false,
      },
    },
    {
      default: {
        proposedSegmentTypes: [
          SEGMENT_TYPES.TO_DESTINATION_POINT,
          SEGMENT_TYPES.FROM_UNLOADING_STATION,
        ],
        adding: true,
        delete: false,
      },
    },
  ],
}
