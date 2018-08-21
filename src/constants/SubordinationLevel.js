import { components } from '@DZVIN/CommonComponents'
import i18n from '../i18n'

const { icons: { names: iconNames } } = components

const SubordinationLevel = {
  TEAM_CREW: 11,
  SQUAD: 12,
  SECTION: 13,
  PLATOON_DETACHMENT: 14,
  COMPANY_BATTERY_TROOP: 15,
  BATTALION_SQUADRON: 16,
  REGIMENT_GROUP: 17,
  BRIGADE: 18,
  DIVISION: 21,
  CORPS_MEF: 22,
  ARMY: 23,
  ARMY_GROUP_FRONT: 24,
  REGION_THEATER: 25,
  COMMAND: 26,
}

SubordinationLevel.list = [
  {
    value: SubordinationLevel.TEAM_CREW,
    title: i18n.TEAM_CREW,
    icon: iconNames.UNIT_1_ACTIVE,
    iconActive: iconNames.UNIT_1_HOVER,
  },
  {
    value: SubordinationLevel.SQUAD,
    title: i18n.SQUAD,
    icon: iconNames.UNIT_2_ACTIVE,
    iconActive: iconNames.UNIT_2_HOVER,
  },
  {
    value: SubordinationLevel.SECTION,
    title: i18n.SECTION,
    icon: iconNames.UNIT_3_ACTIVE,
    iconActive: iconNames.UNIT_3_HOVER,
  },
  {
    value: SubordinationLevel.PLATOON_DETACHMENT,
    title: i18n.PLATOON_DETACHMENT,
    icon: iconNames.UNIT_4_ACTIVE,
    iconActive: iconNames.UNIT_4_HOVER,
  },
  {
    value: SubordinationLevel.COMPANY_BATTERY_TROOP,
    title: i18n.COMPANY_BATTERY_TROOP,
    icon: iconNames.UNIT_5_ACTIVE,
    iconActive: iconNames.UNIT_5_HOVER,
  },
  {
    value: SubordinationLevel.BATTALION_SQUADRON,
    title: i18n.BATTALION_SQUADRON,
    icon: iconNames.UNIT_6_ACTIVE,
    iconActive: iconNames.UNIT_6_HOVER,
  },
  {
    value: SubordinationLevel.REGIMENT_GROUP,
    title: i18n.REGIMENT_GROUP,
    icon: iconNames.UNIT_7_ACTIVE,
    iconActive: iconNames.UNIT_7_HOVER,
  },
  {
    value: SubordinationLevel.BRIGADE,
    title: i18n.BRIGADE,
    icon: iconNames.UNIT_8_ACTIVE,
    iconActive: iconNames.UNIT_8_HOVER,
  },
  {
    value: SubordinationLevel.DIVISION,
    title: i18n.DIVISION,
    icon: iconNames.UNIT_9_ACTIVE,
    iconActive: iconNames.UNIT_9_HOVER,
  },
  {
    value: SubordinationLevel.CORPS_MEF,
    title: i18n.CORPS_MEF,
    icon: iconNames.UNIT_10_ACTIVE,
    iconActive: iconNames.UNIT_10_HOVER,
  },
  {
    value: SubordinationLevel.ARMY,
    title: i18n.ARMY,
    icon: iconNames.UNIT_11_ACTIVE,
    iconActive: iconNames.UNIT_11_HOVER,
  },
  {
    value: SubordinationLevel.ARMY_GROUP_FRONT,
    title: i18n.ARMY_GROUP_FRONT,
    icon: iconNames.UNIT_12_ACTIVE,
    iconActive: iconNames.UNIT_12_HOVER,
  },
  {
    value: SubordinationLevel.REGION_THEATER,
    title: i18n.REGION_THEATER,
    icon: iconNames.UNIT_13_ACTIVE,
    iconActive: iconNames.UNIT_13_HOVER,
  },
  {
    value: SubordinationLevel.COMMAND,
    title: i18n.COMMAND,
    icon: iconNames.UNIT_13_ACTIVE,
    iconActive: iconNames.UNIT_13_HOVER,
  },
]

export default SubordinationLevel
