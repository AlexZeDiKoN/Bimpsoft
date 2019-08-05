import { model } from '@DZVIN/MilSymbolEditor'

export const IDENTITIES = {
  PENDING: '0',
  UNKNOWN: '1',
  ASSUMED_FRIEND: '2',
  FRIEND: '3',
  NEUTRAL: '4',
  SUSPECT_JOKER: '5',
  HOSTILE_FAKER: '6',
}

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
