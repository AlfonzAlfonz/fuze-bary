import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSnackbar } from "../Snackbars";
import { useStore } from "../store/db";
import { ErrorAlert } from "../ErrorAlert";

export const BarTabs = () => {
  const store = useStore();

  const [activeTab, setActiveTab] = useState<number | undefined>();
  const [createDialog, setCreateDialog] = useState<boolean>(false);

  const { data, refetch } = useQuery({
    queryKey: ["tabs"],
    queryFn: () => store.readAllTabs(),
  });

  return (
    <Container>
      <TabDialog
        state={activeTab}
        name={data?.find((t) => t.id === activeTab)?.name}
        onClose={() => setActiveTab(undefined)}
      />
      <CreateTabDialog
        open={createDialog}
        onClose={() => setCreateDialog(false)}
        onCreate={() => {
          setCreateDialog(false);
          refetch();
        }}
      />
      <Stack flexGrow={1} gap={2}>
        <Stack
          justifyContent="space-between"
          direction="row"
          alignItems="center"
        >
          <Typography variant="h4">Ůčty</Typography>
          <Button onClick={() => setCreateDialog(true)}>Přidat</Button>
        </Stack>

        <List>
          {data?.map((t) => (
            <ListItem disablePadding>
              <ListItemButton onClick={() => setActiveTab(t.id)}>
                <Stack
                  justifyContent="space-between"
                  direction="row"
                  flexGrow={1}
                  alignItems="center"
                >
                  <Typography variant="body1">{t.name}</Typography>
                  <Typography variant="body2">#{t.id}</Typography>
                </Stack>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Stack>
    </Container>
  );
};

const TabDialog = ({
  state,
  name,
  onClose,
}: {
  state: number | undefined;
  name: string | undefined;
  onClose: () => void;
}) => {
  const store = useStore();

  const { data, error } = useQuery({
    enabled: state !== undefined,
    queryKey: ["tabs", state],
    queryFn: async () =>
      state === undefined
        ? undefined
        : await store.readMethodTransactions(`tab_${state}`),
  });

  const sum = data?.reduce((acc, x) => acc + x.amount * x.price, 0);

  return (
    <Dialog onClose={onClose} open={state !== undefined}>
      <DialogTitle>{name}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ minWidth: "30vw" }}>
        <Stack gap={2}>
          <Typography variant="body1" fontWeight="bold">
            Celkem: {sum} Kč
          </Typography>
          <ErrorAlert e={error} />
          <List sx={{ pt: 0 }}>
            {data?.map((t) => (
              <ListItem disablePadding key={t.id} dense>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  flexGrow={1}
                >
                  <Typography variant="body2">
                    {t.amount} × {t.name}
                  </Typography>
                  <Typography variant="body2">
                    {t.amount * t.price} Kč
                  </Typography>
                </Stack>
              </ListItem>
            ))}
          </List>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

const CreateTabDialog = ({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
}) => {
  const store = useStore();
  const openSnackbar = useSnackbar();

  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Vytvořit ůčet</DialogTitle>

      <DialogContent>
        <Stack gap={1}>
          <Typography color="red" variant="body1">
            Zákaz vytváření účtů! Účty může vytvořit jen Denis
          </Typography>
          <TextField
            label="Jméno"
            variant="standard"
            size="small"
            onChange={(e) => setValue(e.target.value)}
            value={value}
            fullWidth
          />
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              onClick={async () => {
                if (!confirm("Opravdu???")) {
                  onClose();
                  return;
                }

                setLoading(true);
                try {
                  await store.addTab({ name: value });
                } catch (e) {
                  openSnackbar(
                    "error",
                    e instanceof Error ? e.message : String(e)
                  );
                } finally {
                  setLoading(false);
                  onCreate();
                }
              }}
              disabled={loading}
            >
              Vytvořit
            </Button>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
