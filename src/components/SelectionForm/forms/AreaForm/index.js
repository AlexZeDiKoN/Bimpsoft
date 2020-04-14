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

const SVG_AREA = <svg viewBox="0 0 1024 600">
  <path fill="none" stroke="#000" strokeLinejoin="bevel" strokeWidth="8"
    d="M432 72h160v160h-160zm48 48h64m-32 0v72
   M432 232h160v160h-160zm52 48v72m0-36h56v36v-72
   M432 392h160v160h-160zm40 48l20 72l20-72l20 72l20-72
   M16 232h160v160h-160zm52 44v72h32a20 20 0 0 0 0-40h-32h28a16 16 0 0 0 0-32z
   M840 232h160v160h-160zm52 44v72h32a20 20 0 0 0 0-40h-32h28a16 16 0 0 0 0-32z
   M96,400C96,480 240,580 520,580M520,580C840,580 920,480 920,400
   M920,228C900,80 600,40 520,40M520,40C380,40 160,80 88,228"/>
</svg>

export default class AreaForm extends Extenders(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    return (
      <div className="area-container">
        <div className="area-container--firstSection">
          <div className="area-container__itemWidth-left">
            {SVG_AREA}
          </div>
          <div className="area-container__itemWidth-right">
            <div className="area-container__itemWidth">
              {this.renderSubordinationLevel()} { /* Рівень підпорядкування */}
              {this.renderOrgStructureSelect()} { /* підрозділ */ }
            </div>
            <div className="area-container__itemWidth">
              {this.renderAffiliation()} { /* принадлежність */ }
              {this.renderStatus()} { /* Стан */ }
            </div>
          </div>
        </div>
        <div className="area-container__item">
          {this.renderSegment()}
          {this.renderLineType()}
          {this.renderColor()}
        </div>
        <div className="area-container__item">
          {this.renderStrokeWidth()}
          {this.renderNodalPointType()}
          {this.renderFill()}
          {this.renderHatch()}
        </div>
        <div className="dzvin-form-divider">
        </div>
        {this.renderIntermediateAmplifiers()}
        {this.renderPointAmplifiers()}
        {this.renderCoordinatesArray()}
      </div>
    )
  }
}
