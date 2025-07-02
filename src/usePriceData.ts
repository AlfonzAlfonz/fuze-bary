import { useQuery } from "@tanstack/react-query";
import { parse } from "csv-parse/browser/esm/sync";
import { supabase } from "./supabase";
import type { Item } from "./types";
import slugify from "slugify";

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
    queryFn: async () => {
      const file = await supabase.storage.from("data").download("ceny.csv");

      if (file.error) throw file.error;

      const parsed = parse(await file.data.text(), {
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

      return Object.fromEntries(result);
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
