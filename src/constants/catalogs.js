import entityKind from '../components/WebMap/entityKind'

const code = '10032500001313000000'

export const catalogsCommonData = {
  '601949d071cf4a15a1000003': {
    type: entityKind.POINT,
    code: '10032000001206000000',
    layer: '601949d071cf4a15a1000003',
    catalog: 1,
  },
  '60194a5c6b047715a100000f': {
    type: entityKind.POINT,
    code: '10031002000000009800',
    layer: '60194a5c6b047715a100000f',
    catalog: 2,
  },
  '601949dd71643215a1000004': {
    type: entityKind.POINT,
    code: '10032000001212000000',
    layer: '601949dd71643215a1000004',
    catalog: 3 },
  '60194a656b653115a1000010': {
    type: entityKind.POINT,
    code: '10032000001104000000',
    layer: '60194a656b653115a1000010',
    catalog: 4 },
  '60194a7976245415a1000012': {
    type: entityKind.POINT,
    code: '10032000001203040000',
    layer: '60194a7976245415a1000012',
    catalog: 5 },
  '60194a826d1d9015a1000013': {
    type: entityKind.POINT,
    code: '10032000001200000000',
    attributes: {
      specialHeadquarters: 'полігон',
      viewBox: '21 36 158 118',
    },
    layer: '60194a826d1d9015a1000013',
    catalog: 6,
  },
  '601949e876499e15a1000005': {
    type: entityKind.POINT,
    code: '10032000001204020000',
    layer: '601949e876499e15a1000005',
    catalog: 7,
  },
  '60194a036ef56515a1000007': {
    type: entityKind.POINT,
    code: '10032000001115000000',
    layer: '60194a036ef56515a1000007',
    catalog: 8,
  },
  '60194a0b76952a15a1000008': {
    type: entityKind.POINT,
    code: '10032000001106000000',
    layer: '60194a0b76952a15a1000008',
    catalog: 9,
  },
  '60194a1976499f15a1000009': {
    type: entityKind.POINT,
    code: ('10032000001214020000'),
    layer: '60194a1976499f15a1000009',
    catalog: 10,
  },
  '60194a2272bd2e15a100000a': {
    type: entityKind.POINT,
    code: ('10032000001214060000'),
    layer: '60194a2272bd2e15a100000a',
    catalog: 11 },
  '60194a2b6be03e15a100000b': {
    type: entityKind.POINT,
    code: '10032000001208010000',
    layer: '60194a2b6be03e15a100000b',
    catalog: 12,
  },
  '60191c3c752c1915a1000003': {
    type: entityKind.POINT,
    code,
    layer: '60191c3c752c1915a1000003',
    catalog: 13,
  },
  '601949a27281eb15a1000001': {
    type: entityKind.POINT,
    code: '10032000001205040000',
    layer: '601949a27281eb15a1000001',
    catalog: 14,
  },
  '60194a8b6b142f15a1000014': {
    type: entityKind.POINT,
    code,
    layer: '60194a8b6b142f15a1000014',
    catalog: 15,
  },
  '60194a356e63f815a100000c': {
    type: entityKind.POINT,
    code: '10032000001213090000',
    layer: '60194a356e63f815a100000c',
    catalog: 17,
  },
  '601949c06ea7ca15a1000002': {
    type: entityKind.POINT,
    code: '10032000001213090000',
    layer: '601949c06ea7ca15a1000002',
    catalog: 18,
  },
  '60194a956c5a0b15a1000015': {
    type: entityKind.POINT,
    code,
    layer: '60194a956c5a0b15a1000015',
    catalog: 19,
  },
  '60194a4475375b15a100000d': {
    type: entityKind.POINT,
    code: '10032000001213010000',
    layer: '60194a4475375b15a100000d',
    catalog: 20,
  },
  '60194a9e680b8215a1000016': {
    type: entityKind.POINT,
    code,
    layer: '60194a9e680b8215a1000016',
    catalog: 21,
  },
  '601949f6720a7415a1000006': {
    type: entityKind.POINT,
    code: '10032000001213070000',
    layer: '601949f6720a7415a1000006',
    catalog: 22,
  },
  '60194a4f750e4815a100000e': {
    type: entityKind.POINT,
    code: '10032000001107010000',
    layer: '60194a4f750e4815a100000e',
    catalog: 23,
  },
  '60194a6f6b4d5d15a1000011': {
    type: entityKind.POINT,
    code,
    layer: '60194a6f6b4d5d15a1000011',
    catalog: 36,
  },
}
export const catalogMapId = '60191c3c68be8115a100002e'
export const isCatalogMap = (mapId) => mapId === catalogMapId
export const isCatalogLayer = (layerId) => Object.prototype.hasOwnProperty.call(catalogsCommonData, layerId)

export const commonAttributeKeys = {
  CHANGE_DATE: 'change_date',
  CREATE_DATE: 'create_date',
  CHANGED_BY: 'changed_by',
  CHANGED_BY_ID: 'changed_by_id',
  CREATED_BY: 'created_by',
  CREATED_BY_ID: 'created_by_id',
}
