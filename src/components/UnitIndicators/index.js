/**
 * Created by pavlo.cherevko (melight@ex.ua) on 7/29/2019
 */
import PropTypes from 'prop-types'
import moment from 'moment'
import i18n from '../../i18n'
import { DATE_TIME_FORMAT } from '../../constants/formats'

import './style.css'

const renderTag = ({ color = 'black', value = '' }) => `<span 
  class='indicators_tag' 
  style="background-color:${color}"
>${value}</span>`

renderTag.propTypes = {
  color: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}

const renderIndicator = (title, data) => `<span className='unit_indicators_indicator'>
  <u><span className='unit_indicators_indicator_title'>${title}:</span></u>
  <span className='unit_indicators_indicator_data'>${data || 'Данні не розраховано'}</span>
</span>`

const renderIndicators = (indicatorsData = {}) => {
  const unitShortName = indicatorsData.unit && indicatorsData.unit.shortName
  const dateFor = indicatorsData.dateFor && moment(indicatorsData.dateFor).format(DATE_TIME_FORMAT)
  const bp001 = indicatorsData['БП001']
  const bp002 = indicatorsData['БП002']
  const bp003 = indicatorsData['БП003']
  const bp004 = indicatorsData['БП004']
  const bchs003 = indicatorsData['БЧС003']
  const bchs004 = indicatorsData['БЧС004']
  const bchs005 = indicatorsData['БЧС005']
  const bchs006 = indicatorsData['БЧС006']
  return (`
    <div class='unit_indicators'>
    ${(unitShortName && renderIndicator(i18n.UNIT_NAME, unitShortName)) || ''}
    ${(dateFor && renderIndicator(i18n.DATE_FOR, dateFor)) || ''}
    ${renderIndicator(i18n.BP_002, bp002)}
    ${renderIndicator(i18n.BP_001, bp001)}
    ${renderIndicator(i18n.BP_003, bp003 && renderTag(bp003))}
    ${renderIndicator(i18n.BP_004, bp004 && renderTag(bp004))}
    ${renderIndicator(i18n.BCHS_005, bchs005) || ''}
    ${renderIndicator(i18n.BCHS_006, bchs006) || ''}
    ${renderIndicator(i18n.BCHS_003, bchs003 && renderTag(bchs003))}
    ${renderIndicator(i18n.BCHS_004, bchs004 && renderTag(bchs004))}
  </div>
  `)
}

export default renderIndicators
