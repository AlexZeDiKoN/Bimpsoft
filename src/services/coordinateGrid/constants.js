// GRID CONSTANTS
export const CELL_SIZES = {
  1000000: {
    lat: 4,
    lng: 6,
  },
  500000: {
    lat: 4 / 2,
    lng: 6 / 2,
  },
  200000: {
    lat: 4 / 6,
    lng: 6 / 6,
  },
  100000: {
    lat: 4 / 12,
    lng: 6 / 12,
  },
  50000: {
    lat: 4 / 12 / 2,
    lng: 6 / 12 / 2,
  },
  25000: {
    lat: 4 / 12 / 2 / 2,
    lng: 6 / 12 / 2 / 2,
  },
}

export const MIN_ZOOM = {
  25000: 10,
  50000: 9,
  100000: 8,
  200000: 7,
  500000: 6,
  1000000: 5,
}
export const INIT_GRID_OPTIONS = {
  color: 'black',
  fillOpacity: 0.3,
  weight: 0.5,
}

// нет номенклатурного листа
export const INIT_GRID_OPTIONS_NOT_MAP = {
  color: 'red',
  fillOpacity: 0.3,
  weight: 0.5,
}

export const SELECTED_CELL_OPTIONS = {
  color: 'black',
  fillOpacity: 0,
}

// лист выбран, но для него отсутствует номенклатурный лист
export const SELECTED_CELL_OPTIONS_NOT_MAP = {
  color: 'red',
  fillOpacity: 0.10,
}
export const GRID_CELLS_STRUCTURE = {
  row_length: 0,
  column_length: 0,
}
export const LAT = 0
export const LNG = 1
