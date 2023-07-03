
# Auction Backend with NestJs

## Requirements
1. Install `Node.js` 16+
2. Install `postgres` 11
3. Install `pnpm` 7

## Run Application
1. run `pnpm run install`
2. Create `.env` file follow variables in `.env.example` file
3. Run migration `pnpm run migration:run`
4. Start development server `pnpm run start:dev`
5. The application should be running at `http://localhost:3000`


## Generate Migration
```bash
pnpm run migration:generate src/migration/<MIGRATION-NAME>
```

## Migration
```bash
# Create migration
pnpm run migration:generate src/migration/<MIGRATION-NAME>
```

```bash
# Run migration
pnpm run migration:run
```

```bash
# Revert migration
pnpm run migration:revert
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```