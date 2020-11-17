import React from 'react'
import { Menu, Dropdown, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import { IButton, IconNames, ButtonTypes, ColorTypes } from '@C4/CommonComponents'
import i18n from '../../../../i18n'
import { MOUSE_ENTER_DELAY } from '../../../../constants/tooltip'

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
        <Tooltip title={i18n.EXTRA_FUNCTIONS} mouseEnterDelay={MOUSE_ENTER_DELAY}>
          <IButton
            colorType={ColorTypes.WHITE}
            type={ButtonTypes.WITH_BG}
            icon={IconNames.TABLE_SETING}
          />
        </Tooltip>
      </Dropdown>
    )
  }
}
