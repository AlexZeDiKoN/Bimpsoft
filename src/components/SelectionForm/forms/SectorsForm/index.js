import { compose } from 'redux'
import React from 'react'
import { Scrollbar } from '@DZVIN/CommonComponents'
import AbstractShapeForm, {
  propTypes as abstractShapeFormPropTypes,
} from '../../parts/AbstractShapeForm'
import {
  WithCoordinateAndAzimuth,
  WithSubordinationLevel,
  UnitSelect,
  WithAffiliation,
  WithSectorsArray,
} from '../../parts'

import './SectorsForm.css'
import spriteUrl from '../../../Symbols/sprite.svg'

export default class SectorsForm extends compose(
  UnitSelect,
  WithSubordinationLevel,
  WithAffiliation,
  WithCoordinateAndAzimuth,
  WithSectorsArray,
)(AbstractShapeForm) {
  static propTypes = abstractShapeFormPropTypes

  renderContent () {
    const name = this.props.data.code // 10032500000017076000, 10032500001405000000,
    return (
      <div className="sectors-container">
        <div className="sectors-container__item--firstSection">
          <div className="sectors-container__itemWidth-left">
            <svg>
              <use xlinkHref={`${spriteUrl}#${name}`}/>
            </svg>
          </div>
          <div className="sectors-container__itemWidth-right">
            {this.renderSubordinationLevel()}
            {this.renderOrgStructureSelect()}
            {this.renderAffiliation()}
            {this.renderCoordinateAndAzimuth()}
          </div>
        </div>
        <div className="sectors-container__item--secondSection">
          <Scrollbar>
            {this.renderSectorsArray()}
          </Scrollbar>
        </div>
      </div>
    )
  }
}
