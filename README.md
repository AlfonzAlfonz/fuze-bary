# Fůze bary

Simple cash register for small music festivals, made for the Fůze festival. With minor changes, it can be used at any other small event.

**Features:**

- Offline support
- Payment with cash or card
- Open bills
- All data is stored locally in IndexedDB
- All data can be exported to a CSV file.

## Local setup

1. Make your price data available on some url as a CSV file. First column contains name and sixth contains price.
2. Create `.env` file:
   ```
    VITE_INPUT_URL= # url of the price data
    VITE_AUTH_TOKEN= # auth token sent with each request
   ```
3. Run `pnpm i`
4. Run `pnpm dev`
