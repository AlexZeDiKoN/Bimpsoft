import { connect } from 'react-redux'
import { SymbolEditorComponent } from '@DZVIN/MilSymbolEditor'
import { notifications } from '../store/actions'
import { catchErrors } from '../store/actions/asyncAction'

const mapStateToProps = (store) => {
  const { byIds, roots, formation } = store.orgStructures
  const code = '10000000000000000000'
  return {
    code,
    orgStructures: { byIds, roots, formation },
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
  },
  onAddToTemplates: (data) => {
    const { code, coordinates, orgStructureId } = data
    dispatch(notifications.push({
      message: 'Добавить в шаблон',
      description: `код: ${code}, orgStructureId: ${orgStructureId}, координати: ${JSON.stringify(coordinates)}, `,
    }))
  },
  onClose: (code) => {
    dispatch(notifications.push({ message: 'Форма закрыта', description: '' }))
  },
})
const MilSymbolGeneratorContainer = connect(
  mapStateToProps,
  catchErrors(mapDispatchToProps)
)(SymbolEditorComponent)

export default MilSymbolGeneratorContainer
