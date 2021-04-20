import { LookupMap, SearchItem, SearchType } from 'types/Search';

import { Error, LookupResult, lookupSearch } from './lookupSearch';

export function isError(result: LookupResult): result is Error {
  return (result as Error).error !== undefined;
}

type Field = '_id' | 'organization_id';
enum FieldEnum {
  'users' = 'organization_id',
  'tickets' = 'organization_id',
  'organizations' = '_id',
}
export function getFieldFromSearchType(searchType: SearchType): Field {
  return FieldEnum[searchType];
}

export function lookup(
  searchType: SearchType,
  organization_ids: Array<number | string | undefined>,
  map: LookupMap,
): Array<SearchItem | never> {
  const orgField = getFieldFromSearchType(searchType);

  return organization_ids.reduce((acc, organization_id) => {
    if (organization_id) {
      const result = lookupSearch(searchType, orgField, organization_id, map);
      return isError(result) ? acc : [...acc, ...result];
    }
    return acc;
  }, [] as Array<SearchItem>);
}
export function getOrgIds(items: SearchItem[], searchType: SearchType): number[] {
  const orgField = getFieldFromSearchType(searchType);
  return items.map((item) => item[orgField]).filter((v, i, a) => a.indexOf(v) === i);
}
