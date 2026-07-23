import { useQuery } from "@tanstack/react-query";
import { parse } from "csv-parse/browser/esm/sync";
import slugify from "slugify";
import { config } from "./config";
import type { Item } from "./types";

type TableRow = [
  name: string,
  link: string,
  never,
  never,
  never,
  price: string,
];

export const usePriceData = () => {
  return useQuery({
    queryKey: ["price-data"],
    networkMode: "always",
    gcTime: 0,
    queryFn: async (): Promise<Record<string, Item>> => {
      const persisted = localStorage.getItem(config.priceCacheKey);

      const isOnline = await fetch(config.onlinePingUrl, {
        method: "HEAD",
      })
        .then(() => true)
        .catch(() => false);

      if (!isOnline && persisted !== null) {
        return JSON.parse(persisted);
      }

      const file = await fetch(config.priceDataUrl + `?t=${Date.now()}`, {
        headers: config.authToken
          ? { Authorization: `Bearer ${config.authToken}` }
          : undefined,
      }).then((r) => r.text());

      const parsed = parse(file, { delimiter: "," }) as TableRow[];

      const result: [string, Item][] = [];
      let category: string = undefined!;

      for (const r of parsed) {
        if (isCategory(r)) {
          category = r[0];
          continue;
        }

        const price = parsePrice(r[5]);

        if (price) {
          const id = slugify(r[0]);
          result.push([
            id,
            {
              id,
              name: r[0],
              price,
              category,
            },
          ]);
        }
      }

      const ceny = Object.fromEntries(result);

      localStorage.setItem(config.priceCacheKey, JSON.stringify(ceny));

      return ceny;
    },
  });
};

const parsePrice = (v: string) => {
  const n = v.replace(new RegExp(` ${config.currency}$`), "");
  if (isFinite(Number(n))) {
    return Number(n);
  }
  return undefined;
};

const isCategory = ([, ...rest]: TableRow) => rest.every((c) => c === "");
