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

## Setup

- Install packages via `npm i`

- The source code is written in TS, in case you want to transpile your changes, run
`npm run build`, a watcher for the build process is available with `npm run build:dev`

- TODO: exact command and implement docker-compose
- To setup a PostgreSQL container for the project run `docker-compose -d up`

- TODO: finish
- Alternatively, you can use in-memory data persistence: by changing 

- To run the application, run `npm start`, an option to watch the process for changes is available by running `npm run start:dev`

## Design & Architecture

I architected this web-server (mostly) with the understandings I gained in the book "Clean Architecture" By Uncle Bob, completed with my own interpertation of best practices.

Different layers of the web-server are separate: 

- business logic - consists of entities, their corresponding methods and business rules they enforce.
- the driver - the web-server itself, it's corresponding request handlers and api structure, endpoints, etc.
- a data persistence layer - e.g. a postgresql interface which exposes basic methods such as create(), list()
- adapters - which consists of entity gateways (expose methods between entities and data persistence layer), and mappers. in short a layer responsible for flexible adaptation between layers

## TODO:
- single DB transaction: when updating balance (add transaction row + change balance in accounts)
- rm gh alt account 
- db connection pool
- db paging (maybe added to 'shoul've done' list)

## Comments
- some business logic is stored inside the handlers, it shouldnt' be, there should be usecases
inside the /app folder (business logic)

