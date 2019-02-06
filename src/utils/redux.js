export const getProps = (props) => (state) => {
  const result = {}
  Object.entries(props).forEach(([ key, value ]) => {
    result[key] = value(state)
  })
  return result
}
