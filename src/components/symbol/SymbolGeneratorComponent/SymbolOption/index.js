import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { TreeComponent, TextFilter } from '../../../common'
import Item from './Item'

export default class SymbolOption extends React.PureComponent {
  state = {
    filterValue: null,
    opened: false,
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

  onChangeItem = (codePart) => {
    this.props.onChange(codePart)
    this.close()
  }

  onPreviewStart = (codePart) => {
    this.props.onPreviewStart(codePart)
  }

  onPreviewEnd = () => {
    this.props.onPreviewEnd && this.props.onPreviewEnd()
  }

  scrollRef = React.createRef()

  handleChangeTitle = (event) => {
    this.setState({ filterValue: event.target.value })
  }

  getFilteredIds = TextFilter.getFilteredIdsFunc('title', 'codePart', 'parentId')

  render () {
    const { values = {}, codePart } = this.props
    const { byIds = {}, roots = [], codeByPart = {} } = values
    const { opened, filterValue } = this.state
    let title
    const expandedKeys = []
    if (byIds.hasOwnProperty(codePart)) {
      let value = byIds[codePart]
      title = [ value.title ]

      while (value.parentId) {
        value = byIds[value.parentId]
        expandedKeys.push(value.codePart)
        title.unshift(value.title)
      }
      title = title.join('/')
    } else {
      title = '---------'
    }
    const textFilter = TextFilter.create(filterValue)
    const filteredIds = this.getFilteredIds(textFilter, byIds)
    const list = roots.length && opened ? (
      <div className="symbol-option-values-placeholder">
        <div
          ref={this.itemsRef}
          className="symbol-option-values"
          onMouseDown={(e) => e.preventDefault()}
        >
          <TreeComponent
            expandedKeys={expandedKeys}
            filteredIds={filteredIds}
            byIds={byIds}
            roots={roots}
            commonData={{
              codeByPart,
              codePart,
              onChange: this.onChangeItem,
              onPreviewStart: this.onPreviewStart,
              onPreviewEnd: this.onPreviewEnd,
              scrollRef: this.scrollRef,
              textFilter,
            }}
            itemTemplate={Item}
          />
        </div>
      </div>
    ) : null

    return (
      <div className="symbol-option" >
        <label>{this.props.label}</label>
        <div className="symbol-option-right">
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

SymbolOption.propTypes = {
  label: PropTypes.string,
  values: PropTypes.object,
  codePart: PropTypes.string,
  onChange: PropTypes.func,
  onPreviewStart: PropTypes.func,
  onPreviewEnd: PropTypes.func,
}
