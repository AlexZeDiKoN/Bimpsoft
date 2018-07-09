import modifiers from '../model/modifiers'
import i18n from '../i18n'

const identities = [
  { id: '3', title: i18n.IDENTITY_FRIEND },
  { id: '2', title: i18n.IDENTITY_ASSUMED_FRIEND },
  { id: '6', title: i18n.IDENTITY_HOSTILE_FAKER },
  { id: '5', title: i18n.IDENTITY_SUSPECT_JOKER },
  { id: '4', title: i18n.IDENTITY_NEUTRAL },
  { id: '1', title: i18n.IDENTITY_UNKNOWN },
  { id: '0', title: i18n.IDENTITY_PENDING },
]

// for SIGN_LAND_UNIT
const ECHELONS = [
  { id: '00', title: i18n.ECHELON_UNSPECIFIED },
  { id: '11', title: i18n.ECHELON_TEAM_CREW },
  { id: '12', title: i18n.ECHELON_SQUAD },
  { id: '13', title: i18n.ECHELON_SECTION },
  { id: '14', title: i18n.ECHELON_PLATOON_DETACHMENT },
  { id: '15', title: i18n.ECHELON_COMPANY_BATTERY_TROOP },
  { id: '16', title: i18n.ECHELON_BATTALION_SQUADRON },
  { id: '17', title: i18n.ECHELON_REGIMENT_GROUP },
  { id: '18', title: i18n.ECHELON_BRIGADE },
  { id: '21', title: i18n.ECHELON_DIVISION },
  { id: '22', title: i18n.ECHELON_CORPS_MEF },
  { id: '23', title: i18n.ECHELON_ARMY },
  { id: '24', title: i18n.ECHELON_ARMY_GROUP_FRONT },
  { id: '25', title: i18n.ECHELON_REGION_THEATER },
  { id: '26', title: i18n.ECHELON_COMMAND },
]

// for SIGN_LAND_EQUIPMENT
const MOBILITIES = [
  { id: '00', title: i18n.MOBILITY_UNSPECIFIED },
  { id: '31', title: i18n.MOBILITY_WHEELED_LIMITED_CROSS_COUNTRY },
  { id: '32', title: i18n.MOBILITY_WHEELED_CROSS_COUNTRY },
  { id: '33', title: i18n.MOBILITY_TRACKED },
  { id: '34', title: i18n.MOBILITY_WHEELED_AND_TRACKED_COMBINATION },
  { id: '35', title: i18n.MOBILITY_TOWED },
  { id: '36', title: i18n.MOBILITY_RAILWAY },
  { id: '37', title: i18n.MOBILITY_PACK_ANIMALS },
  { id: '41', title: i18n.MOBILITY_OVER_SNOW_PRIME_MOVER },
  { id: '42', title: i18n.MOBILITY_SLED },
  { id: '51', title: i18n.MOBILITY_BARGE },
  { id: '52', title: i18n.MOBILITY_AMPHIBIOUS },
]

// // for SIGN_DISMOUNTED_INDIVIDUAL
// const INDIVIDUAL_AMPLIFIERS = {
//   title: 'Тип особи',
//   values: [
//     { id: '00', title: i18n.INDIVIDUAL_UNSPECIFIED },
//     { id: '71', title: i18n.INDIVIDUAL_LEADER },
//   ],
// }
//
// // for SIGN_SEA_SURFACE and SIGN_SEA_SUBSURFACE
// const TOWED_ARRAYS = {
//   title: 'Тип об\'єкту',
//   values: [
//     { id: '00', title: i18n.TOWED_ARRAY_UNSPECIFIED },
//     { id: '61', title: i18n.TOWED_ARRAY_SHORT },
//     { id: '62', title: i18n.TOWED_ARRAY_LONG },
//   ],
// }

const symbols = [
  { id: '01', title: i18n.SIGN_AIR },
  { id: '02', title: i18n.SIGN_AIR_MISSILE },
  { id: '05', title: i18n.SIGN_SPACE },
  { id: '10', title: i18n.SIGN_LAND_UNIT },
  { id: '11', title: i18n.SIGN_LAND_CIVILIAN_UNIT_ORGANIZATION },
  { id: '15', title: i18n.SIGN_LAND_EQUIPMENT },
  { id: '20', title: i18n.SIGN_LAND_INSTALLATIONS },
  { id: '25', title: i18n.SIGN_CONTROL_MEASURE },
  { id: '27', title: i18n.SIGN_DISMOUNTED_INDIVIDUAL },
  { id: '30', title: i18n.SIGN_SEA_SURFACE },
  { id: '35', title: i18n.SIGN_SEA_SUBSURFACE },
  { id: '36', title: i18n.SIGN_MINE_WARFARE },
  { id: '40', title: i18n.SIGN_ACTIVITY_EVENT },
]

const statuses = [
  { id: '0', title: i18n.STATUS_PRESENT },
  { id: '1', title: i18n.STATUS_PLANNED_ANTICIPATED_SUSPECT },
  { id: '2', title: i18n.STATUS_PRESENT_FULLY_CAPABLE },
  { id: '3', title: i18n.STATUS_PRESENT_DAMAGED },
  { id: '4', title: i18n.STATUS_PRESENT_DESTROYED },
  { id: '5', title: i18n.STATUS_PRESENT_FULL_TO_CAPACITY },
]

export default {
  identities,
  symbols,
  statuses,
  amplifiers: {
    '10': ECHELONS,
    '15': MOBILITIES,
  },
  icons: modifiers.icons,
  modifiers1: modifiers.modifiers1,
  modifiers2: modifiers.modifiers2,
}
