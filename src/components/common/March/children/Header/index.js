import { Switch, Tooltip } from 'antd'
import React, { useState } from 'react'

const Header = () => {
  const [ kindTimeDist, changeKindTimeDist ] = useState(false)

  return <>
    <div className={'march-title-top'}>
      <div className={'march-title'}>
        Маршрут переміщення
      </div>
      <div className={'march-save-button'}/>
    </div>
    <div className={'march-title-bottom'}>
      <Tooltip
        placement='left'
        title={kindTimeDist ? 'Час та відстань: від попереднього пункту' : 'Час та відстань: від пункту відправлення'}>
        <Switch
          checkedChildren='П'
          unCheckedChildren='В'
          size='small'
          checked={kindTimeDist}
          onChange={changeKindTimeDist}
        />
      </Tooltip>
      <span className={'march-title-value'}>Довжина маршруту: {10} км</span>
      <span className={'march-title-value'}>час: {5}</span>
    </div>
  </>
}

export default Header
