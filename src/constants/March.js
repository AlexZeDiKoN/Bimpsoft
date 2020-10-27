export const MARCH_KEYS = {
  MARCH_NAME: 'marchName',
  MARCH_TYPE: 'marchType',
}

export const DEFAULT_SEGMENT_ID = 0

export const MARCH_SEGMENT_KEYS = {
  COORDINATES: 'coordinates',
  LANDMARK: 'landmark',
  SEGMENT: 'segment',
  SEGMENT_NAME: 'name',
  SEGMENT_TYPE: 'type',
  TERRAIN_TYPE: 'terrain',
}

export const MARCH_INDICATORS_GROUP = {
  movementType: 'МШВ001',
  segmentType: 'МШВ002',
  segmentLength: 'МШВ006',
  terrainType: 'МШВ007',
}

export const MARCH_TYPES = {
  OWN_RESOURCES: 41,
  BY_RAILROAD: 42,
  BY_SHIPS: 43,
  COMBINED: 44,
}

export const MARCH_POINT_TYPES = {
  POINT_ON_MARCH: 0,
  REST_POINT: 1,
  DAY_NIGHT_REST_POINT: 2,
  DAILY_REST_POINT: 3,
  LINE_OF_REGULATION: 4,
  INTERMEDIATE_POINT: 8,
}

export const MARCH_COLOR = {
  OWN_RESOURCES_LINE: '#7d8160',
  OWN_RESOURCES_BRUSH: '#DFE3B4',
  BY_RAILROAD_LINE: '#e58850',
  BY_RAILROAD_BRUSH: '#FFE0A4',
  BY_SHIPS_LINE: '#94D8FF',
  BY_SHIPS_BRUSH: '#94D8FF',
  COMBINED_LINE: '#5bb24e',
  COMBINED_BRUSH: '#5bb24e',
  DEFAULT_LINE: '#DFE3B4',
  DEFAULT_BRUSH: '#DFE3B4',
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

export const FIELDS_TYPE = {
  POINT: 'point',
  SEGMENT: 'segment',
}

export const MARCH_TEMPLATES = {
  // Своїм ходом
  [MARCH_TYPES.OWN_RESOURCES]: {
    required: [
      { type: FIELDS_TYPE.POINT, required: true },
      {
        possibleTypes: [ SEGMENT_TYPES.TO_STARTING_POINT ],
        required: true,
        coordStart: '',
        coordEnd: '',
      },
      { type: FIELDS_TYPE.POINT, required: true },
      {
        possibleTypes: [ SEGMENT_TYPES.TO_DESTINATION_POINT ],
        required: true,
        coordStart: '',
        coordEnd: '',
      },
      { type: FIELDS_TYPE.POINT, required: true },
    ],
    optional: [
      {
        possibleTypes: [ SEGMENT_TYPES.INTERMEDIATE ],
        coordStart: '',
        coordEnd: '',
      },
      { type: FIELDS_TYPE.POINT },
    ],
    hasOptional: true,
  },

  // Залізницею
  [MARCH_TYPES.BY_RAILROAD]: {
    required: [
      { type: FIELDS_TYPE.POINT, required: true },
      {
        possibleTypes: [
          SEGMENT_TYPES.TO_STARTING_POINT,
          SEGMENT_TYPES.TO_BOOT_STATION,
        ],
        required: true,
        coordStart: '',
        coordEnd: '',
      },
      { type: FIELDS_TYPE.POINT, required: true },
      {
        possibleTypes: [
          SEGMENT_TYPES.RAILROAD,
        ],
        required: true,
        coordStart: '',
        coordEnd: '',
      },
      { type: FIELDS_TYPE.POINT, required: true },
      {
        possibleTypes: [
          SEGMENT_TYPES.TO_DESTINATION_POINT,
          SEGMENT_TYPES.FROM_UNLOADING_STATION,
        ],
        required: true,
        coordStart: '',
        coordEnd: '',
      },
      { type: FIELDS_TYPE.POINT, required: true },
    ],
  },
  // Морем
  [MARCH_TYPES.BY_SHIPS]: {
    required: [
      { type: FIELDS_TYPE.POINT, required: true },
      {
        possibleTypes: [
          SEGMENT_TYPES.TO_BOOT_STATION,
          SEGMENT_TYPES.TO_STARTING_POINT,
        ],
        required: true,
        coordStart: '',
        coordEnd: '',
      },
      { type: FIELDS_TYPE.POINT, required: true },

      {
        possibleTypes: [
          SEGMENT_TYPES.SEA,
        ],
        required: true,
        coordStart: '',
        coordEnd: '',
      },
      { type: FIELDS_TYPE.POINT, required: true },
      {
        possibleTypes: [
          SEGMENT_TYPES.TO_DESTINATION_POINT,
          SEGMENT_TYPES.FROM_UNLOADING_STATION,
        ],
        required: true,
        coordStart: '',
        coordEnd: '',
      },
      { type: FIELDS_TYPE.POINT, required: true },
    ],
  },
  // Комбінований
  [MARCH_TYPES.COMBINED]: {
    required: [
      { type: FIELDS_TYPE.POINT, required: true },
      {
        possibleTypes: [
          SEGMENT_TYPES.TO_BOOT_STATION,
          SEGMENT_TYPES.TO_STARTING_POINT,
        ],
        required: true,
        coordStart: '',
        coordEnd: '',
      },
      { type: FIELDS_TYPE.POINT, required: true },
      {
        possibleTypes: [
          SEGMENT_TYPES.TO_DESTINATION_POINT,
          SEGMENT_TYPES.FROM_UNLOADING_STATION,
        ],
        required: true,
        coordStart: '',
        coordEnd: '',
      },
      { type: FIELDS_TYPE.POINT, required: true },

    ],
    optional: [
      {
        possibleTypes: [
          SEGMENT_TYPES.INTERMEDIATE,
          SEGMENT_TYPES.RAILROAD,
          SEGMENT_TYPES.SEA,
        ],
        coordStart: '',
        coordEnd: '',
      },
      { type: FIELDS_TYPE.POINT },
    ],
    hasOptional: true,
  },
}
