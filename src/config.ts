/**
 * Static, build-time application configuration.
 *
 * Values read from `import.meta.env` are injected by Vite at build time from
 * `.env` / `.env.*` files (see `vite-env.d.ts` for their types). Everything
 * else is a hardcoded default that lives in one place so it is easy to change.
 */
export const config = {
  branding: {
    name: "Fůůůze bary",
  },

  /** URL of the CSV price sheet that drives the menu. */
  priceDataUrl: import.meta.env.VITE_INPUT_URL,

  /** Optional bearer token sent with the price sheet request. */
  authToken: import.meta.env.VITE_AUTH_TOKEN,

  /** Endpoint pinged to detect connectivity before fetching fresh prices. */
  onlinePingUrl: "https://platform.signageos.io/ping",

  /** localStorage key under which the last successfully fetched prices are cached. */
  priceCacheKey: "ceny",

  /** Currency suffix rendered next to every price. */
  currency: "Kč",

  /** Discount applied when the "crew" checkbox is ticked (0.2 = 20% off). Checkbox is hidden if value is 0. */
  crewDiscount: 0,

  /** Payment methods offered on the order screen, in display order. */
  paymentMethods: ["cash", "tab"] as ("card" | "cash" | "tab")[],
} as const;
