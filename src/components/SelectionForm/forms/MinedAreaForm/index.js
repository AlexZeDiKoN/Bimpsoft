import { compose } from 'redux'
import React from 'react'
import { Scrollbar } from '@DZVIN/CommonComponents'
import {
  WithColor, // цвет линии
  WithSegment, // кривые или прямые отрезки
  WithLineType, // тип линии
  WithPointAmplifiers, // Амплификатори  T, N, W
  // WithIntermediateAmplifiers, // Амплификатори  H1, B, H2
  WithCoordinates, // массив координат
  WithSubordinationLevel, // Рівень підпорядкування
  WithStrokeWidth, // Товщина лінії
  UnitSelect, // Підрозділ
  WithLineClassifier, // Класифікація НАТО
  WithAffiliation, // Приналежність
} from '../../parts'

import AbstractShapeForm, { propTypes as abstractShapeFormPropTypes } from '../../parts/AbstractShapeForm'
import './MinedAreaForm.css'
import WithStatus from '../../parts/WithStatus'
import spriteUrl from '../../../Symbols/sprite.svg'

export default class MinedAreaForm extends compose(
  WithColor,
  WithSegment,
  WithLineType,
  WithPointAmplifiers,
  WithCoordinates,
  WithSubordinationLevel,
  WithStrokeWidth,
  UnitSelect,
  WithLineClassifier,
  WithAffiliation,
  WithStatus,
)(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    const name = this.props.data.code // '10032500002708000000'
    return (
      <Scrollbar>
        <div className="minedarea-container">
          <div className="minedarea-container__item--firstSection">
            <div className="minedarea-container__itemWidth-left">
              <svg key={name}>
                <use xlinkHref={`${spriteUrl}#${name}`}/>
              </svg>
            </div>
            <div className="minedarea-container__itemWidth-right">
              <div className='minedarea-container__itemWidth--section1'>
                <div className="minedarea-container__itemWidth">
                  {this.renderOrgStructureSelect()} { /* підрозділ */ }
                  {this.renderSubordinationLevel()} { /* Рівень підпорядкування */}
                  {this.renderStatus()} { /* необхыдно тип Мін */ }
                </div>
                <div className="minedarea-container__itemWidth">
                  {this.renderAffiliation()} { /* принадлежність */ }
                  {this.renderStatus()} { /* Стан */ }
                </div>
              </div>
            </div>
          </div>
          <div className="minedarea-container__item--secondSection">
            <div className="minedarea-container__itemWidth">
              <div className='containerTypeColor'>
                {this.renderSegment()}
                {this.renderLineType()}
                {this.renderColor()}
              </div>
              {this.renderStrokeWidth()}
            </div>
          </div>
          {this.renderCoordinates()}
        </div>
      </Scrollbar>
    )
  }
}
