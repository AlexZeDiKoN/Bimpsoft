import React from 'react'
import './style.css'
import { Menu, Dropdown } from 'antd'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../../i18n'
import entityKind from '../../../../constants/SelectionTypes'

const {
  icons: { names: iconNames, IconButton },
} = components

export default class Index extends React.Component {
  propTypes = {
    onMapObjects: PropTypes.object,
    selectList: PropTypes.func,
  }

  selectUnboundObjects = () => {
    const { onMapObjects, selectList } = this.props
    const unboundObjects = onMapObjects.toArray()
      .filter((item) => item.type === entityKind.POINT && !item.unit)
      .map((item) => item.id)
    selectList(unboundObjects)
  }

  render () {
    const menu = (
      <Menu>
        <Menu.Item
          key={i18n.SHOW_UNBOUND_OBJECTS}
          onClick={this.selectUnboundObjects}
        >
          {i18n.SHOW_UNBOUND_OBJECTS}
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown
        overlay={menu}
        trigger={[ 'click' ]}
      >
        <IconButton
          className={'moreButton'}
          title={i18n.EXTRA_FUNCTIONS}
          icon={iconNames.MORE_WHITE_DEFAULT}
        />
      </Dropdown>
    )
  }
}