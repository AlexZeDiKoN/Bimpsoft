import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import TreeComponent from '../TreeComponent'
import TextFilter from '../TextFilter'
import { getPathFunc } from '../../../utils/collection'

export default class FilterTreeSelect extends React.PureComponent {
  constructor (props) {
    super(props)
    const {
      idSelector,
      titleSelector,
      parentIdSelector,
    } = this.props

    this.getFilteredIds = TextFilter.getFilteredIdsFunc(titleSelector, idSelector, parentIdSelector)
    this.getExpandedKeys = getPathFunc(idSelector, idSelector, parentIdSelector)
    this.getTitlesPath = getPathFunc(titleSelector, idSelector, parentIdSelector)

    this.state = {
      filterValue: null,
      opened: false,
    }
    this.scrollRef = React.createRef()
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (!prevState.opened && this.state.opened) {
      const scrollRef = this.scrollRef && this.scrollRef.current
      scrollRef && scrollRef.scrollIntoView()
    }
  }

  open () {
    this.setState({ opened: true })
    this.input.select()
  }

  close () {
    this.setState({ opened: false, filterValue: null })
    this.onPreviewEnd()
    this.input.blur()
  }

  onChangeItem = (id) => {
    this.props.onChange(id)
    this.close()
  }

  onPreviewStart = (id) => {
    this.props.onPreviewStart(id)
  }

  onPreviewEnd = () => {
    this.props.onPreviewEnd && this.props.onPreviewEnd()
  }

  handleChangeTitle = (event) => {
    this.setState({ filterValue: event.target.value })
  }

  mouseDownHandler = (e) => e.preventDefault()

  render () {
    const {
      label,
      byIds = {},
      roots = [],
      id,
      itemTemplate,
      commonData,
    } = this.props
    const { opened, filterValue } = this.state
    const expandedKeys = [ ...(this.props.expandedKeys || []), ...this.getExpandedKeys(byIds, id) ]
    const path = this.getTitlesPath(byIds, id)
    const title = (path.length > 0) ? path.join('/') : '---------'
    const textFilter = TextFilter.create(filterValue)
    const filteredIds = this.getFilteredIds(textFilter, byIds)
    const list = roots.length && opened ? (
      <div className="filter-tree-select-values-container">
        <div
          ref={this.itemsRef}
          className="filter-tree-select-values"
          onMouseDown={this.mouseDownHandler}
        >
          <TreeComponent
            expandedKeys={expandedKeys}
            filteredIds={filteredIds}
            byIds={byIds}
            roots={roots}
            onChange={this.onChangeItem}
            onPreviewStart={this.onPreviewStart}
            onPreviewEnd={this.onPreviewEnd}
            itemTemplate={itemTemplate}
            commonData={{
              filterTreeSelect: {
                onChange: this.onChangeItem,
                id,
                textFilter,
                scrollRef: this.scrollRef,
              },
              ...commonData,
            }}
          />
        </div>
      </div>
    ) : null

    return (
      <div className="filter-tree-select" >
        <label>{this.props.label}</label>
        <div className="filter-tree-select-right">
          <input
            ref={(el) => {
              this.input = el
            }}
            value={filterValue !== null ? filterValue : title}
            onChange={this.handleChangeTitle}
            onBlur={ () => this.close() }
            onFocus={() => this.open()}
          />
          {list}
        </div>
      </div>
    )
  }
}

FilterTreeSelect.propTypes = {
  label: PropTypes.string,
  byIds: PropTypes.object,
  roots: PropTypes.array,
  expandedKeys: PropTypes.array,
  id: PropTypes.string,
  onChange: PropTypes.func,
  onPreviewStart: PropTypes.func,
  onPreviewEnd: PropTypes.func,
  itemTemplate: PropTypes.any,
  idSelector: PropTypes.func,
  titleSelector: PropTypes.func,
  parentIdSelector: PropTypes.func,
  commonData: PropTypes.object,
}

FilterTreeSelect.itemPropTypes = {
  ...TreeComponent.itemPropTypes,
  filterTreeSelect: PropTypes.shape({
    onChange: PropTypes.func,
    id: PropTypes.string,
    scrollRef: PropTypes.any,
    textFilter: PropTypes.instanceOf(TextFilter),
  }),
}
