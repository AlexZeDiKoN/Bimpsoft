import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { components } from '@DZVIN/CommonComponents'
import IconButton from '../IconButton'
import './style.css'
import i18n from '../../../i18n'
import SelectionTypes from '../../../constants/SelectionTypes'
import LinesList from '../../LinesList'

const iconNames = components.icons.names

export default class LeftMenu extends React.Component {
  static propTypes = {
    isEditMode: PropTypes.bool,
    isShowPoints: PropTypes.bool,
    newShape: PropTypes.object,
    isShowSources: PropTypes.bool,
    mapSources: PropTypes.element,
    onClickEditMode: PropTypes.func,
    onClickPointSign: PropTypes.func,
    onClickMapSource: PropTypes.func,
    onNewShapeChange: PropTypes.func,
    tempClickOnMap: PropTypes.func,
    tempFinishClickOnMap: PropTypes.func,
  }

  state = {
    showLines: false,
  }

  clickPointSignHandler = () => {
    const { newShape = {} } = this.props
    this.setState({ showLines: false, showMapSources: false })
    this.props.onNewShapeChange(newShape.type === SelectionTypes.POINT ? {} : { type: SelectionTypes.POINT })
  }

  clickLineSignHandler = () => {
    this.setState({ showLines: !this.state.showLines })
  }

  selectLineHandler = (type) => {
    this.setState({ showLines: false })
    this.props.onNewShapeChange({ type })
  }

  clickTextHandler = () => {
    this.setState({ showLines: false })
    this.props.onNewShapeChange({ type: SelectionTypes.TEXT })
  }

  render () {
    const {
      isEditMode,
      isShowPoints,
      newShape = {},
      onClickEditMode,
      onClickPointSign,
      onClickMapSource,
      mapSources,
      isShowSources,
    } = this.props
    const { showLines } = this.state
    return (
      <div className='left-menu'>
        <IconButton
          text={i18n.EDIT_MODE}
          icon={isEditMode ? iconNames.EDIT_ACTIVE : iconNames.EDIT_DEFAULT}
          hoverIcon={iconNames.EDIT_HOVER}
          onClick={onClickEditMode}
        />
        {isEditMode && (
          <Fragment>
            <IconButton
              text={i18n.POINT_SIGN}
              icon={
                isShowPoints
                  ? iconNames.CONVENTIONAL_SIGN_ACTIVE
                  : iconNames.CONVENTIONAL_SIGN_DEFAULT
              }
              hoverIcon={iconNames.CONVENTIONAL_SIGN_HOVER}
              onClick={onClickPointSign}
            />
            <IconButton
              text={i18n.LINE_SIGN}
              icon={
                showLines
                  ? iconNames.GROUPING_GRAPHIC_PRIMITIVES_ACTIVE
                  : iconNames.GROUPING_GRAPHIC_PRIMITIVES_DEFAULT
              }
              hoverIcon={iconNames.GROUPING_GRAPHIC_PRIMITIVES_HOVER}
              onClick={this.clickLineSignHandler}
            >
              {showLines && (<LinesList
                onSelect={this.selectLineHandler}
                shapeType={ newShape.type }
              />)}
            </IconButton>
            <IconButton
              text={i18n.ADD_TEXT}
              icon={
                newShape.type === SelectionTypes.TEXT
                  ? iconNames.TEXT_SIGN_ACTIVE
                  : iconNames.TEXT_SIGN_DEFAULT
              }
              hoverIcon={iconNames.TEXT_SIGN_HOVER}
              onClick={this.clickTextHandler}
            />
            <IconButton
              text={i18n.MAP_SOURCE}
              icon={isShowSources ? iconNames.MAP_ACTIVE : iconNames.MAP_DEFAULT}
              hoverIcon={iconNames.MAP_HOVER}
              onClick={onClickMapSource}
            >
              {mapSources}
            </IconButton>
          </Fragment>
        )}
        <button
          onClick={this.props.tempClickOnMap}
          title={`Користувач вказує на карті початкову точку лінії за допомогою лівої кнопки миші.
          Користувач вказує на карті наступні вузлові точки лінії за допомогою лівої кнопки миші`}
        >Click</button>
        <button
          onClick={this.props.tempFinishClickOnMap}
          title="Користувач натискає ліву кнопку миші на останній встановленій вузловій точці"
        >Finish Click</button>
      </div>
    )
  }
}
