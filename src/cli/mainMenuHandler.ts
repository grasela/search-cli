import { ExitScript } from 'interactive-cli';

import { Api } from '../index';
import { SearchFields, SearchTermsEnum, Selection } from '../types';
import { searchZendesk } from './searchZendesk';

export const mainMenuHandler = (selection: Selection, api: Api): Promise<unknown> | void | typeof ExitScript => {
  switch (selection) {
    case 'listSearchTerms':
      return listSearchFields(api.fields);
    case 'searchZendesk':
      return searchZendesk(api);
    default: {
      throw new ExitScript(`Unknown selection "${selection}"`);
    }
  }
};
function listSearchFields(fields: SearchFields): void {
  Object.keys(fields).forEach((key) => {
    console.log('----------------------');
    console.log('🀱', SearchTermsEnum[key]);
    console.log('----------------------');
    fields[key].forEach((field: string) => console.log('→', field));
  });
}
