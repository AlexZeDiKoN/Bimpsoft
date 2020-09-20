import React from 'react'
import PropTypes from 'prop-types'
import { changeTypes } from '../../../store/actions/webMap'
import { components, data } from '@DZVIN/CommonComponents'
import i18n from '../../../i18n'

const { TextFilter } = data
const { common: { HighlightedText } } = components

const changeDescription = {
  [changeTypes.UPDATE_OBJECT]: i18n.UPDATE_OBJECT,
  [changeTypes.INSERT_OBJECT]: i18n.INSERT_OBJECT,
  [changeTypes.DELETE_OBJECT]: i18n.DELETE_OBJECT,
  [changeTypes.DELETE_LIST]: i18n.DELETE_LIST,
  'INSERT_LIST': i18n.INSERT_LIST,
}

const locales = window.navigator.language

const LogMapItem = (props) => {
  const { time, user, event, highlightObject, clickObject, doubleClickObject, id, search } = props
  const textFilter = TextFilter.create(search)
  const onMouseOver = () => highlightObject(id)
  const onMouseOut = () => highlightObject(null)
  const onClick = () => clickObject(id)
  const onDoubleClick = () => doubleClickObject(id)

  const d = new Date(time)
  const formatDate = d.toLocaleDateString(locales)
  const formatTime = d.toLocaleTimeString(locales)

  let description = changeDescription[event]
  if (Array.isArray(id)) {
    description += ` (${id.length})`
  }

  return !textFilter || textFilter.test(`${formatDate} ${formatTime} ${user} ${description}`)
    ? (
      <div
        className={'item-list-log'}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      >
        <div className={'time-user'}>
          <span className={'time'}>
            <HighlightedText text={`${formatDate} ${formatTime}`} textFilter={textFilter} />
          </span>
          <span className={'user'}>
            <HighlightedText text={user} textFilter={textFilter} />
          </span>
        </div>
        <div className={'event'}>
          <HighlightedText text={description} textFilter={textFilter} />
        </div>
      </div>
    )
    : null
}

LogMapItem.propTypes = {
  time: PropTypes.string.isRequired,
  event: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  search: PropTypes.string,
  highlightObject: PropTypes.func.isRequired,
  clickObject: PropTypes.func.isRequired,
  doubleClickObject: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
}

export default LogMapItem
