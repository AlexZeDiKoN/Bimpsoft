import i18n from '../i18n'

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
  },
  {
    value: SubordinationLevel.SQUAD,
    title: i18n.SQUAD,
  },
  {
    value: SubordinationLevel.SECTION,
    title: i18n.SECTION,
  },
  {
    value: SubordinationLevel.PLATOON_DETACHMENT,
    title: i18n.PLATOON_DETACHMENT,
  },
  {
    value: SubordinationLevel.COMPANY_BATTERY_TROOP,
    title: i18n.COMPANY_BATTERY_TROOP,
  },
  {
    value: SubordinationLevel.BATTALION_SQUADRON,
    title: i18n.BATTALION_SQUADRON,
  },
  {
    value: SubordinationLevel.REGIMENT_GROUP,
    title: i18n.REGIMENT_GROUP,
  },
  {
    value: SubordinationLevel.BRIGADE,
    title: i18n.BRIGADE,
  },
  {
    value: SubordinationLevel.DIVISION,
    title: i18n.DIVISION,
  },
  {
    value: SubordinationLevel.CORPS_MEF,
    title: i18n.CORPS_MEF,
  },
  {
    value: SubordinationLevel.ARMY,
    title: i18n.ARMY,
  },
  {
    value: SubordinationLevel.ARMY_GROUP_FRONT,
    title: i18n.ARMY_GROUP_FRONT,
  },
  {
    value: SubordinationLevel.REGION_THEATER,
    title: i18n.REGION_THEATER,
  },
  {
    value: SubordinationLevel.COMMAND,
    title: i18n.COMMAND,
  },
]

export default SubordinationLevel
