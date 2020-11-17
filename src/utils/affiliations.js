import { model } from '@C4/MilSymbolEditor'

export const IDENTITIES = {
  PENDING: '0',
  UNKNOWN: '1',
  ASSUMED_FRIEND: '2',
  FRIEND: '3',
  NEUTRAL: '4',
  SUSPECT_JOKER: '5',
  HOSTILE_FAKER: '6',
}

export const IDENTITY_LIST = model.app6Data.identities

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
