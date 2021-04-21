import { promptFields, promptOptions } from 'interactive-cli';

import { Api } from '../index';
import { SearchData, SearchItemKeys, SearchType } from '../types';

export function searchZendesk(api: Api): Promise<unknown> {
  const data: SearchData = {};
  const searchCategories = Object.keys(api.map);

  return promptOptions('What would you like to search for?', searchCategories)
    .then((searchTypeSelection: SearchType) => {
      data.searchTypeSelection = searchTypeSelection;
      const fields = Object.keys(api.map[searchTypeSelection]).toString();
      return promptFields(
        `Which field would you like to search by? \n Your options for ${searchTypeSelection} are:\n` + fields,
      );
    })
    .then((searchFieldSelection: string) => {
      data.searchFieldSelection = searchFieldSelection;
      const singularType = data.searchTypeSelection?.slice(0, -1);
      return promptFields(`What is the ${data.searchFieldSelection} of the ${singularType} you would like to find?`);
    })
    .then(async (value: string) => {
      const { searchTypeSelection, searchFieldSelection } = data;
      const { search, map } = api;
      if (searchFieldSelection) {
        return search(searchTypeSelection as SearchType, searchFieldSelection as SearchItemKeys, value, map);
      }
      throw new Error('No field chosen');
    })
    .then((searchResults: string[]) => console.log(searchResults))
    .catch((error: string | undefined) => {
      throw new Error(error);
    });
}
