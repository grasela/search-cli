import { Organization } from 'types/Organization';
import { LookupMap, SearchItemKeys, SearchItemValues, SearchResults, SearchType } from 'types/Search';
import { Ticket } from 'types/Ticket';
import { User } from 'types/User';

import { Error, lookupSearch } from './lookupSearch';
import { getOrgIds, isError, lookup } from './utils';

export function search(
  type: SearchType,
  field: SearchItemKeys,
  value: SearchItemValues,
  map: LookupMap,
): SearchResults | Error {
  const primaryResult = lookupSearch(type, field, value, map);
  const searchResults: SearchResults = { organizations: [], tickets: [], users: [] };
  if (isError(primaryResult)) {
    return primaryResult;
  }

  switch (type) {
    case 'users':
      const users = primaryResult as User[];
      const userOrgIds = getOrgIds(users, type);
      searchResults.users = primaryResult as User[];

      searchResults.organizations = lookup('users', userOrgIds, map) as Organization[];
      searchResults.tickets = lookup('tickets', userOrgIds, map) as Ticket[];
      break;

    case 'tickets':
      const tickets = primaryResult as Ticket[];
      const ticketOrgIds = getOrgIds(tickets, type);
      searchResults.tickets = primaryResult as Ticket[];

      searchResults.organizations = lookup('organizations', ticketOrgIds, map) as Organization[];
      searchResults.users = lookup('users', ticketOrgIds, map) as User[];
      break;

    default:
      const organizations = primaryResult;
      const orgIds = getOrgIds(organizations, type);
      searchResults.organizations = primaryResult as Organization[];

      searchResults.users = lookup('users', orgIds, map) as User[];
      searchResults.tickets = lookup('tickets', orgIds, map) as Ticket[];
      break;
  }

  return searchResults;
}
