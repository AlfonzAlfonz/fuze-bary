import {
  Button,
  Input,
  Label,
  ListBox,
  Modal,
  Table,
  Tabs,
  TextField,
  Typography,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ErrorAlert } from "../ErrorAlert";
import { Header } from "../Layout/Header";
import { useSnackbar } from "../Snackbars";
import { useStore } from "../store/db";
import { formatPrice } from "../utils/price";

export const BarTabs = () => {
  const store = useStore();

  const [activeTab, setActiveTab] = useState<number | undefined>();
  const [createDialog, setCreateDialog] = useState<boolean>(false);

  const { data, refetch } = useQuery({
    queryKey: ["tabs"],
    queryFn: () => store.readAllTabs(),
  });

  return (
    <div className="mx-auto w-full max-w-4xl px-0 md:px-6">
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
      <div className="flex grow flex-col gap-4">
        <Header className="justify-between pr-14">
          <div>Ůčty</div>
          <Button onPress={() => setCreateDialog(true)}>Přidat</Button>
        </Header>

        {data && (
          <ListBox
            aria-label="Ůčty"
            selectionMode="none"
            onAction={(key) => setActiveTab(Number(key))}
          >
            {data.map((t) => (
              <ListBox.Item key={t.id} id={t.id} textValue={t.name}>
                <div className="flex grow items-center justify-between">
                  <Typography type="body">{t.name}</Typography>
                  <Typography type="body-sm">#{t.id}</Typography>
                </div>
              </ListBox.Item>
            ))}
          </ListBox>
        )}
      </div>
    </div>
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
  const itemSums = data?.reduce(
    (acc, x) => ({
      ...acc,
      [x.itemId]: {
        name: x.name,
        amount: (acc[x.itemId]?.amount ?? 0) + x.amount,
        price: (acc[x.itemId]?.price ?? 0) + x.price,
      },
    }),
    {} as Record<string, { name: string; amount: number; price: number }>,
  );

  return (
    <Modal.Backdrop
      isOpen={state !== undefined}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Modal.Container size="cover">
        <Modal.Dialog className={"max-w-3xl"}>
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>{name}</Modal.Heading>
          </Modal.Header>

          <ErrorAlert e={error} />

          <Modal.Body className="flex flex-col">
            <Tabs className="w-full grow">
              <Tabs.ListContainer>
                <Tabs.List aria-label="Options">
                  <Tabs.Tab id="overview">
                    Přehled
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="analytics">
                    Transakce
                    <Tabs.Indicator />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>

              <Tabs.Panel className="p-0 pt-2" id="overview">
                <Table>
                  <Table.ScrollContainer>
                    <Table.Content>
                      <Table.Header>
                        <Table.Column isRowHeader>Položka</Table.Column>
                        <Table.Column>Počet</Table.Column>
                        <Table.Column>Cena</Table.Column>
                        <Table.Column>Suma</Table.Column>
                      </Table.Header>

                      <Table.Body>
                        <Table.Row key={"sum"}>
                          <Table.Cell>
                            <strong>Celkem</strong>
                          </Table.Cell>
                          <Table.Cell />
                          <Table.Cell />
                          <Table.Cell>
                            <strong>{sum && formatPrice(sum)}</strong>
                          </Table.Cell>
                        </Table.Row>
                        {Object.values(itemSums ?? {}).map((t, i) => (
                          <Table.Row key={i}>
                            <Table.Cell>{t.name}</Table.Cell>
                            <Table.Cell>{t.amount}</Table.Cell>
                            <Table.Cell>{formatPrice(t.price)}</Table.Cell>
                            <Table.Cell>
                              {formatPrice(t.amount * t.price)}
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Content>
                  </Table.ScrollContainer>
                </Table>
              </Tabs.Panel>
              <Tabs.Panel className="p-0 pt-2" id="analytics">
                <Table>
                  <Table.ScrollContainer>
                    <Table.Content>
                      <Table.Header>
                        <Table.Column isRowHeader>Položka</Table.Column>
                        <Table.Column>Počet</Table.Column>
                        <Table.Column>Cena</Table.Column>
                        <Table.Column>Datum vytvoření</Table.Column>
                      </Table.Header>

                      <Table.Body>
                        {data?.map((t, i) => (
                          <Table.Row key={i}>
                            <Table.Cell>{t.name}</Table.Cell>
                            <Table.Cell>{t.amount}</Table.Cell>
                            <Table.Cell>
                              {formatPrice(t.price * t.amount)}
                            </Table.Cell>
                            <Table.Cell className={"text-nowrap"}>
                              {new Date(t.createdAt).toLocaleString("cs")}
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Content>
                  </Table.ScrollContainer>
                </Table>
              </Tabs.Panel>
              <Tabs.Panel className="pt-4" id="reports">
                <p>Generate and download detailed reports.</p>
              </Tabs.Panel>
            </Tabs>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
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
    <Modal.Backdrop
      isOpen={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <Modal.Container>
        <Modal.Dialog>
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Vytvořit ůčet</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <TextField value={value} onChange={setValue}>
              <Label>Jméno</Label>
              <Input variant="secondary" />
            </TextField>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onPress={onClose}>
              Cancel
            </Button>
            <Button
              isDisabled={loading}
              onPress={async () => {
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
                    e instanceof Error ? e.message : String(e),
                  );
                } finally {
                  setLoading(false);
                  onCreate();
                }
              }}
            >
              Vytvořit
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};
