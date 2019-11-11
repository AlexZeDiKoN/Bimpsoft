/**
 * Create array that
 * has all items that comes after value at the beginning
 * and after them items that comes before value,
 * with saving order of those two parts
 *
 * @template T
 * @param {T|Function} value Value to start or custom predicate
 * @param {Array<T>} array Original array
 *
 * @returns {Array<T>}
 */
export default function getLoopOrderStartingFromNextValue (value, array) {
  const predicate = typeof value === 'function' ? value : (v) => v === value
  const valueIndex = array.findIndex(predicate)

  if (valueIndex === -1) {
    return array
  }

  return [ ...array.slice(valueIndex + 1), ...array.slice(0, valueIndex) ]
}
