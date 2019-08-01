/**
 * Created by pavlo.cherevko (melight@ex.ua) on 7/29/2019
 */
import PropTypes from 'prop-types'
import moment from 'moment'
import i18n from '../../i18n'
import IndicationCodes from '../../constants/ict'
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

const renderIndicator = (title, data) => `<span class='unit_indicators_indicator'>
  <span class='unit_indicators_indicator_title'>${title}:</span>
  <span class='unit_indicators_indicator_data'>${data || i18n.NOT_CALCULATED}</span>
</span>`

const renderIndicators = (indicatorsData = {}, unitData) => {
  const unitShortName = unitData.shortName || unitData.fullName
  const dateFor = indicatorsData.dateFor && moment(indicatorsData.dateFor).format(DATE_TIME_FORMAT)
  const bp001 = indicatorsData[IndicationCodes.BP001]
  const bp002 = indicatorsData[IndicationCodes.BP002]
  const bp003 = indicatorsData[IndicationCodes.BP003]
  const bp004 = indicatorsData[IndicationCodes.BP004]
  const bchs003 = indicatorsData[IndicationCodes.BCHS003]
  const bchs004 = indicatorsData[IndicationCodes.BCHS004]
  const bchs005 = indicatorsData[IndicationCodes.BCHS005]
  const bchs006 = indicatorsData[IndicationCodes.BCHS006]
  return (`
    <div class='unit_indicators'>
    ${renderIndicator(i18n.UNIT_NAME, unitShortName)}
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
