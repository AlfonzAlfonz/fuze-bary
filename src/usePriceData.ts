import { useQuery } from "@tanstack/react-query";
import { parse } from "csv-parse/browser/esm/sync";
import slugify from "slugify";
import type { Item } from "./types";

type TableRow = [
  name: string,
  link: string,
  never,
  never,
  never,
  price: string
];

export const usePriceData = () => {
  return useQuery({
    queryKey: ["price-data"],
    networkMode: "always",
    gcTime: 0,
    queryFn: async (): Promise<Record<string, Item>> => {
      const persisted = localStorage.getItem("ceny");

      const isOnline = await fetch("https://platform.signageos.io/ping", {
        method: "HEAD",
      })
        .then(() => true)
        .catch(() => false);

      if (!isOnline && persisted !== null) {
        return JSON.parse(persisted);
      }

      const url =
        "https://hoyebsvzsgwoiivmgvvb.supabase.co/storage/v1/object/data/ceny.csv";

      const file = await fetch(url + `?t=${Date.now()}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_TOKEN}`,
        },
      })
        .then((r) => ({ data: r, error: null }))
        .catch((e) => ({ data: null, error: e }));

      if (file.error) throw file.error;

      const parsed = parse(await file.data!.text(), {
        delimiter: ",",
      }) as TableRow[];

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

      localStorage.setItem("ceny", JSON.stringify(ceny));

      return ceny;
    },
  });
};

const parsePrice = (v: string) => {
  const n = v.replace(/ Kč$/, "");
  if (isFinite(Number(n))) {
    return Number(n);
  }
  return undefined;
};

const isCategory = ([, ...rest]: TableRow) => rest.every((c) => c === "");
