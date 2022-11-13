# INSTALLATION STEPS

- **Step 1:** Clone the repository.
- **Step 2:** Run `npm i`.
- **Step 3:** Run command `npm run start:dev`.

# DB MIGRATIONS

- **Sample commands to run migration on postgres**
- **Create an empty migration file:** `npm run typeorm migration:create -- -n Pricing`
- **Create a migration file based on an entity:** `npm run typeorm migration:generate -- -n create-property-chat-table`
- **Run all migration manually:** `npm run typeorm -- migration:run`
- **Revert all migration manually:** `npm run typeorm -- migration:revert`
