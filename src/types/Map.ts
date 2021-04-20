import { Organization } from './Organization';
import { Ticket } from './Ticket';
import { User } from './User';

export type MapData = {
  organizations: Array<Organization>;
  users: Array<User>;
  tickets: Array<Ticket>;
};

type ValueOf<T> = T[keyof T];

export type SearchItem = User | Ticket | Organization;
export type SearchItemKeys = keyof SearchItem;
export type SearchItemValues = ValueOf<SearchItem>;
