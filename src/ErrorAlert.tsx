import Alert from "@mui/material/Alert";

export const ErrorAlert = ({ e }: { e: unknown }) => {
  return e ? (
    <Alert severity="error">{e instanceof Error ? e.message : String(e)}</Alert>
  ) : undefined;
};
