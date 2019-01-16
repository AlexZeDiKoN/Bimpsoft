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
}
export const INIT_GRID_OPTIONS = {
  color: 'black',
  fillOpacity: 0.3,
  weight: 0.5,
}
export const SELECTED_CELL_OPTIONS = {
  color: 'black',
  fillOpacity: 0,
}
export const SCREEN_COORDINATES = {
  TLC: [ 0, 0 ],
  TRC: [ 0, 0 ],
  BLC: [ 0, 0 ],
  BRC: [ 0, 0 ],
}
export const GRID_CELLS_STRUCTURE = {
  row_length: 0,
  column_length: 0,
}
export const ITEM_NUMBER = {
  '1M': [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'Z',
  ],
  '500K': [
    'А', 'Б', 'В', 'Г',
  ],
  '200K': { X: 10, IX: 9, V: 5, IV: 4, I: 1 },
}
export const LAT = 0
export const LNG = 1
