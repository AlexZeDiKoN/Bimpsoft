import { utils } from '@C4/CommonComponents'
import i18n from '../i18n'

const { Coordinates: Coord } = utils

export const PRINT_PANEL_KEYS = {
  MAP_LABEL: 'mapLabel',
  LEGEND_ENABLED: 'legendEnabled',
  FIRST_ROW: 'firstRow',
  SECOND_ROW: 'secondRow',
  THIRD_ROW: 'thirdRow',
  FOURTH_ROW: 'fourthRow',
  FIFTH_ROW: 'fifthRow',
  START: 'start',
  FINISH: 'finish',
  INDICATOR_FIRST_ROW: 'indiFirst',
  INDICATOR_SECOND_ROW: 'indiSecond',
  INDICATOR_THIRD_ROW: 'indiThird',
  LEGEND_TABLE_TYPE: 'legendTableType',
  LEGEND_FIRST_CONTENT: 'legendFirstContent',
  LEGEND_SECOND_CONTENT: 'legendSecondContent',
  LEGEND_THIRD_CONTENT: 'legendThirdContent',
  LEGEND_FOURTH_CONTENT: 'legendFourthContent',
  CONFIRM_DATE: `confirmDate`,
}

export const PRINT_DATE_KEYS = [ 'START', 'FINISH' ]

export const COLOR_PICKER_KEYS = {
  LEGEND_FIRST_COLOR: 'legendFirstColor',
  LEGEND_SECOND_COLOR: 'legendSecondColor',
  LEGEND_THIRD_COLOR: 'legendThirdColor',
  LEGEND_FOURTH_COLOR: 'legendFourthColor',
}

export const PRINT_SELECTS_KEYS = {
  SCALE: 'scale',
  DPI: 'dpi',
  PROJECTION_GROUP: 'projectionGroup',
}

export const PRINT_SIGNATORIES = {
  SIGNATORIES: 'signatories',
}

export const PRINT_STEPS = {
  SENT: 'sent',
  RECEIVED: 'received',
  PROCESSING: 'processing',
  DONE: 'done',
  ERROR: 'error',
}

export const PRINT_STEPS_KEYS = {
  [PRINT_STEPS.SENT]: i18n.SENT_TO_PROCESSING,
  [PRINT_STEPS.RECEIVED]: i18n.PUT_IN_QUEUE,
  [PRINT_STEPS.PROCESSING]: i18n.FORMATION_FILE,
  [PRINT_STEPS.DONE]: i18n.FILE_IS_GENERATED,
  [PRINT_STEPS.ERROR]: i18n.ERROR_OCCURRED,
}

export const PRINT_SCALES = [ 500000, 200000, 100000, 50000, 25000 ]

export const DATE_FORMAT = 'DD.MM.YYYY'

export const DPI_TYPES = [ '150', '300', '600' ]

export const DPI_TYPE_MAX_LISTS = { '600': 4, '300': 16 }

export const PRINT_PROJECTION_GROUP = [ Coord.types.UCS_2000, Coord.types.UTM ]

export const LS_GROUP = 'print'

export const DOC_CLASS_ID = '5c767b4e737a6915a1000001'

export const PRINT_LEGEND_MIN_LISTS = { X: 1, Y: 1 }
