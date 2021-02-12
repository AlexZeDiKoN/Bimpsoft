import React from 'react'
import {
  HotKeysContainer,
  Input,
  FilterInput,
  DatePicker,
  TextArea,
  FormColumnFloat,
} from '@C4/CommonComponents'
import memoize from 'memoize-one'
import moment from 'moment'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { propTypes as milSymbolPropTypes } from '../WithMilSymbol'
import './style.css'
import { PROPERTY_PATH } from '../../../../constants/propertyPath'
import i18n from '../../../../i18n'
import { isCatalogLayer, commonAttributeKeys } from '../../../../constants/catalogs'
import { catalogCurrentLayerAttributesFields, catalogErrors, catalogsAdditionalInfo } from '../../../../store/selectors'
import { CollapsibleSign } from './CollapsibleSign'

const propTypes = milSymbolPropTypes

const getFilterValues = (v = []) => [
  { id: null, name: i18n.UNDEFINED },
  ...v.map((name) => ({ name, id: name })),
]

const getElementByType = ({ typeOfInput, label, source, fieldName: name, required }) => {
  const commonProps = { name, label, typeOfInput, autoComplete: 'off', required }
  switch (typeOfInput) {
    case 'number': return { Component: Input.Number, props: { ...commonProps, min: 0 } }
    case 'array': return { Component: FilterInput, props: { ...commonProps, values: getFilterValues(source?.values) } }
    case 'date': return { Component: DatePicker, props: { ...commonProps, showTime: true } }
    case 'textarea': return { Component: TextArea, props: commonProps }
    case 'geometry': return null
    default: return { Component: Input, props: commonProps }
  }
}

export const getElementsByType = memoize((attributes = []) =>
  attributes
    .map(getElementByType)
    .filter(Boolean),
)

const commonProps = {
  [commonAttributeKeys.CHANGE_DATE]: { disabled: true },
  [commonAttributeKeys.CREATE_DATE]: { disabled: true },
  [commonAttributeKeys.CHANGED_BY]: { disabled: true },
  [commonAttributeKeys.CREATED_BY]: { disabled: true },
}

const fixElementsConfig = memoize((config) => ({
  ...config,
  ORG_STRUCTURE: { hidden: true },
  NAME: { hidden: true },
  CODE: { readonly: true },
  CODE_DUMMY: { hidden: true },
  CODE_TASKFORCE: { hidden: true },
  CODE_HQ: { hidden: true },
  CODE_SYMBOL: { hidden: true },
  CODE_STATUS: { hidden: true },
  CODE_AMPLIFIER1: { hidden: true },
  CODE_MODIFIER1: { hidden: true },
  CODE_ICON: { hidden: true },
  CODE_MODIFIER2: { hidden: true },
  CODE_AMPLIFIER2: { hidden: true },
  LOCATION: { hidden: true },
  COORDINATE_LOCATION: { hidden: true },
}))

const WithCatalogsFields = (Component) => class WithCatalogsFields extends Component {
  static propTypes = propTypes

  // ------------------------------------------ Mil Symbol Handlers ----------------------------------------------------
  fixElementsConfig (config) {
    return isCatalogLayer(this?.props?.data?.layer) ? fixElementsConfig(config) : config
  }

  // ----------------------------------------- get and set handlers ----------------------------------------------------
  onChangeCatalogAttributes = ({ target: { name, value } }) => this.setResult((result) => {
    return result.updateIn(PROPERTY_PATH.CATALOG_ATTRIBUTES,
      (attributes) => ({ ...attributes, [name]: value }),
    )
  })

  getCatalogAttribute (name, or, typeInput) {
    const result = this.getResult().getIn(PROPERTY_PATH.CATALOG_ATTRIBUTES)
    const value = this.props.catalogsAdditionalInfo[name] ?? result?.[name]
    if (typeInput === 'date') {
      return value ? moment(value) : or
    }
    return value || or
  }

  // ---------------------------------------------- render methods --------------------------------------------------
  renderParentContent () {
    return typeof super.renderContent === 'function'
      ? super.renderContent()
      : <></>
  }

  renderCatalogElements () {
    const { catalogAttributesFields: fields, canEdit, catalogErrors: errors } = this.props

    const result = this.getResult()
    const attributes = result.getIn(PROPERTY_PATH.ATTRIBUTES)
    const type = result.getIn(PROPERTY_PATH.TYPE)
    const code = result.getIn(PROPERTY_PATH.CODE)
    const coordinatesArray = result.getIn(PROPERTY_PATH.COORDINATES).toJS()
    const coordinates = coordinatesArray[0]
    const components = getElementsByType(fields)

    return <div className="catalog_mil_symbol_editor">
      <HotKeysContainer>

        <CollapsibleSign
          amplifiers={attributes}
          code={code}
          type={type}
          coordinates={coordinates}
        >
          { this.renderParentContent() }
        </CollapsibleSign>

        {components.map(({
          Component,
          props: { label, typeOfInput, hasValue, name, required, ...propsByTypeInput },
        }) =>
          <FormColumnFloat
            label={required ? i18n.REQUIRED(label) : label}
            hasValue={hasValue || Boolean(this.getCatalogAttribute(name))}
            key={name}
          >
            <Component
              name={name}
              value={this.getCatalogAttribute(name, '', typeOfInput)}
              onChange={this.onChangeCatalogAttributes}
              disabled={!canEdit}
              errors={errors[name]}
              {...propsByTypeInput}
              {...commonProps[name]}
            />
          </FormColumnFloat>,
        )}

      </HotKeysContainer>
    </div>
  }

  renderContent () {
    return isCatalogLayer(this?.props?.data?.layer)
      ? this.renderCatalogElements()
      : this.renderParentContent()
  }
}

const decoratorCatalogsFieldsHOC = compose(
  connect((state) => ({
    catalogAttributesFields: catalogCurrentLayerAttributesFields(state),
    catalogErrors: catalogErrors(state),
    catalogsAdditionalInfo: catalogsAdditionalInfo(state),
  }), {}),
  WithCatalogsFields,
)

export default decoratorCatalogsFieldsHOC
