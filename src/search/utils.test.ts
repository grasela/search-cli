import { Organization } from 'types/Organization';
import { LookupMap, SearchType } from 'types/Search';
import { Ticket } from 'types/Ticket';
import { User } from 'types/User';

import organizations from '../../data/organizations.json';
import tickets from '../../data/tickets.json';
import users from '../../data/users.json';
import { ItemMap, generateMapForSearchItem } from './generateMap';
import { getFieldFromSearchType, lookup } from './utils';

const map: LookupMap = {
  users: generateMapForSearchItem(users) as ItemMap<User>,
  organizations: generateMapForSearchItem(organizations) as ItemMap<Organization>,
  tickets: generateMapForSearchItem(tickets) as ItemMap<Ticket>,
};
test('getFieldFromSearchType returns correct value for users', () => {
  const usersField = getFieldFromSearchType('users');
  const ticketsField = getFieldFromSearchType('tickets');
  const orgFields = getFieldFromSearchType('organizations');

  expect(usersField).toBe('organization_id');
  expect(ticketsField).toBe('organization_id');

  expect(orgFields).toBe('_id');
});
test('getFieldFromSearchType returns undefined for no matching values', () => {
  const notMatchingField = getFieldFromSearchType('what' as SearchType);

  expect(notMatchingField).toBeUndefined();
});

test('lookup returns empty array when no organization_id is provided', () => {
  const result = lookup('organizations', [(null as unknown) as string], map);
  expect(result).toHaveLength(0);
});
test('expect an empty array when wrong search type is provided', () => {
  const result = lookup('organizationss' as SearchType, ['_id'], map);
  expect(result).toHaveLength(0);
});
