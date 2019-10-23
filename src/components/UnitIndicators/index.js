/**
 * Created by pavlo.cherevko (melight@ex.ua) on 7/29/2019
 */
import PropTypes from 'prop-types'
import moment from 'moment'
import i18n from '../../i18n'
import IndicationCodes from '../../constants/ict'
import { DATE_TIME_FORMAT } from '../../constants/formats'

import './style.css'

const percentIndicator = true

const renderTag = ({ color = 'black', value = '' }) => `<span 
  class='indicators_tag' 
  style="background-color:${color}"
>${value}</span>`

renderTag.propTypes = {
  color: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}

const renderIndicator = (title, data, isPercent) => `<div class='unit_indicators_indicator'>
    <div class='unit_indicators_indicator_title'>${title}:</div>
    <div class='unit_indicators_indicator_data'>${data ? isPercent
      ? ((typeof data === 'number' && data * 100) || 0) + '%'
      : data : i18n.NOT_CALCULATED}</div>
</div>`

const renderIndicators = (object, unitData) => {
  const indicatorsData = object.indicatorsData || {}
  const unitShortName = (indicatorsData.unit &&
    (indicatorsData.unit.shortName || indicatorsData.unit.fullName)) ||
    unitData.shortName || unitData.fullName
  const dateFor = (indicatorsData.dateFor && moment(indicatorsData.dateFor).format(DATE_TIME_FORMAT))
      || moment().format(DATE_TIME_FORMAT)
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
    ${renderIndicator(i18n.DATE_FOR, dateFor)}
    ${renderIndicator(i18n.BP_002, bp002)}
    ${renderIndicator(i18n.BP_001, bp001)}
    ${renderIndicator(i18n.BP_003, bp003 && renderTag(bp003))}
    ${renderIndicator(i18n.BP_004, bp004 && renderTag(bp004))}
    ${renderIndicator(i18n.BCHS_005, bchs005, percentIndicator) || ''}
    ${renderIndicator(i18n.BCHS_006, bchs006, percentIndicator) || ''}
    ${renderIndicator(i18n.BCHS_003, bchs003 && renderTag(bchs003))}
    ${renderIndicator(i18n.BCHS_004, bchs004 && renderTag(bchs004))}
  </div>
  `)
}

export default renderIndicators
