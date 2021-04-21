import { LookupMap, Organization, SearchItem, SearchType, Ticket, User } from '../types';
import { Error, LookupResult, lookupSearch } from './lookupSearch';

export function isError(result: LookupResult | Error): result is Error {
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

export function reduceData(data: Array<SearchItem>, type: SearchType): { [key: string]: string } {
  return data.reduce((acc, c, idx) => {
    const itemNo = idx + 1;
    switch (type) {
      case 'users':
        const user = c as User;
        acc[`user_${itemNo}_email`] = user.email;
        acc[`user_${itemNo}_ role`] = user.role;
        break;
      case 'tickets':
        const ticket = c as Ticket;
        acc[`ticket_${itemNo}_subject`] = ticket.subject;
        break;
      default:
        const org = c as Organization;
        acc[`organization_${itemNo}_name`] = org.name;
        break;
    }
    return acc;
  }, {});
}
