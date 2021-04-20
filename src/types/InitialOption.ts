export enum InitialOptionEnum {
  searchZendesk = 'Search Zendesk',
  listSearchTerms = 'List possible search terms',
}
export type Selection = 'searchZendesk' | 'listSearchTerms' | 'quit';
export type InitialOptions = {
  [key in keyof typeof InitialOptionEnum]: InitialOptionEnum;
};
