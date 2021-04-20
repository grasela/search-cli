import { ItemMap } from 'search/generateMap';

import { Organization } from './Organization';
import { Ticket } from './Ticket';
import { User } from './User';

export type SearchData = {
  searchTypeSelection?: SearchType;
  searchFieldSelection?: string;
  searchTerm?: string;
};
export type SearchTerms = {
  userTerms: string[];
  ticketTerms: string[];
  organizationTerms: string[];
};
export enum SearchTermsEnum {
  userTerms = 'Users fields',
  ticketTerms = 'Ticket fields',
  organizationTerms = 'Organization Field',
}

export type SearchResults = {
  organizations: Array<Organization>;
  tickets: Array<Ticket>;
  users: Array<User>;
};

export type Data = {
  organizations: Array<Organization>;
  users: Array<User>;
  tickets: Array<Ticket>;
};

export type SearchType = keyof Data;

export type MapData = {
  organizations: Array<Organization>;
  users: Array<User>;
  tickets: Array<Ticket>;
};

type ValueOf<T> = T[keyof T];

export type SearchItem = User | Ticket | Organization;
export type SearchItemKeys = keyof User | keyof Ticket | keyof Organization;
export type SearchItemValues = ValueOf<SearchItem>;

export type UserField = keyof User;
export type TicketField = keyof Ticket;
export type OrganizationField = keyof Organization;
export type Field = UserField | TicketField | OrganizationField;
export type LookupMap = {
  organizations: ItemMap<Organization>;
  users: ItemMap<User>;
  tickets: ItemMap<Ticket>;
};
