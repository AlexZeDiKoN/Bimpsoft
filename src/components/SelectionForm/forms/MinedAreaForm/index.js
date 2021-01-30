import { compose } from 'redux'
import React from 'react'
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
import { PATH_AMPLIFIERS } from '../../parts/WithAmplifiers'
import SelectionTacticalSymbol from '../../parts/SelectionTacticalSymbol'
import { PROPERTY_PATH as PATH } from '../../../../constants/propertyPath'
import SelectionTypes from '../../../../constants/SelectionTypes'

const PAIRS_AMPLIFIERS = [
  { id: 'middle', name: 'N', maxRows: 1 },
  { id: 'top', name: 'H1', maxRows: 1 },
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
    const elem = <div className="containers-svg-tooltip">
      {SVG_MINED_AREA}
    </div>
    const result = this.getResult()
    return (
      <div className="minedarea-container">
        <div className='scroll-container'>
          <SelectionTacticalSymbol
            code={result.getIn(PATH.CODE)}
            type={result.getIn(PATH.TYPE) ?? SelectionTypes.SOPHISTICATED}
            attributes={ result.getIn(PATH.ATTRIBUTES).toJS()}
            onChange={this.onChangeTacticalSymbol}
          />
          <div className="minedarea-container__item--firstSection">
            <div className="minedarea-container__itemWidth-right">
              {this.renderSubordinationLevel()} { /* Рівень підпорядкування */}
              {this.renderOrgStructureSelect()} { /* підрозділ */ }
              {this.renderAffiliation()} { /* принадлежність */ }
              {this.renderStatus()} { /* Стан */ }
            </div>
          </div>
          <div className="minedarea-container__item--secondSection">
            <div className="minedarea-container__itemWidth">
              <div className='containerTypeColor'>
                {this.renderSegment()}
                {this.renderColor()}
              </div>
              {this.renderLineType()}
            </div>
            {this.renderAmplifiers(PAIRS_AMPLIFIERS, PATH_AMPLIFIERS, false, elem)}
            {this.renderCoordinates()}
          </div>
        </div>
      </div>
    )
  }
}
