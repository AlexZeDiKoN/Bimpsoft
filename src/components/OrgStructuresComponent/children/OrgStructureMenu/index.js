import React from 'react'
import './style.css'
import { Menu, Dropdown } from 'antd'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import i18n from '../../../../i18n'

const {
  icons: { names: iconNames, IconButton },
} = components

export default class Index extends React.Component {
  static propTypes = {
    onMapObjects: PropTypes.object,
    onLayersById: PropTypes.object,
    selectList: PropTypes.func,
  }

  selectUnboundObjects = () => {
    const { onMapObjects, onLayersById, selectList } = this.props
    const unboundObjects = onMapObjects.toArray()
      .filter((item) => !item.unit)
      .filter((item) => item.layer && Object.prototype.hasOwnProperty.call(onLayersById, item.layer))
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
          placement={'topRight'}
          className={'settingsButton'}
          title={i18n.EXTRA_FUNCTIONS}
          icon={iconNames.TABLE_SETING_DEFAULT}
        />
      </Dropdown>
    )
  }
}
