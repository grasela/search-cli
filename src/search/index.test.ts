import { Organization } from 'types/Organization';
import { Field, LookupMap, SearchItem, SearchResults, SearchType } from 'types/Search';
import { Ticket } from 'types/Ticket';
import { User } from 'types/User';

import organizations from '../../data/organizations.json';
import tickets from '../../data/tickets.json';
import users from '../../data/users.json';
import { ItemMap, generateMapForSearchItem } from './generateMap';
import { search } from './index';
import { Error } from './lookupSearch.js';

const map: LookupMap = {
  users: generateMapForSearchItem(users) as ItemMap<User>,
  organizations: generateMapForSearchItem(organizations) as ItemMap<Organization>,
  tickets: generateMapForSearchItem(tickets) as ItemMap<Ticket>,
};

test('returns an error when search fails due to field value', () => {
  const type = 'tickets';
  const field = 'submitter_id';
  const fieldValue = 150000;
  const result = search(type, field, fieldValue, map) as Error;
  expect(result.error).toBeTruthy();
  expect(result.errorMessage.includes(type)).toBeTruthy();
  expect(result.errorMessage.includes(field)).toBeTruthy();
  expect(result.errorMessage.includes(fieldValue.toString())).toBeTruthy();
});

test('returns an error when search fails due to field', () => {
  const type = 'tickets';
  const field = 'submitter_ids';
  const fieldValue = 38;
  const result = search(type, field as Field, fieldValue, map) as Error;
  expect(result.error).toBeTruthy();
  expect(result.errorMessage.includes(type)).toBeTruthy();
  expect(result.errorMessage.includes(field)).toBeTruthy();
});

test('returns an error when search fails due to type', () => {
  const type = 'ticketss';
  const field = 'submitter_id';
  const fieldValue = 38;
  const result = search(type as SearchType, field, fieldValue, map) as Error;
  expect(result.error).toBeTruthy();
});
const hasDuplicates = (array: SearchItem[]) => array.some((item, idx) => array.indexOf(item) != idx);

test('returns correct results for tickets search with its corresponding search items', () => {
  const type = 'tickets';
  const field = 'submitter_id';
  const fieldValue = 38;
  const result = search(type, field, fieldValue, map) as SearchResults;
  expect(result).toBeTruthy();
  expect(hasDuplicates(result.users)).toBeFalsy();
  expect(hasDuplicates(result.tickets)).toBeFalsy();
  expect(hasDuplicates(result.organizations)).toBeFalsy();
});

test('returns correct results for users search without any duplicated values', () => {
  const type = 'users';
  const field = 'role';
  const fieldValue = 'admin';
  const result = search(type, field, fieldValue, map) as SearchResults;
  expect(result).toBeTruthy();

  expect(hasDuplicates(result.users)).toBeFalsy();
  expect(hasDuplicates(result.tickets)).toBeFalsy();
  expect(hasDuplicates(result.organizations)).toBeFalsy();
});
test('returns correct results for organizations without any duplicated values', () => {
  const type = 'organizations';
  const field = 'shared_tickets';
  const fieldValue = 'false';
  const result = search(type, field, fieldValue, map) as SearchResults;
  expect(result).toBeTruthy();

  expect(hasDuplicates(result.users)).toBeFalsy();
  expect(hasDuplicates(result.tickets)).toBeFalsy();
  expect(hasDuplicates(result.organizations)).toBeFalsy();
});
test('returns correct results for organizations for a timestamp search', () => {
  const type = 'organizations';
  const field = 'created_at';
  const fieldValue = '2016-06-06T02:50:27 -10:00';
  const result = search(type, field, fieldValue, map) as SearchResults;
  expect(result).toBeTruthy();

  expect(hasDuplicates(result.users)).toBeFalsy();
  expect(hasDuplicates(result.tickets)).toBeFalsy();
  expect(hasDuplicates(result.organizations)).toBeFalsy();
});
test('returns correct results for values nested in arrays users', () => {
  const type = 'users';
  const field = 'tags';
  const fieldValue = 'Wescosville';
  const result = search(type, field, fieldValue, map) as SearchResults;
  expect(result).toBeTruthy();
  result.users.forEach((user) => {
    expect(user[field].includes(fieldValue)).toBeTruthy();
  });
});
test('returns correct results for values nested in arrays in organizations', () => {
  const type = 'organizations';
  const field = 'domain_names';
  const fieldValue = 'bluegrain.com';
  const result = search(type, field, fieldValue, map) as SearchResults;
  expect(result).toBeTruthy();
  result.organizations.forEach((organization) => {
    expect(organization[field].includes(fieldValue)).toBeTruthy();
  });
});
test('return correct item for empty search values', () => {
  const type = 'organizations';
  const field = 'details';
  const fieldValue = '';
  const result = search(type, field, fieldValue, map) as SearchResults;
  expect(result).toBeTruthy();
  result.organizations.forEach((organization) => {
    expect(organization[field].includes(fieldValue)).toBeTruthy();
  });
});
