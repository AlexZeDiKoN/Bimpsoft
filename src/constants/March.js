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

export const MARCH_INDICATORS_GROUP = 'МШВ'

export const MARCH_TYPES_TEMPLATES = {
  // Своїм ходом
  41: [
    {
      proposedSegmentTypes: [ 45 ],
      adding: true,
      delete: false,
    },
    {
      proposedSegmentTypes: [ 47 ],
      adding: true,
      delete: false,
    },
  ],
  'Залізницею': [],
  'Морем (річкою)': [],
  'Комбінований': [],
}
