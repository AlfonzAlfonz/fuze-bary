import { openDB } from "idb";
import type { Tab, Transaction } from "../types";
import { createContext, useContext } from "react";

export type Store = Awaited<ReturnType<typeof createStore>>;

export const createStore = async (epoch: string) => {
  const db = await openDB("test-db1", 2, {
    upgrade(db) {
      console.log("Creating a new object store...");

      if (!db.objectStoreNames.contains("trans")) {
        const store = db.createObjectStore("trans", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("epoch", "epoch");
        store.createIndex("method", "method");
      }

      if (!db.objectStoreNames.contains("tabs")) {
        db.createObjectStore("tabs", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });

  return {
    // Transactions
    addTransaction: async (trans: Omit<Transaction, "id">[]) => {
      const tx = db.transaction("trans", "readwrite");

      await Promise.all([...trans.map((t) => tx.store.add(t)), tx.done]);
    },
    readTransactions: async (): Promise<Transaction[]> => {
      return await db.getAllFromIndex("trans", "epoch", epoch);
    },
    readAllTransactions: async (): Promise<Transaction[]> => {
      return await db.getAll("trans");
    },
    readMethodTransactions: async (
      method: `tab_${number}`
    ): Promise<Transaction[]> => {
      console.log({ method });
      return (await db.getAllFromIndex("trans", "method", method)).filter(
        (t) => t.epoch === epoch
      );
    },

    // Tabs
    addTab: async (tab: Omit<Tab, "id">) => {
      await db.add("tabs", tab);
    },
    readAllTabs: async (): Promise<Tab[]> => {
      return await db.getAll("tabs");
    },
  };
};

export const StoreContext = createContext<Store>(null!);

export const useStore = () => useContext(StoreContext);
