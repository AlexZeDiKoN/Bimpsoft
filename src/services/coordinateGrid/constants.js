// GRID CONSTANTS
const CELL_SIZES_BY_Z = {
  1000000: {
    lat: 4,
    lng: 6,
  },
  500000: {
    lat: 2,
    lng: 3,
  },
  200000: {
    lat: 0.667,
    lng: 1,
  },
  100000: {
    lat: 0.332,
    lng: 0.5,
  },
  50000: {
    lat: 0.167,
    lng: 0.25,
  },
  25000: {
    lat: 0.083,
    lng: 0.125,
  },
  10000: {
    lat: 0.042,
    lng: 0.063,
  },
  5000: {
    lat: 0.021,
    lng: 0.031,
  },
  2000: {
    lat: 0.007,
    lng: 0.01,
  },
}
const INIT_GRID_OPTIONS = {
  color: 'black',
  fillOpacity: 0,
  weight: 0.5,
}
const SELECTED_CELL_OPTIONS = {
  color: 'blue',
  fillOpacity: 0.3,
}
const INITIAL_COORDINATES = {
  TLC: [ 0, 0 ],
  TRC: [ 0, 0 ],
  BLC: [ 0, 0 ],
  BRC: [ 0, 0 ],
}
const GRID_CELLS_STRUCTURE = {
  row_length: 0,
  column_length: 0,
}
const ZOOM = 50000
const lat = 0
const lng = 1

export default {
  CELL_SIZES_BY_Z,
  INIT_GRID_OPTIONS,
  SELECTED_CELL_OPTIONS,
  INITIAL_COORDINATES,
  GRID_CELLS_STRUCTURE,
  ZOOM,
  lat,
  lng,
}
