import React, { useState } from 'react'
import { IButton, ButtonTypes, useConstant, ExpandIcon } from '@C4/CommonComponents'
import { MilSymbol } from '@C4/MilSymbolEditor'
import PropTypes from 'prop-types'
import i18n from '../../../../i18n'
import entityKind from '../../../WebMap/entityKind'

const JS_PARSER = (item) => item?.toJS ? item.toJS() : item

const titleSign = (name) => name ? `${i18n.SIGN} ${name}` : i18n.SIGN

export const CollapsibleSign = ({
  code,
  amplifiers,
  type,
  coordinates,
  children,
  title,
}) => {
  const [ show, setShow ] = useState(false)
  const onClick = () => setShow((show) => !show)
  return (
    <div className="catalog_mil_symbol_collapsible" data-entity-kind={type} >
      <IButton
        type={ButtonTypes.SECTION}
        fitToParent
        onClick={onClick}
        icon={useConstant(() => <ExpandIcon.Vertical expanded={show} />) }
      >{titleSign(title)}</IButton>
      {show
        ? children
        : type === entityKind.POINT
          ? <MilSymbol code={code} amplifiers={JS_PARSER(amplifiers)} coordinates={coordinates} />
          : <></>
      }
    </div>
  )
}

CollapsibleSign.propTypes = {
  code: PropTypes.string,
  type: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  amplifiers: PropTypes.object,
  coordinates: PropTypes.object,
  children: PropTypes.any,
  title: PropTypes.string,
}
