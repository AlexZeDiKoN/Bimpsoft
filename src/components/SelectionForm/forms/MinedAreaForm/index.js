import { compose } from 'redux'
import React from 'react'
import { Scrollbar } from '@DZVIN/CommonComponents'
import {
  UnitSelect, // Підрозділ
  WithSubordinationLevel, // Рівень підпорядкування
  WithAffiliation, // Приналежність
  WithStatus, // Стан
  WithSegment, // кривые или прямые отрезки
  WithLineType, // тип линии
  WithColor, // цвет линии
  WithStrokeWidth, // Товщина лінії
  WithAmplifiers, // Амплификатори
  WithCoordinates, // массив координат
} from '../../parts'

import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'
import './MinedAreaForm.css'

const PAIRS_AMPLIFIERS = [
  { id: 'middle', name: 'N' },
  { id: 'top', name: 'H1' },
]

const SVG_MINED_AREA = <svg viewBox="0 0 1024 840">
  <path d="M432 432h160v160h-160z m52 120v-80l56 80v-80
   M432 16h172v172h-172z m40 48v80 m0-40h40m0-40v80 m24 -4h48m-24 0v-76 l-20 20
   M32 552 v-80l32 40l32-40v80
   M880 552 v-80l32 40l32-40v80
   M480 288 v-80l32 40l32-40v80
   M480 816 v-80l32 40l32-40v80
   M70,560C60,680 200,780 460,780M560,780C840,720 890,690 910,560
   M900,460C840,240 600,240 560,240M460,240C380,240 160,280 80,450"
  fill="none" stroke="#000" strokeLinejoin="bevel" strokeWidth="16">
  </path>
</svg>

export default class MinedAreaForm extends compose(
  UnitSelect, // Підрозділ
  WithSubordinationLevel, // Рівень підпорядкування
  WithAffiliation, // Приналежність
  WithStatus, // Стан
  WithSegment, // кривые или прямые отрезки
  WithLineType, // тип линии
  WithColor, // цвет линии
  WithStrokeWidth, // Товщина лінії
  WithAmplifiers, // Амплификатори  T, N, W
  WithCoordinates,
)(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    return (
      <Scrollbar>
        <div className="minedarea-container">
          <div className="minedarea-container__item--firstSection">
            <div className="line-container__itemWidth-left">
              {SVG_MINED_AREA}
            </div>
            <div className="line-container__itemWidth-right">
              <div className="line-container__itemWidth">
                {this.renderSubordinationLevel()} { /* Рівень підпорядкування */}
                {this.renderOrgStructureSelect()} { /* підрозділ */ }
              </div>
              <div className="line-container__itemWidth">
                {this.renderAffiliation()} { /* принадлежність */ }
                {this.renderStatus()} { /* Стан */ }
              </div>
            </div>
          </div>
          <div className="minedarea-container__item--secondSection">
            <div className="line-container__item">
              {this.renderSegment()}
              {this.renderLineType()}
              {this.renderColor()}
            </div>
            {this.renderAmplifiers(PAIRS_AMPLIFIERS)}
            {this.renderCoordinates()}
          </div>
        </div>
      </Scrollbar>
    )
  }
}
