import { compose } from 'redux'
import React from 'react'
import { Scrollbar } from '@DZVIN/CommonComponents'
import AbstractShapeForm, {
  propTypes as abstractShapeFormPropTypes,
} from '../../parts/AbstractShapeForm'
import {
  WithColor,
  WithSubordinationLevel,
  WithStrokeWidth,
  UnitSelect,
  WithAffiliation,
  WithStartingCoordinate,
  WithRadiiAndAmplifiers,
} from '../../parts'

import './CircularZoneForm.css'
import spriteUrl from '../../../Symbols/sprite.svg'

export default class CircularZoneForm extends compose(
  UnitSelect,
  WithSubordinationLevel,
  WithAffiliation,
  WithColor,
  WithStrokeWidth,
  WithStartingCoordinate,
  WithRadiiAndAmplifiers,
)(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    const name = this.props.data.code
    return (
      <Scrollbar>
        <div className="circularzone-container">
          <div className="circularzone-container__item--firstSection">
            <div>
              <svg key={name}>
                <use xlinkHref={`${spriteUrl}#${name}`}/>
              </svg>
            </div>
            <div className="circularzone-container__itemWidth-right">
              {this.renderSubordinationLevel()}
              {this.renderOrgStructureSelect()}
              {this.renderAffiliation()}
              {this.renderStartingCoordinate()}
            </div>
          </div>
          <div className="circularzone-container__item--secondSection">
            {this.renderRadiiAndAmplifiers()}
          </div>
        </div>
      </Scrollbar>
    )
  }
}
