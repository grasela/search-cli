import { SearchItem, SearchItemValues } from 'types/Search';

export type ItemMap<Item> = {
  //@ts-ignore
  [Property in keyof Item]: { [K in SearchItemValues]: Array<Item> };
};

export function generateMapForSearchItem(data: Array<SearchItem>): ItemMap<SearchItem> {
  return data.reduce((map, currentItem) => {
    const fields = Object.keys(currentItem);
    fields.forEach((field) => {
      //TODO: workout if currentItem[field] is an array and process differently
      // make sure to collect multiple elements with the same value
      if (map[field] && map[field][currentItem[field]]) {
        map[field][currentItem[field]].push(currentItem);
      } else {
        const newResult = { [currentItem[field]]: [currentItem] };
        map[field] = { ...map[field], ...newResult };
      }
    });
    return map;
  }, {} as ItemMap<SearchItem>);
}
