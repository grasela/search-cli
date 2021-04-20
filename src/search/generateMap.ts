import { SearchItem, SearchItemValues } from 'types/Map';

export type Map<Item> = {
  [Property in keyof Item]: { [K in SearchItemValues]: Array<Item> };
};

export function generateMapForSearchItem(data: Array<SearchItem>): Map<SearchItem> {
  return data.reduce((map, currentItem) => {
    const fields = Object.keys(currentItem);

    fields.forEach((field) => {
      // make sure to collect multiple elements with the same value
      if (map[field] && map[field][currentItem[field]]) {
        map[field][currentItem[field]].push(currentItem);
      } else {
        const newResult = { [currentItem[field]]: [currentItem] };
        map[field] = { ...map[field], ...newResult };
      }
    });
    return map;
  }, {} as Map<SearchItem>);
}
