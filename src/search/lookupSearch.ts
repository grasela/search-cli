import {
  LookupMap,
  OrganizationField,
  SearchItem,
  SearchItemValues,
  SearchType,
  TicketField,
  UserField,
} from '../types/Search';

export type Error = {
  error: boolean;
  errorMessage: string;
};

export type LookupResult = Array<SearchItem> | Error;
export function lookupSearch(
  type: SearchType,
  field: OrganizationField | TicketField | UserField,
  value: SearchItemValues,
  map: LookupMap,
): LookupResult {
  const typeObject = map[type];
  const error = { error: true };
  if (!typeObject) {
    return { ...error, errorMessage: `❌ Error: ${type} is not a valid search` };
  }
  const fieldObject = typeObject[field];
  if (!fieldObject) {
    return { ...error, errorMessage: `❌ Error: ${type} doesn't have property of ${field}` };
  }
  const valueObject = fieldObject[value];
  if (!valueObject) {
    return { ...error, errorMessage: `❌  ${field} of ${value} in ${type} NOT FOUND` };
  }
  return valueObject;
}
