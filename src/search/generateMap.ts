import { LookupMap, SearchFields, SearchItem, SearchItemValues } from '../types';

export type ItemMap<Item> = {
  //@ts-ignore
  [Property in keyof Item]: { [K in SearchItemValues]: Array<Item> };
};

export function generateMapFromArray(data: string[], searchItem: SearchItem): { [key: string]: Array<SearchItem> } {
  return data.reduce((acc, currentItem) => {
    return acc[currentItem] ? acc[currentItem].push(searchItem) : { ...acc, [currentItem]: [searchItem] };
  }, {});
}
export function generateMapForSearchItem(data: Array<SearchItem>): ItemMap<SearchItem> {
  return data.reduce((map, currentItem) => {
    const fields = Object.keys(currentItem);
    fields.forEach((field) => {
      const key = currentItem[field];
      if (Array.isArray(key)) {
        map[field] = map[field]
          ? { ...generateMapFromArray(key, currentItem), ...map[field] }
          : generateMapFromArray(key, currentItem);
      } else {
        // make sure to collect multiple elements with the same value
        if (map[field] && map[field][key]) {
          map[field][key].push(currentItem);
        } else {
          const newResult = { [key]: [currentItem] };
          map[field] = { ...map[field], ...newResult };
        }
      }
    });
    return map;
  }, {} as ItemMap<SearchItem>);
}

export function getFieldsFromMap(map: LookupMap): SearchFields {
  return {
    userTerms: Object.keys(map.users),
    organizationTerms: Object.keys(map.organizations),
    ticketTerms: Object.keys(map.tickets),
  };
}
