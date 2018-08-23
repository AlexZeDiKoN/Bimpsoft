import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { Input, Tooltip } from 'antd'
import { data, components, utils } from '@DZVIN/CommonComponents'
import i18n from '../../i18n'
import Item from './Item'

const { TextFilter } = data
const { common: { TreeComponent } } = components

const { getPathFunc } = utils.collection

const getPath = getPathFunc((item) => item.id, (item) => item.id, (item) => item.parentUnitID)
const getFilteredIds = TextFilter.getFilteredIdsFunc(
  (item) => item.shortName + ' ' + item.fullName,
  (item) => item.id,
  (item) => item.parentUnitID
)

function scrollParentToChild (parent, child) {
  const parentRect = parent.getBoundingClientRect()
  const childRect = child.getBoundingClientRect()

  const isViewable = (childRect.top >= parentRect.top) && (childRect.top <= parentRect.top + parent.clientHeight)

  if (!isViewable) {
    parent.scrollTop = (childRect.top + parent.scrollTop) - parentRect.top
  }
}

export default class OrgStructuresComponent extends React.Component {
  state = {
    filterText: '',
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (prevProps.selectedOrgStructureId !== this.props.selectedOrgStructureId) {
      const scrollRef = this.scrollRef && this.scrollRef.current
      scrollRef && scrollParentToChild(this.scrollPanelRef.current, scrollRef)
    }
  }

  scrollRef = React.createRef()

  scrollPanelRef = React.createRef()

  inputRef = React.createRef()

  mouseUpHandler = (e) => {
    e.preventDefault()
    this.inputRef.current.focus()
  }

  filterTextChangeHandler = ({ target: { value } }) => {
    this.setState({ filterText: value.trim() })
  }

  render () {
    const { filterText } = this.state
    const {
      orgStructures = {},
      onDoubleClick,
      onClick,
      wrapper: Wrapper = Fragment,
      selectedOrgStructureId = null,
    } = this.props
    const { byIds, roots, formation = null } = orgStructures
    if (formation === null) {
      return null
    }

    const textFilter = TextFilter.create(filterText)
    const filteredIds = getFilteredIds(textFilter, byIds)
    const expandedKeys = textFilter
      ? Object.keys(filteredIds)
      : selectedOrgStructureId !== null
        ? getPath(byIds, selectedOrgStructureId).slice(0, -1)
        : null

    return (
      <Wrapper title={(<Tooltip title={formation.fullName}>{formation.shortName}</Tooltip>)}>
        <div className="org-structures">
          <Input.Search
            ref={this.inputRef}
            placeholder={ i18n.FILTER }
            onChange={this.filterTextChangeHandler}
          />
          <div className="org-structures-scroll" ref={this.scrollPanelRef} >
            <TreeComponent
              expandedKeys={expandedKeys}
              filteredIds={filteredIds}
              byIds={byIds}
              roots={roots}
              itemTemplate={Item}
              commonData={{
                textFilter,
                onClick,
                onDoubleClick,
                selectedOrgStructureId,
                scrollRef: this.scrollRef,
              }}
              onMouseUp={this.mouseUpHandler}
            />
          </div>
        </div>
      </Wrapper>
    )
  }
}

OrgStructuresComponent.propTypes = {
  wrapper: PropTypes.any,
  orgStructures: PropTypes.shape({
    roots: PropTypes.array.isRequired,
    byIds: PropTypes.object.isRequired,
    formation: PropTypes.object,
  }),
  selectedOrgStructureId: PropTypes.number,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
}
