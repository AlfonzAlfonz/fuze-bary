import { useEffect, useState, type ReactNode } from "react";
import { createStore, StoreContext, type Store } from "./db";
import CircularProgress from "@mui/material/CircularProgress";

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [store, setStore] = useState<Store>(null!);

  useEffect(() => {
    (async () => {
      setStore(await createStore("test-2"));
    })();
  }, []);

  return store ? (
    <StoreContext value={store}>{children}</StoreContext>
  ) : (
    <CircularProgress />
  );
};
