import { CoordinatesTypes } from '../constants'

export const PRINT_PANEL_KEYS = {
  MAP_LABEL: 'mapLabel',
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

export const PRINT_STEPS = {
  SENT: 'sent',
  RECEIVED: 'received',
  PROCESSING: 'processing',
  DONE: 'done',
  ERROR: 'error',
}

export const PRINT_STEPS_KEYS = {
  [PRINT_STEPS.SENT]: 'Надіслано в обробку',
  [PRINT_STEPS.RECEIVED]: 'Поставлено в чергу',
  [PRINT_STEPS.PROCESSING]: 'Формування графічного файлу',
  [PRINT_STEPS.DONE]: 'Файл сформовано',
  [PRINT_STEPS.ERROR]: 'Виникла помилка',
}

// TODO: тимчасово прибрано масштаб '1000000'
export const PRINT_SCALES = [ '100000', '200000', '500000' ]

export const DATE_FORMAT = 'DD.MM.YYYY'

export const DPI_TYPES = [ '150', '200', '300', '600' ]

export const PRINT_PROJECTION_GROUP = [ CoordinatesTypes.UCS_2000, CoordinatesTypes.UTM ]
