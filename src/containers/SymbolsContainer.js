import { connect } from 'react-redux'
import Symbols from '../components/Symbols'
import { canEditSelector } from '../store/selectors'

const mapStateToProps = (state) => ({
  orgStructureAffiliation: state.orgStructures?.formation?.affiliationTypeID,
  canEdit: canEditSelector(state),
})

const SymbolsContainer = connect(
  mapStateToProps,
)(Symbols)

export default SymbolsContainer
