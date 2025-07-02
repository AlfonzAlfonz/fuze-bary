import { useEffect, useState } from "react";
import { createStore, type Store } from "./db";

export const useStore = () => {
  const [store, setStore] = useState<Store>(null!);

  useEffect(() => {
    (async () => {
      setStore(await createStore("test-2"));
    })();
  }, []);

  return [store] as const;
};
