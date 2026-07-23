import { ProgressBar, Table, Typography } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { ErrorAlert } from "../ErrorAlert";
import { Header } from "../Layout/Header";
import { useStore } from "../store/db";
import type { Tab, Transaction } from "../types";
import { formatPrice } from "../utils/price";

const rowTotal = (t: Transaction) => t.amount * t.price * (t.multiplier ?? 1);

const methodLabel = (
  method: Transaction["method"],
  tabsById: Record<number, string>,
) => {
  if (method === "cash") return "Hotově";
  if (method === "card") return "Kartou";

  const id = Number(method.slice("tab_".length));
  return `Účet: ${tabsById[id] ?? `#${id}`}`;
};

export const Transactions = () => {
  const store = useStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => store.readAllTransactions(),
  });

  const { data: tabs } = useQuery({
    queryKey: ["tabs"],
    queryFn: () => store.readAllTabs(),
  });

  const tabsById = (tabs ?? []).reduce<Record<number, string>>(
    (acc, t: Tab) => ({ ...acc, [t.id]: t.name }),
    {},
  );

  // readAllTransactions returns ascending by id; show newest first.
  const rows = data ? [...data].reverse() : undefined;
  const grandTotal = data?.reduce((acc, t) => acc + rowTotal(t), 0);

  return (
    <div className="mx-auto w-full max-w-4xl px-0 md:px-6">
      <div className="flex grow flex-col">
        <Header>Historie</Header>

        <div className="mx-4">
          <ErrorAlert e={error} />
          {isLoading && (
            <ProgressBar isIndeterminate aria-label="Načítání">
              <ProgressBar.Track>
                <ProgressBar.Fill />
              </ProgressBar.Track>
            </ProgressBar>
          )}
        </div>

        {rows && rows.length === 0 && (
          <Typography type="body" className="mx-4">
            Žádné transakce
          </Typography>
        )}

        {rows && rows.length > 0 && (
          <Table>
            <Table.ScrollContainer>
              <Table.Content>
                <Table.Header>
                  <Table.Column isRowHeader>Položka</Table.Column>
                  <Table.Column>Počet</Table.Column>
                  <Table.Column>Cena</Table.Column>
                  <Table.Column>Suma</Table.Column>
                  <Table.Column>Platba</Table.Column>
                  <Table.Column>Datum</Table.Column>
                </Table.Header>

                <Table.Body>
                  <Table.Row key="sum">
                    <Table.Cell>
                      <strong>Celkem</strong>
                    </Table.Cell>
                    <Table.Cell />
                    <Table.Cell />
                    <Table.Cell>
                      <strong>
                        {grandTotal !== undefined && formatPrice(grandTotal)}
                      </strong>
                    </Table.Cell>
                    <Table.Cell />
                    <Table.Cell />
                  </Table.Row>
                  {rows.map((t) => (
                    <Table.Row key={t.id}>
                      <Table.Cell>{t.name}</Table.Cell>
                      <Table.Cell>{t.amount}</Table.Cell>
                      <Table.Cell>{formatPrice(t.price)}</Table.Cell>
                      <Table.Cell>{formatPrice(rowTotal(t))}</Table.Cell>
                      <Table.Cell>{methodLabel(t.method, tabsById)}</Table.Cell>
                      <Table.Cell className="text-nowrap">
                        {new Date(t.createdAt).toLocaleString("cs")}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        )}
      </div>
    </div>
  );
};
