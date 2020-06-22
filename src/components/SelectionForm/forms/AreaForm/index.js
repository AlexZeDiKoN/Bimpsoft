import React from 'react'
import { compose } from 'redux'
import {
  UnitSelect, // Підрозділ
  WithSubordinationLevel, // Рівень підпорядкування
  WithAffiliation, // Приналежність
  WithStatus, // Стан
  WithColor,
  WithFill,
  WithSegment,
  WithLineType,
  WithHatch,
  WithNodalPointType,
  WithCoordinatesArray,
  WithIntermediateAmplifiers,
  WithPointAmplifiers,
  WithStrokeWidth,
} from '../../parts'
import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'
import './areaForm.css'
import SelectionTypes from '../../../../constants/SelectionTypes'

const Extenders = compose(
  UnitSelect, // Підрозділ
  WithSubordinationLevel, // Рівень підпорядкування
  WithAffiliation, // Приналежність
  WithStatus, // Стан
  WithCoordinatesArray,
  WithLineType,
  WithNodalPointType,
  WithSegment,
  WithFill,
  WithHatch,
  WithColor,
  WithStrokeWidth,
  WithIntermediateAmplifiers,
  WithPointAmplifiers,
)

const SVG_AREA = <svg xmlns="http://www.w3.org/2000/svg" version="1.2" viewBox="0 0 800 560">
  <path fill="none" stroke="#000" strokeLinejoin="bevel" strokeWidth="8"
    d="M120,328C120,400 240,480 360,480C440,480 670,580 656,328
   M648,228C620,60 420,40 380,40C280,40 140,40 120,228"
  />
  <path fill="none" stroke="#000" strokeLinejoin="bevel" strokeWidth="2"
    d="M352 160h80v80h-80zM352 240h80v80h-80zM352 320h80v80h-80zM16 240h80v80h-80zM96 240h80v80h-80z
       M176 240h80v80h-80zM528 240h80v80h-80zM608 240h80v80h-80zM688 240h80v80h-80z"
  />
  <g textAnchor="middle" fontSize="52" fontFamily="Arial" fontWeight="bold" strokeWidth="0" fill="black">
    <text alignmentBaseline="central" x="136" y="280">B</text>
    <text alignmentBaseline="central" x="56" y="280">H1</text>
    <text alignmentBaseline="central" x="216" y="280">H2</text>
    <text alignmentBaseline="central" x="648" y="280">B</text>
    <text alignmentBaseline="central" x="568" y="280">H2</text>
    <text alignmentBaseline="central" x="728" y="280">H1</text>
    <text alignmentBaseline="central" x="392" y="200">T</text>
    <text alignmentBaseline="central" x="392" y="280">N</text>
    <text alignmentBaseline="central" x="392" y="360">W</text>
  </g>
</svg>

const SVG_POLYGON = <svg xmlns="http://www.w3.org/2000/svg" version="1.2" viewBox="0 0 800 560">
  <path fill="none" stroke="#000" strokeLinejoin="bevel" strokeWidth="8"
    d="M120,328 L120,400 L340,540 L540 540 L616 448
   M120,228L120 16L400 20L500 80
   M696 348 L780 256L640 176"

  />
  <path fill="none" stroke="#000" strokeLinejoin="bevel" strokeWidth="2"
    d="M352 160h80v80h-80zM352 240h80v80h-80zM352 320h80v80h-80zM16 240h80v80h-80zM96 240h80v80h-80zM176 240h80v80h-80z
      M480 88h80v80h-80zM560 88h80v80h-80zM640 88h80v80h-80z
      M528 360h80v80h-80zM608 360h80v80h-80zM688 360h80v80h-80z"
  />
  <g textAnchor="middle" fontSize="52" fontFamily="Arial" fontWeight="bold" strokeWidth="0" fill="black">
    <text alignmentBaseline="central" x="136" y="280">B</text>
    <text alignmentBaseline="central" x="56" y="280">H1</text>
    <text alignmentBaseline="central" x="216" y="280">H2</text>
    <text alignmentBaseline="central" x="648" y="400">B</text>
    <text alignmentBaseline="central" x="568" y="400">H2</text>
    <text alignmentBaseline="central" x="728" y="400">H1</text>
    <text alignmentBaseline="central" x="600" y="128">B</text>
    <text alignmentBaseline="central" x="520" y="128">H2</text>
    <text alignmentBaseline="central" x="680" y="128">H1</text>
    <text alignmentBaseline="central" x="392" y="200">T</text>
    <text alignmentBaseline="central" x="392" y="280">N</text>
    <text alignmentBaseline="central" x="392" y="360">W</text>
  </g>
</svg>

const TYPE_PATH = [ 'type' ]

export default class AreaForm extends Extenders(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    const type = this.getResult().getIn(TYPE_PATH) ?? SelectionTypes.AREA
    const elem = <div className="containers-svg-tooltip">
      {type === SelectionTypes.AREA ? SVG_AREA : SVG_POLYGON }
    </div>
    return (
      <div className="area-container">
        <div className='scroll-container'>
          <div className="area-container__item--firstSection">
            <div className="area-container__itemWidth-right">
              {this.renderSubordinationLevel()} { /* Рівень підпорядкування */}
              {this.renderOrgStructureSelect()} { /* підрозділ */ }
              {this.renderAffiliation()} { /* принадлежність */ }
              {this.renderStatus()} { /* Стан */ }
            </div>
          </div>
          <div className="area-container__item--secondSection">
            <div className="area-container__itemWidth">
              <div className='containerTypeColor'>
                {this.renderSegment()}
                {this.renderColor()}
              </div>
              {this.renderLineType()}
              <div className='containerSegmentLine'>
                {this.renderStrokeWidth()}
                {this.renderNodalPointType()}
              </div>
              {this.renderFill(true)}
              {this.renderHatch()}
            </div>
          </div>
          {this.renderIntermediateAmplifiers(elem)}
          {this.renderPointAmplifiers(elem)}
          {this.renderCoordinatesArray(true)}
        </div>
      </div>
    )
  }
}
