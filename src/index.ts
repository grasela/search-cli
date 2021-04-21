import { exit, onFinalError, startWith } from 'interactive-cli';

import organizations from '../data/organizations.json';
import tickets from '../data/tickets.json';
import users from '../data/users.json';
import { mainMenuHandler } from './cli';
import { search } from './search';
import { ItemMap, generateMapForSearchItem, getFieldsFromMap } from './search/generateMap';
import { InitialOptionEnum, InitialOptions, LookupMap, Organization, Selection, Ticket, User } from './types';

const map: LookupMap = {
  users: generateMapForSearchItem(users) as ItemMap<User>,
  organizations: generateMapForSearchItem(organizations) as ItemMap<Organization>,
  tickets: generateMapForSearchItem(tickets) as ItemMap<Ticket>,
};

const initialOptions: InitialOptions = {
  searchZendesk: InitialOptionEnum.searchZendesk,
  listSearchTerms: InitialOptionEnum.listSearchTerms,
};

const apiHandler = {
  map,
  fields: getFieldsFromMap(map),
  search,
};
export type Api = typeof apiHandler;

function init() {
  new Promise((resolve) => {
    resolve(apiHandler);
  })
    .then((api) => {
      return startWith('Would you like to', initialOptions, (selection: Selection) =>
        mainMenuHandler(selection, api as Api),
      );
    })
    .catch(onFinalError)
    .then(exit);
}

init();
