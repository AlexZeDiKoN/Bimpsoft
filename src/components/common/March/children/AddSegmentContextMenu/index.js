import React, { useState, useRef } from 'react'
import { components } from '@DZVIN/CommonComponents'
import useOutsideClick from '../useOutsideClick'
const { ContextMenu } = components.common

const AddSegmentContextMenu = (props) => {
  const { changeViewContextMenu, addSegment } = props
  const ref = useRef()

  useOutsideClick(ref, () => {
    changeViewContextMenu(false)
  })

  return (
    <div ref={ref}><ContextMenu>
      <ContextMenu.Item
        text="item 1"
        onClick={() => changeViewContextMenu(false)}
      />
      <ContextMenu.Item
        text="item 2"
      />
      <ContextMenu.Item
        icon="clip-default"
        hoverIcon="clip-hover"
        text="item 3"
      />
    </ContextMenu></div>
  )
}

export default AddSegmentContextMenu
