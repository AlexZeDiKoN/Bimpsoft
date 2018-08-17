import { components } from '@DZVIN/CommonComponents'
import i18n from '../i18n'

const { icons: { names: iconNames } } = components

const SubordinationLevel = {
  TEAM_CREW: 'TEAM_CREW',
  SQUAD: 'SQUAD',
  SECTION: 'SECTION',
  PLATOON_DETACHMENT: 'PLATOON_DETACHMENT',
  COMPANY_BATTERY_TROOP: 'COMPANY_BATTERY_TROOP',
  BATTALION_SQUADRON: 'BATTALION_SQUADRON',
  REGIMENT_GROUP: 'REGIMENT_GROUP',
  BRIGADE: 'BRIGADE',
  DIVISION: 'DIVISION',
  CORPS_MEF: 'CORPS_MEF',
  ARMY: 'ARMY',
  ARMY_GROUP_FRONT: 'ARMY_GROUP_FRONT',
  REGION_THEATER: 'REGION_THEATER',
  COMMAND: 'COMMAND',
}

SubordinationLevel.list = [
  {
    value: SubordinationLevel.TEAM_CREW,
    title: i18n.TEAM_CREW,
    icon: iconNames.UNIT_1_ACTIVE,
    iconActive: iconNames.UNIT_1_HOVER,
    number: 11,
  },
  {
    value: SubordinationLevel.SQUAD,
    title: i18n.SQUAD,
    icon: iconNames.UNIT_2_ACTIVE,
    iconActive: iconNames.UNIT_2_HOVER,
    number: 12,
  },
  {
    value: SubordinationLevel.SECTION,
    title: i18n.SECTION,
    icon: iconNames.UNIT_3_ACTIVE,
    iconActive: iconNames.UNIT_3_HOVER,
    number: 13,
  },
  {
    value: SubordinationLevel.PLATOON_DETACHMENT,
    title: i18n.PLATOON_DETACHMENT,
    icon: iconNames.UNIT_4_ACTIVE,
    iconActive: iconNames.UNIT_4_HOVER,
    number: 14,
  },
  {
    value: SubordinationLevel.COMPANY_BATTERY_TROOP,
    title: i18n.COMPANY_BATTERY_TROOP,
    icon: iconNames.UNIT_5_ACTIVE,
    iconActive: iconNames.UNIT_5_HOVER,
    number: 15,
  },
  {
    value: SubordinationLevel.BATTALION_SQUADRON,
    title: i18n.BATTALION_SQUADRON,
    icon: iconNames.UNIT_6_ACTIVE,
    iconActive: iconNames.UNIT_6_HOVER,
    number: 16,
  },
  {
    value: SubordinationLevel.REGIMENT_GROUP,
    title: i18n.REGIMENT_GROUP,
    icon: iconNames.UNIT_7_ACTIVE,
    iconActive: iconNames.UNIT_7_HOVER,
    number: 17,
  },
  {
    value: SubordinationLevel.BRIGADE,
    title: i18n.BRIGADE,
    icon: iconNames.UNIT_8_ACTIVE,
    iconActive: iconNames.UNIT_8_HOVER,
    number: 18,
  },
  {
    value: SubordinationLevel.DIVISION,
    title: i18n.DIVISION,
    icon: iconNames.UNIT_9_ACTIVE,
    iconActive: iconNames.UNIT_9_HOVER,
    number: 21,
  },
  {
    value: SubordinationLevel.CORPS_MEF,
    title: i18n.CORPS_MEF,
    icon: iconNames.UNIT_10_ACTIVE,
    iconActive: iconNames.UNIT_10_HOVER,
    number: 22,
  },
  {
    value: SubordinationLevel.ARMY,
    title: i18n.ARMY,
    icon: iconNames.UNIT_11_ACTIVE,
    iconActive: iconNames.UNIT_11_HOVER,
    number: 23,
  },
  {
    value: SubordinationLevel.ARMY_GROUP_FRONT,
    title: i18n.ARMY_GROUP_FRONT,
    icon: iconNames.UNIT_12_ACTIVE,
    iconActive: iconNames.UNIT_12_HOVER,
    number: 24,
  },
  {
    value: SubordinationLevel.REGION_THEATER,
    title: i18n.REGION_THEATER,
    icon: iconNames.UNIT_13_ACTIVE,
    iconActive: iconNames.UNIT_13_HOVER,
    number: 25,
  },
  {
    value: SubordinationLevel.COMMAND,
    title: i18n.COMMAND,
    icon: iconNames.UNIT_13_ACTIVE,
    iconActive: iconNames.UNIT_13_HOVER,
    number: 26,
  },
]

export default SubordinationLevel
