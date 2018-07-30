import { connect } from 'react-redux'
import { SymbolEditorComponent } from '@DZVIN/MilSymbolEditor'
import { notifications, viewModes } from '../store/actions'
import { edit } from '../constants/viewModesKeys'

const mapStateToProps = (store) => {
  const { orgStructures } = store
  const code = '10011500521200000800'
  // const code = '10000000000000000000'
  return {
    code,
    orgStructures,
    orgStructureId: 1190000,
    amplifiers: {},
  }
}
const mapDispatchToProps = (dispatch) => ({
  onChange: (data) => {
    const { code, coordinates, orgStructureId, amplifiers } = data
    dispatch(notifications.push({
      message: 'Шаблон выполнен',
      description: `код: ${code}, orgStructureId: ${orgStructureId}, координати: ${JSON.stringify(coordinates)}, ${JSON.stringify(amplifiers)}`,
    }))
    dispatch(viewModes.viewModeDisable(edit))
  },
  onAddToTemplates: (data) => {
    const { code, coordinates, orgStructureId } = data
    dispatch(notifications.push({
      message: 'Добавить в шаблон',
      description: `код: ${code}, orgStructureId: ${orgStructureId}, координати: ${JSON.stringify(coordinates)}, `,
    }))
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
)(SymbolEditorComponent)

export default MilSymbolGeneratorContainer
