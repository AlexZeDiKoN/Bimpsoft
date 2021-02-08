import { model } from '@C4/MilSymbolEditor'
const { symbolOptions } = model

export const POINT_SIZE_MIN = 'point_size_min'
export const POINT_SIZE_MAX = 'point_size_max'
export const TEXT_SIZE_MIN = 'text_size_min'
export const TEXT_SIZE_MAX = 'text_size_max'
export const LINE_SIZE_MIN = 'line_size_min'
export const LINE_SIZE_MAX = 'line_size_max'
export const NODE_SIZE_MIN = 'node_size_min'
export const NODE_SIZE_MAX = 'node_size_max'
export const TEXT_AMPLIFIER_SIZE_MAX = 'text_amplif_size_max'
export const TEXT_AMPLIFIER_SIZE_MIN = 'text_amplif_size_min'
export const GRAPHIC_AMPLIFIER_SIZE_MAX = 'graphic_amplif_size_max'
export const GRAPHIC_AMPLIFIER_SIZE_MIN = 'graphic_amplif_size_min'
export const WAVE_SIZE_MIN = 'wave_size_min'
export const WAVE_SIZE_MAX = 'wave_size_max'
export const BLOCKAGE_SIZE_MIN = 'blockage_size_min'
export const BLOCKAGE_SIZE_MAX = 'blockage_size_max'
export const MOAT_SIZE_MIN = 'moat_size_min'
export const MOAT_SIZE_MAX = 'moat_size_max'
export const ROW_MINE_SIZE_MIN = 'row_mine_size_min'
export const ROW_MINE_SIZE_MAX = 'row_mine_size_max'
export const STROKE_SIZE_MIN = 'stroke_size_min'
export const STROKE_SIZE_MAX = 'stroke_size_max'
export const SCALE_VIEW_LEVEL = 'scale_view_level'
export const MAP_BASE_OPACITY = 'map_base_opacity'
export const INACTIVE_LAYERS_OPACITY = 'inactive_layers_opacity'
export const DEFAULT_COORD_SYSTEM = 'default_coord_system'
export const MINI_MAP = 'show_mini_map'
export const SHOW_AMPLIFIERS = 'show_amplifiers'
export const GENERALIZATION = 'generalization'

export const COORDINATES = 'coordinates'

export const AMPLIFIERS_GROUPS = [
  [ COORDINATES ],
  [ symbolOptions.altitudeDepth ],
  [ symbolOptions.dtg ],
  [ symbolOptions.staffComments ],
  [ symbolOptions.type, symbolOptions.equipmentTeardownTime, symbolOptions.platformType ],
  [ symbolOptions.additionalInformation, symbolOptions.commonIdentifier ],
  [ symbolOptions.higherFormation ],
  [ symbolOptions.uniqueDesignation ],
  [ symbolOptions.speed ],
  [ symbolOptions.combatEffectiveness, symbolOptions.iffSif, symbolOptions.evaluationRating ],
]

export const linesParams = [
  NODE_SIZE_MIN,
  NODE_SIZE_MAX,
  TEXT_AMPLIFIER_SIZE_MAX,
  TEXT_AMPLIFIER_SIZE_MIN,
  GRAPHIC_AMPLIFIER_SIZE_MAX,
  GRAPHIC_AMPLIFIER_SIZE_MIN,
  WAVE_SIZE_MIN,
  WAVE_SIZE_MAX,
]
