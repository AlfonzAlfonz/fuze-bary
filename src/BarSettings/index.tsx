import {
  Button,
  Card,
  Input,
  Label,
  TextField,
  Typography,
} from "@heroui/react";
import { useStore, type Store } from "../store/db";
import { stringify } from "csv-stringify/browser/esm/sync";
import { Header } from "../Layout/Header";

export const BarSettings = () => {
  const store = useStore();

  return (
    <div className="mx-auto w-full max-w-4xl px-0 md:px-6">
      <Header>Nastavení</Header>
      <div className="flex flex-col gap-4">
        <Card>
          <Card.Content>
            <div className="flex flex-col gap-4">
              <Typography type="h5">Exportovat data</Typography>
              <Button className="self-start" onPress={() => exportData(store)}>
                Exportovat
              </Button>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content>
            <div className="flex flex-col gap-4">
              <Typography type="h5">Epocha</Typography>

              <TextField>
                <Label>Epocha</Label>
                <Input />
              </TextField>

              <Button className="self-start">Uložit</Button>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
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
