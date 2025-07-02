import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useState, type ReactNode } from "react";
import { SnackbarContext, type SnackbarState } from ".";

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const state = useState<SnackbarState>();

  return (
    <SnackbarContext.Provider value={state}>
      {children}
      <Snackbar
        open={state[0] !== undefined}
        autoHideDuration={state[0]?.[0] === "error" ? 60_000 : 2000}
        onClose={() => state[1](undefined)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {state[0] && (
          <Alert
            onClose={() => state[1](undefined)}
            severity={state[0][0]}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {state[0][1]}
          </Alert>
        )}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
