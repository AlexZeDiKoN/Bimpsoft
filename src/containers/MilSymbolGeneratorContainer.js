import { connect } from 'react-redux'
import SymbolGeneratorComponent from '../components/symbol/SymbolGeneratorComponent'
import { notifications, viewModes } from '../store/actions'
import { edit } from '../constants/viewModesKeys'

const mapStateToProps = (store) => {
  const code = '10011500521200000800'
  // const code = '10000000000000000000'
  return {
    code,
  }
}
const mapDispatchToProps = (dispatch) => ({
  onChange: (code) => {
    dispatch(notifications.push({ message: 'Код добавлен', description: `код: ${code}` }))
    dispatch(viewModes.viewModeDisable(edit))
  },
  onClose: (code) => {
    dispatch(notifications.push({ message: 'Форма закрыта', description: '' }))
    dispatch(viewModes.viewModeDisable(edit))
  },
})
const MilSymbolGeneratorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SymbolGeneratorComponent)

export default MilSymbolGeneratorContainer
