# Data search CLI Application 

Node implementation of CLI Application used to search through different data sets. 

## Tools

-   TypeScript

    Typescript language support
    -   config file: `tsconfig.json`
    -   dependencies: typescript
    -   optional dependencies: @types/node, ts-node

-   Jest

    Testing framework with typings
    -   config file: `jest.config.js`
    -   dependencies: jest, ts-jest, @types/jest

-   ESLint

    Linting tool with TS support
    -   config file: `.eslintrc.js`
    -   dependencies: eslint, @typescript-eslint/parser, @typescript-eslint/eslint-plugin


- Node 

## Usage

```
    $ yarn start
    $ yarn build
    $ yarn lint
    $ yarn test
```
You can list possible field values and free type the searchTerm. The terms needs to be matching exactly. 

## Tests 
 
Tests have been written using JEST. You can run `yarn test:watch` if you would tests to keep watching while you work on files.


### Search considerations

- The fastest way to search for data is in fact to perform a lookup. In order to be able to do that there is a need of remapping existing data to a different structure that would represent a map of every field and their values being related to the actual searchable item (User, Ticket or Organization)
- This is possible only if we can store the map in memory. The user experience will be better since we can retrieve results faster, however the boot up time can be compromised by this solution depending on the original data set. 

### Assumptions

The main assumption here is that we have enough memory to map the give data and store in the memory. This will perform better than ordinary linear search even if we consider some of the sorted properties by search in a binary order. 

