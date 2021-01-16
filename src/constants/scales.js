import SubordinationLevel from './SubordinationLevel'

export const SCALES = [ 5000, 10000, 25000, 50000, 100000, 200000, 500000, 1000000, 2500000, 5000000 ]

export const ZOOMS_SCALES = {
  16: 5000,
  15: 10000,
  14: 25000,
  13: 50000,
  12: 100000,
  11: 200000,
  10: 500000,
  9: 1000000,
  8: 2000000,
  7: 2500000,
  6: 5000000,
}

export const ZOOMS = {
  20: 5000,
  19: 5000,
  18: 5000,
  17: 5000,
  16: 5000,
  15: 10000,
  14: 25000,
  13: 50000,
  12: 100000,
  11: 200000,
  10: 500000,
  9: 1000000,
  8: 1000000,
  7: 2500000,
  6: 5000000,
  5: 5000000,
  4: 5000000,
  3: 5000000,
  2: 5000000,
  1: 5000000,
}

export const INIT_VALUES = {
  5000: SubordinationLevel.TEAM_CREW,
  10000: SubordinationLevel.SQUAD,
  25000: SubordinationLevel.PLATOON_DETACHMENT,
  50000: SubordinationLevel.COMPANY_BATTERY_TROOP,
  100000: SubordinationLevel.COMPANY_BATTERY_TROOP,
  200000: SubordinationLevel.BATTALION_SQUADRON,
  500000: SubordinationLevel.BRIGADE,
  1000000: SubordinationLevel.BRIGADE,
  2500000: SubordinationLevel.BRIGADE,
  5000000: SubordinationLevel.BRIGADE,
}
