## 1. Create DevDbScreen

Build a screen with the following functionality:

### A. Database schema exploration

- Display a list of all SQLite tables in the database
- When a table is selected, display its columns (schema info) including:
    - column name
    - type
    - whether it is nullable / primary key (if available)

### B. SQL query editor

- Provide a text input area where the developer can write raw SQL queries
- Add an “Execute” button to run the query against the SQLite database

### C. Query results viewer

- Display query results in a readable table or structured JSON format
- Handle both:
    - SELECT queries (show returned rows)
    - non-SELECT queries (INSERT, UPDATE, DELETE)

### D. Execution feedback

After executing a query, display:

- number of rows affected for INSERT / UPDATE / DELETE
- number of rows returned for SELECT queries
- any errors if the query fails

---

## 2. Navigation integration

- Add this screen to the existing `Tab.Navigator`
- It should appear as a new tab alongside existing tabs
- Use a database-related icon (e.g. "database", "server", or similar from `@expo/vector-icons`)
- Label the tab: `DB` or `Dev DB`

---

## 3. Restrictions / requirements

- This screen must only be available in development mode (`__DEV__ === true`)
- It should not be included in production builds
- Use `expo-sqlite` API compatible with Expo SDK
- Keep UI simple but functional (developer tool, not production UI)

---

## 4. Goal

The goal is to create an internal developer tool that acts like a lightweight SQLite browser inside the app, allowing inspection and manipulation of the local database during development without external tools.