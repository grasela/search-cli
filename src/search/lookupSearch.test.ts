import { Organization } from 'types/Organization.js';
import { Field, LookupMap, SearchItem, SearchType } from 'types/Search.js';
import { Ticket } from 'types/Ticket.js';
import { User } from 'types/User.js';

import organizations from '../../data/organizations.json';
import tickets from '../../data/tickets.json';
import users from '../../data/users.json';
import { ItemMap, generateMapForSearchItem } from './generateMap';
import { Error, LookupResult, lookupSearch } from './lookupSearch';

const map: LookupMap = {
  users: generateMapForSearchItem(users) as ItemMap<User>,
  organizations: generateMapForSearchItem(organizations) as ItemMap<Organization>,
  tickets: generateMapForSearchItem(tickets) as ItemMap<Ticket>,
};
test('find the item correct', () => {
  const userId = 2;
  const field = '_id';
  const result: LookupResult = lookupSearch('users', field, userId, map);
  expect(result).toHaveLength(1);
  const user = result[0];
  expect(user[field]).toBeTruthy();
  expect(user._id).toBe(userId);
});

test('find find multiple items which share the field and value', () => {
  const fieldValue = true;
  const field = 'verified';
  const numberOfUsers = users.filter((user) => user[field] === true).length;
  const result: LookupResult = lookupSearch('users', field, fieldValue.toString(), map) as Array<SearchItem>;
  expect(result).not.toHaveLength(0);
  expect(result).toHaveLength(numberOfUsers);

  result.forEach((user) => {
    expect(user[field].toString()).toBe(fieldValue.toString());
  });
});

test('should return error object when search type does not exist', () => {
  const type = 'fake';
  const field = 'verified';
  const fieldValue = true;
  const result: LookupResult = lookupSearch(type as SearchType, field, fieldValue.toString(), map) as Error;
  expect(result).toHaveProperty('error');
  expect(result).toHaveProperty('errorMessage');
  expect(result.error).toBeTruthy();
  expect(result.errorMessage.includes(type)).toBeTruthy();
});
test('should return error object when search field does not exist', () => {
  const type = 'users';
  const field = 'fake';
  const fieldValue = true;
  const result: LookupResult = lookupSearch(type as SearchType, field as Field, fieldValue.toString(), map) as Error;
  expect(result).toHaveProperty('error');
  expect(result).toHaveProperty('errorMessage');
  expect(result.error).toBeTruthy();
  expect(result.errorMessage.includes(type)).toBeTruthy();
  expect(result.errorMessage.includes(field)).toBeTruthy();
});

test('should return error object when search value for a search does not exist', () => {
  const type = 'users';
  const field = 'verified';
  const fieldValue = 'fake';
  const result: LookupResult = lookupSearch(type as SearchType, field as Field, fieldValue.toString(), map) as Error;
  expect(result).toHaveProperty('error');
  expect(result).toHaveProperty('errorMessage');
  expect(result.error).toBeTruthy();
  expect(result.errorMessage.includes(type)).toBeTruthy();
  expect(result.errorMessage.includes(field)).toBeTruthy();
  expect(result.errorMessage.includes(fieldValue)).toBeTruthy();
});
