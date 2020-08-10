export const isNumberSymbols = (value) => {
  const reg = /^-?[0-9]*(\.[0-9]*)?$/
  if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
    return true
  }
  return false
}
