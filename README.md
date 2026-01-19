# **Bondsports API assignemnt**

- This repository contains an implementation of the provided assignment

## Setup

- Install packages via `npm i`

- The source code is written in TS, in case you want to transpile your changes, run
`npm run build`, a watcher for the build process is available with `npm run build:dev`

- TODO: exact command and implement docker-compose
- To setup a PostgreSQL container for the project run `docker-compose -d up`

- TODO: finish
- Alternatively, you can use in-memory data persistence: by changing 

- To run the application, run `npm start`, an option to watch the process for changes is available by running `npm run start:dev`


## TODO:
- single DB transaction: when updating balance (add transaction row + change balance in accounts)
- rm gh alt account 
- db connection pool
- db paging (maybe added to 'shoul've done' list)

## Comments
- some business logic is stored inside the handlers, it shouldnt' be, there should be usecases
inside the /app folder (business logic)

