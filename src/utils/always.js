import { objectIsArray, objectIsObject } from './whatIsIt'

export const FREEZED_ARRAY = Object.freeze([])
export const FREEZED_OBJECT = Object.freeze({})

export const alwaysArray = (item) => objectIsArray(item) ? item : FREEZED_ARRAY
export const alwaysObject = (item) => objectIsObject(item) ? item : FREEZED_OBJECT
