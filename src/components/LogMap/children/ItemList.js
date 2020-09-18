import React from 'react'
import PropTypes from 'prop-types'
import { changeTypes } from '../../../store/actions/webMap'
import i18n from '../../../i18n'

const changeDescription = {
  [changeTypes.UPDATE_OBJECT]: i18n.UPDATE_OBJECT,
  [changeTypes.INSERT_OBJECT]: i18n.INSERT_OBJECT,
  [changeTypes.DELETE_OBJECT]: i18n.DELETE_OBJECT,
  [changeTypes.DELETE_LIST]: i18n.DELETE_LIST,
}

const locales = window.navigator.language

const ItemList = (props) => {
  const { time, user, event, highlightObject, clickObject, doubleClickObject, id } = props
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

  return (
    <div
      className={'item-list-log'}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <div className={'time-user'}>
        <span className={'time'}>
          {formatDate} {formatTime}
        </span>
        <span className={'user'}>
          {user}
        </span>
      </div>
      <div className={'event'}>
        {description}
      </div>
    </div>
  )
}

ItemList.propTypes = {
  time: PropTypes.string.isRequired,
  event: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  highlightObject: PropTypes.func.isRequired,
  clickObject: PropTypes.func.isRequired,
  doubleClickObject: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
}

export default ItemList
