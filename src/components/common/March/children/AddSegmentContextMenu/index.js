import React, { useRef } from 'react'
import { components } from '@C4/CommonComponents'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import useOutsideClick from '../useOutsideClick'

const { ContextMenu } = components.common

const mapStateToProps = ({ march: { indicators } }) => ({
  MB001: (indicators && indicators['МШВ001']) || {},
})

const typeSegmentToName = (type, typeValues) => typeValues.find(({ id }) => id === type)?.name || ''

const AddSegmentContextMenu = (props) => {
  const { changeViewContextMenu, addSegment, typeSegments, segmentId, MB001 } = props
  const ref = useRef()

  useOutsideClick(ref, () => {
    changeViewContextMenu(false)
  })

  const onSelectType = (typeSegment) => {
    addSegment(segmentId, typeSegment)
    changeViewContextMenu(false)
  }

  return (
    <div ref={ref}>
      <ContextMenu>
        {typeSegments.map((typeSegment) =>
          <ContextMenu.Item
            text={typeSegmentToName(typeSegment, MB001.typeValues)}
            onClick={() => onSelectType(typeSegment)}
            key={typeSegment}
          />,
        )}
      </ContextMenu>
    </div>
  )
}

AddSegmentContextMenu.propTypes = {
  MB001: PropTypes.shape({
    typeValues: PropTypes.array.isRequired,
  }),
  typeSegments: PropTypes.array.isRequired,
  changeViewContextMenu: PropTypes.func.isRequired,
  segmentId: PropTypes.number.isRequired,
  addSegment: PropTypes.func.isRequired,
}

export default connect(mapStateToProps)(AddSegmentContextMenu)
