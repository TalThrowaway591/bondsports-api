# **Bondsports API assignemnt**

This repository contains an implementation of the provided assignment

## Runtime layout

- Fastify (HTTP server)
- Typescript 
- PostgreSQL (w/ `pg` driver)
- Vitest (for unit tests)

## Setup

```bash
npm install

docker compose up -d # spin up pg container

./scripts/init/seed-db.sh # to create tables and seed with mock data

npm run build
npm start

# alternatively, for process watchers
npm run start:dev
```

## Design & Architecture

I architected this web-server (mostly) with the understandings I gained in the book "Clean Architecture" By Uncle Bob, completed with my own interpertation of best practices.

Different layers of the web-server are separate: 

- **Business Logic**: Consists of entities, their corresponding methods and business rules they enforce.

- **Driver**: The HTTP server itself, it's corresponding request handlers and api structure, endpoints, etc.

- **Data Persistence**: e.g. a postgresql interface which exposes basic methods such as create(), list()

- **Adapters**: Consists of entity gateways (expose methods between entities and data persistence layer), and mappers. in short a layer responsible for flexible adaptation between layers

## Testing
```bash
npm test # to run unit tests

# to run various cURL requests on dummy account
./scripts/deposit [amount]
./scripts/withdraw [amount]
./scripts/statement
./scripts/statement-with-filters
./scripts/create-account
```

## TODO:
- single DB transaction: when updating balance (add transaction row + change balance in accounts)
- rm gh alt account 
- db connection pool
- db paging (maybe added to 'shoul've done' list)
- add in memory data persistence

- make sure money in cents
- handle account type

## Comments
- some business logic is stored inside the handlers, it shouldnt' be, there should be usecases
inside the /app folder (business logic)

- fields regarding money numerals should be counted in cents, this should be persistent throughout the API and any client should be aware of this design choice.


## Design changes:

The provided document specifies entity parameters - I have different layers of obejects: PG row -> Business Entity -> API Entity.

I made some minor changes in the entity specification for convinience and ease-of-use.

- `accountId` in Account is changed to just `id`, same with other entitites. (term. repetition)
- `createdAt` in Account is changed to `creationTimestamp` (better terminology IMO)

- `value` in Transaction is changed to `amount` (to signify a numeral)
- `transactionDate` in Transaction is changed to `createdAt` (term. repetition)