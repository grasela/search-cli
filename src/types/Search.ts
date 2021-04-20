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

export type Data = {
  organizations: Array<Organization>;
  users: Array<User>;
  tickets: Array<Ticket>;
};
