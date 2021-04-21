import { promptFields, promptOptions } from 'interactive-cli';

import { Api } from '../index';
import { Error } from '../search/lookupSearch';
import { isError, reduceData } from '../search/utils';
import { SearchData, SearchItemKeys, SearchResults, SearchType } from '../types';

export function searchZendesk(api: Api): Promise<unknown> {
  const data = {} as SearchData;
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
    .then((searchResults: SearchResults | Error) => {
      if (isError(searchResults as Error)) {
        console.error((searchResults as Error).errorMessage);
        return;
      }
      const { organizations, users, tickets } = searchResults as SearchResults;

      const reducedOrgData = reduceData(organizations, 'organizations');
      const reducedTicketData = reduceData(tickets, 'tickets');
      const reducedUserData = reduceData(users, 'users');

      const singularType = data.searchTypeSelection?.slice(0, -1);

      searchResults[data.searchTypeSelection].forEach((item) => {
        const tags = item.tags.toString();
        switch (data.searchTypeSelection) {
          case 'users':
            console.log(
              `🎉 Your results for ${singularType} with corresponding organizations' and tickets' details \n`,
            );
            console.table({ ...item, tags, ...reducedOrgData, ...reducedTicketData });
            break;
          case 'tickets':
            console.log(`🎉  Your results for ${singularType} with corresponding organizations' and users' details \n`);
            console.table({ ...item, tags, ...reducedOrgData, ...reducedUserData });
            break;
          default:
            const domain_names = item.domain_names.toString();
            console.log(`🎉 Your results for ${singularType} with corresponding tickets' and users' details \n`);
            console.table({ ...item, tags, domain_names, ...reducedTicketData, ...reducedUserData });
            break;
        }
      });
    })
    .catch((error: string | undefined) => {
      console.log('Oops there has been an error. Try again');
      throw new Error(error);
    });
}
