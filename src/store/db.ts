import { openDB } from "idb";
import type { Transaction } from "../types";

export type Store = Awaited<ReturnType<typeof createStore>>;

export const createStore = async (epoch: string) => {
  const db = await openDB("test-db1", 1, {
    upgrade(db) {
      console.log("Creating a new object store...");

      // Checks if the object store exists:
      if (!db.objectStoreNames.contains("trans")) {
        // If the object store does not exist, create it:
        const store = db.createObjectStore("trans", {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("epoch", "epoch");
      }
    },
  });

  return {
    addTransaction: async (trans: Transaction[]) => {
      const tx = db.transaction("trans", "readwrite");

      await Promise.all([...trans.map((t) => tx.store.add(t)), tx.done]);
    },
    readTransactions: async () => {
      return await db.getAllFromIndex("trans", "epoch", epoch);
    },
    readAllTransactions: async () => {
      return await db.getAll("trans");
    },
  };
};
