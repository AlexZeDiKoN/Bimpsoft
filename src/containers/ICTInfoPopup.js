import { connect } from 'react-redux'
import ICTInfo from '../components/ICTInfo'
import { inICTMode } from '../store/selectors'
import { getProps } from '../utils'
import { catchErrors } from '../store/actions/asyncAction'
import { clearVariant } from '../store/actions/maps'

const ICTInfoPopup = connect(
  getProps({
    inICTMode,
  }),
  catchErrors({
    clearVariant,
  })
)(ICTInfo)

ICTInfoPopup.displayName = 'ICTInfoPopup'

export default ICTInfoPopup
