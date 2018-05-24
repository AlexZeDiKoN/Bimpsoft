export const addActiveModifier = (isActive, className) => className + (!!isActive) ? ` ${className}--active` : ''

// eslint-disable-next-line arrow-body-style
export const switchClassNames = (showFirst, firstClassName, secondClassName) => {
  return (!showFirst) ? firstClassName : secondClassName
}
