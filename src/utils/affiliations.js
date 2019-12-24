import { model } from '@DZVIN/MilSymbolEditor'
import i18n from '../i18n'

export const IDENTITIES = {
  PENDING: '0',
  UNKNOWN: '1',
  ASSUMED_FRIEND: '2',
  FRIEND: '3',
  NEUTRAL: '4',
  SUSPECT_JOKER: '5',
  HOSTILE_FAKER: '6',
}

export const IDENTITY_LIST = [
  { id: IDENTITIES.PENDING, text: i18n.AFFILIATIONS.PENDING },
  { id: IDENTITIES.UNKNOWN, text: i18n.AFFILIATIONS.UNKNOWN },
  { id: IDENTITIES.ASSUMED_FRIEND, text: i18n.AFFILIATIONS.ASSUMED_FRIEND },
  { id: IDENTITIES.FRIEND, text: i18n.AFFILIATIONS.FRIEND },
  { id: IDENTITIES.NEUTRAL, text: i18n.AFFILIATIONS.NEUTRAL },
  { id: IDENTITIES.SUSPECT_JOKER, text: i18n.AFFILIATIONS.SUSPECT_JOKER },
  { id: IDENTITIES.HOSTILE_FAKER, text: i18n.AFFILIATIONS.HOSTILE_FAKER },
]

export const FRIENDS = [
  IDENTITIES.FRIEND,
  IDENTITIES.ASSUMED_FRIEND,
]

export const ENEMIES = [
  IDENTITIES.HOSTILE_FAKER,
  IDENTITIES.SUSPECT_JOKER,
  IDENTITIES.NEUTRAL,
  IDENTITIES.UNKNOWN,
  IDENTITIES.PENDING,
]

export const getIdentity = (objectCode) => model.APP6Code.getIdentity2(objectCode)

export const isEnemy = (objectCode) => ENEMIES.includes(getIdentity(objectCode))

export const isFriend = (objectCode) => FRIENDS.includes(getIdentity(objectCode))

export const isFriendObject = (object) => object && object.code && isFriend(object.code)

export const isEnemyObject = (object) => object && object.code && isEnemy(object.code)
