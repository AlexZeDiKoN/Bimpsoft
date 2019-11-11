import getLoopOrderStartingFromNextValue from './getLoopOrderStartingFromNextValue'

it('should return array with loop order without passed value', () => {
  const originalArray = [ 1, 2, 3, 4, 5, 6 ]
  expect(getLoopOrderStartingFromNextValue(3, originalArray)).toEqual([ 4, 5, 6, 1, 2 ])
  expect(getLoopOrderStartingFromNextValue(1, originalArray)).toEqual([ 2, 3, 4, 5, 6 ])
  expect(getLoopOrderStartingFromNextValue(6, originalArray)).toEqual([ 1, 2, 3, 4, 5 ])
})

it('should support custom find predicate', () => {
  const originalArray = [ { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 } ]
  const result = getLoopOrderStartingFromNextValue((item) => item.id === 3, originalArray)
  expect(result).toEqual([ { id: 4 }, { id: 5 }, { id: 6 }, { id: 1 }, { id: 2 } ])
})

it('should return original array if value is not in the array', () => {
  const originalArray = [ 1, 2, 3, 5, 6 ]
  const result = getLoopOrderStartingFromNextValue(4, originalArray)
  expect(result).toBe(originalArray)
})

it('should return original array if custom predicate did not found any value', () => {
  const originalArray = [ { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 } ]
  const result = getLoopOrderStartingFromNextValue((item) => item.id === 10, originalArray)
  expect(result).toBe(originalArray)
})
