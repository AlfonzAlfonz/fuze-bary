import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useStore, type Store } from "../store/db";
import { stringify } from "csv-stringify/browser/esm/sync";

export const BarSettings = () => {
  const store = useStore();

  return (
    <Container>
      <Stack gap={2}>
        <Typography variant="h4">Nastavení</Typography>
        <Card>
          <CardContent>
            <Stack gap={2}>
              <Typography variant="h5">Exportovat data</Typography>
              <Button
                sx={{ alignSelf: "flex-start" }}
                onClick={() => exportData(store)}
              >
                Exportovat
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack gap={2}>
              <Typography variant="h5">Epocha</Typography>

              <TextField label="Epocha" size="small" />

              <Button sx={{ alignSelf: "flex-start" }}>Uložit</Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};

const exportData = async (store: Store) => {
  const trans = await store.readAllTransactions();

  const str = stringify(trans, {
    columns: [
      "itemId",
      "amount",
      "price",
      "name",
      "createdAt",
      "method",
      "id",
      "multiplier",
    ],
  });

  const filename = `${new Date().toISOString()}.csv`;

  const file = new File([str], filename, { type: "text/csv" });

  const url = URL.createObjectURL(file);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  URL.revokeObjectURL(url);
};
