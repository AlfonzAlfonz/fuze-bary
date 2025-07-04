import { useMemo, useState } from "react";
import type { OrderItem } from "./types";
import { usePriceData } from "./usePriceData";
import { useSnackbar } from "./Snackbars";
import { useStore } from "./store/db";

export const useApplication = () => {
  const openSnackbar = useSnackbar();

  const store = useStore();

  const priceData = usePriceData();

  const colorIndexes = useMemo(
    () =>
      priceData.data && [
        ...new Set(Object.values(priceData.data).map((d) => d.category)),
      ],
    [priceData.data]
  );

  const [order, setOrder] = useState<OrderItem[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  return {
    priceData,
    colorIndexes,
    order,
    orderSubmitting: loading,

    actions: {
      addToOrder: (id: string) =>
        setOrder((s) => {
          if (s.some((itm) => itm.itemId === id)) {
            return s.map((itm) =>
              itm.itemId === id ? { ...itm, amount: itm.amount + 1 } : itm
            );
          } else {
            return [...s, { itemId: id, amount: 1 }];
          }
        }),
      removeFromOrder: (id: string) =>
        setOrder((s) =>
          s
            .map((itm) =>
              itm.itemId === id ? { ...itm, amount: itm.amount - 1 } : itm
            )
            .filter((itm) => itm.amount)
        ),
      submitOrder: async (
        method: "cash" | "card" | `tab_${number}`,
        multiplier: number
      ) => {
        const now = new Date().toISOString();

        setLoading(true);

        try {
          await store.addTransaction(
            order.map((orderItem) => {
              const item = priceData.data![orderItem.itemId];
              return {
                ...orderItem,
                price: item.price,
                name: item.name,
                createdAt: now,
                method,
                multiplier,
              };
            })
          );
          setOrder([]);
          openSnackbar("success", "Ůloženo");
        } catch (e) {
          openSnackbar("error", e instanceof Error ? e.message : String(e));
        } finally {
          setLoading(false);
        }
      },
    },
  };
};
