import { createContext, useContext } from "react";

export type SnackbarState = [type: "success" | "error", message: string];

export const SnackbarContext = createContext<
  [
    SnackbarState | undefined,
    React.Dispatch<React.SetStateAction<SnackbarState | undefined>>
  ]
>(null!);

export const useSnackbar = () => {
  const [state, setState] = useContext(SnackbarContext);
  return (type: "success" | "error", message: string) => {
    if (state) {
      setState(undefined);
      setTimeout(() => {
        setState([type, message]);
      });
    } else {
      setState([type, message]);
    }
  };
};
