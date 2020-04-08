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
import spriteUrl from '../../../Symbols/sprite.svg'

const PAIRS_AMPLIFIERS = [
  { id: 'middle', name: 'N' },
  { id: 'top', name: 'H1' },
]

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
    const name = this.props.data.code // '10032500002708000000'
    return (
      <Scrollbar>
        <div className="minedarea-container">
          <div className="minedarea-container__item--firstSection">
            <div className="line-container__itemWidth-left">
              <svg key={name}>
                <use xlinkHref={`${spriteUrl}#${name}`}/>
              </svg>
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
