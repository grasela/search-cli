import { User } from 'types/User.js';

import { ItemMap, generateMapForSearchItem, generateMapFromArray } from './generateMap';

const user = {
  _id: 1,
  url: 'http://initech.zendesk.com/api/v2/users/1.json',
  external_id: '74341f74-9c79-49d5-9611-87ef9b6eb75f',
  name: 'Francisca Rasmussen',
  alias: 'Miss Coffey',
  created_at: '2016-04-15T05:19:46 -10:00',
  active: true,
  verified: true,
  shared: false,
  locale: 'en-AU',
  timezone: 'Sri Lanka',
  last_login_at: '2013-08-04T01:03:27 -10:00',
  email: 'coffeyrasmussen@flotonic.com',
  phone: '8335-422-718',
  signature: "Don't Worry Be Happy!",
  organization_id: 119,
  tags: ['Springville', 'Sutton', 'Hartsville/Hartley', 'Diaperville'],
  suspended: true,
  role: 'admin',
  mock: ['one', 'two', 'three'],
};
const secondUser = {
  _id: 2,
  url: 'http://initech.zendesk.com/api/v2/users/2.json',
  external_id: 'c9995ea4-ff72-46e0-ab77-dfe0ae1ef6c2',
  name: 'Cross Barlow',
  alias: 'Miss Joni',
  created_at: '2016-06-23T10:31:39 -10:00',
  active: true,
  verified: true,
  shared: false,
  locale: 'en-AU',
  timezone: 'Sri Lanka',
  last_login_at: '2012-04-12T04:03:28 -10:00',
  email: 'jonibarlow@flotonic.com',
  phone: '9575-552-585',
  signature: "Don't Worry Be Happy!",
  organization_id: 106,
  tags: ['Foxworth', 'Woodlands', 'Herlong', 'Henrietta'],
  suspended: false,
  role: 'admin',
};
const map = generateMapForSearchItem([user, secondUser] as Array<User>) as ItemMap<User>;
const userKeys = Object.keys(user);
const mapKeys = Object.keys(map);

//TODO: fix this test to include keys from user not equal
test('map should include keys from both users', () => {
  expect(userKeys.length).toEqual(mapKeys.length);
  expect(userKeys).toStrictEqual(mapKeys);
});

test('every non array key value path on map resolves to user', () => {
  userKeys.forEach((key) => expect(map[key]).toBeTruthy());
  const filteredKeys = userKeys.filter((key) => !Array.isArray(user[key]));
  filteredKeys.forEach((key) => expect(map[key][user[key]][0]).toBe(user));
});
test('every element in an array behind a key resolves to user', () => {
  userKeys.forEach((key) => expect(map[key]).toBeTruthy());
  const filteredKeys = userKeys.filter((key) => Array.isArray(user[key]));
  filteredKeys.forEach((key) => {
    user[key].forEach((item: string | number) => {
      expect(map[key][item][0]).toBe(user);
    });
  });
});

test('boolean values are used in keys correctly', () => {
  expect(map.shared['false'][0]).toBe;
  expect(map.suspended['true'][0]).toBe(user);
  expect(map.active['true'][0]).toBe(user);

  expect(map.shared['false'][1]).toBe(secondUser);
  expect(map.suspended['false'][0]).toBe(secondUser);
  expect(map.active['true'][1]).toBe(secondUser);
});

test('the same values generate array which includes related users', () => {
  expect(map.shared['false'][0]).toBe(user);
  expect(map.active['true'][0]).toBe(user);
  expect(map.locale?.['en-AU'][0]).toBe(user);
  expect(map.timezone?.['Sri Lanka'][0]).toBe(user);

  expect(map.shared['false'][1]).toBe(secondUser);
  expect(map.active['true'][1]).toBe(secondUser);
  expect(map.locale?.['en-AU'][1]).toBe(secondUser);
  expect(map.timezone?.['Sri Lanka'][1]).toBe(secondUser);
});

test('array is mapped correctly', () => {
  const tags = user.tags;
  const arrayMap = generateMapFromArray(tags, user);
  const keys = Object.keys(arrayMap);
  expect(keys).toHaveLength(tags.length);
  keys.forEach((key) => {
    expect(arrayMap[key][0]).toBe(user);
  });
});
test('array is mapped without duplicates', () => {
  const tags = ['Springville', 'Sutton', 'Hartsville/Hartley', 'Diaperville', 'Diaperville'];
  const arrayMap = generateMapFromArray(tags, user);
  const keys = Object.keys(arrayMap);
  expect(keys.some((key, idx) => keys.indexOf(key) != idx)).toBeFalsy();
  expect(keys).not.toHaveLength(tags.length);
  keys.forEach((key) => {
    expect(map[key][0]).toBe(user);
  });
});
