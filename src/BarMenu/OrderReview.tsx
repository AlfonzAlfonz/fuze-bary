import {
  Button,
  Card,
  Checkbox,
  ListBox,
  Modal,
  ProgressBar,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Minus } from "lucide-react";
import { useState } from "react";
import { config } from "../config";
import { ErrorAlert } from "../ErrorAlert";
import { Header } from "../Layout/Header";
import { useStore } from "../store/db";
import type { Application } from "../useApplication";
import { formatPrice } from "../utils/price";

type PaymentState =
  | ["cash"]
  | ["card"]
  | ["tab"]
  | ["tab", id: number]
  | undefined;

interface Props {
  application: Application;
  close?: () => void;
}

export const OrderReview = ({
  close,
  application: { order, priceData, actions, orderSubmitting },
}: Props) => {
  const store = useStore();

  const [crew, setCrew] = useState(false);

  const { data, error, isLoading } = useQuery({
    queryKey: ["tabs"],
    queryFn: () => store.readAllTabs(),
  });

  const [paymentState, setPaymentState] = useState<PaymentState>();

  return (
    <>
      <div className="flex flex-col">
        <Header>Souhrn</Header>
        <div className="flex flex-col gap-2 mx-2">
          {priceData.data &&
            order?.map((item, i) => (
              <Card
                key={i}
                variant="secondary"
                className="flex flex-row justify-between items-center p-0"
              >
                <div className="flex flex-row gap-2 px-2">
                  <Typography type="body">
                    <strong>{item.amount} ×</strong>
                  </Typography>
                  <Typography type="body">
                    {priceData.data[item.itemId].name}
                  </Typography>
                </div>

                <Button
                  isIconOnly
                  variant="ghost"
                  onPress={() => actions.removeFromOrder(item.itemId)}
                  size="md"
                >
                  <Minus />
                </Button>
              </Card>
            ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 m-4">
        {!!config.crewDiscount && (
          <Checkbox isSelected={crew} onChange={setCrew} variant="secondary">
            <Checkbox.Content>
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              Crew sleva (20%)
            </Checkbox.Content>
          </Checkbox>
        )}

        {!!order.length && (
          <div className="flex flex-row justify-between">
            <Typography type="h5">Celkem</Typography>
            <Typography type="h5">
              {formatPrice(
                order.reduce(
                  (acc, x) => acc + priceData.data![x.itemId].price * x.amount,
                  0,
                ) * (crew ? 1 - config.crewDiscount : 1),
              )}
            </Typography>
          </div>
        )}
        <ToggleButtonGroup
          selectionMode="single"
          fullWidth
          selectedKeys={paymentState?.[0] ? [paymentState[0]] : []}
          onSelectionChange={(keys) => {
            const v = [...keys][0] as "cash" | "card" | "tab" | undefined;
            setPaymentState(v ? ([v] as PaymentState) : undefined);
          }}
        >
          {config.paymentMethods.includes("cash") && (
            <ToggleButton id="cash">Hotově</ToggleButton>
          )}
          {config.paymentMethods.includes("card") && (
            <ToggleButton id="card">
              <ToggleButtonGroup.Separator />
              Kartou
            </ToggleButton>
          )}
          {config.paymentMethods.includes("tab") && (
            <ToggleButton id="tab">
              <ToggleButtonGroup.Separator />
              {data &&
              paymentState &&
              paymentState[0] === "tab" &&
              paymentState[1] !== undefined
                ? data.find((t) => t.id === paymentState[1])?.name
                : "Ůčet"}
            </ToggleButton>
          )}
        </ToggleButtonGroup>
        <Button
          fullWidth
          isDisabled={
            order.length === 0 ||
            !paymentState ||
            (paymentState[0] === "tab" ? paymentState.length === 1 : false)
          }
          onPress={() => {
            if (!paymentState) return;

            actions.submitOrder(
              paymentState[0] === "tab"
                ? `tab_${paymentState[1]!}`
                : paymentState[0],
              crew ? 1 - config.crewDiscount : 1,
            );
            setPaymentState(undefined);
            setCrew(false);
            close?.();
          }}
        >
          Odeslat
        </Button>
        {orderSubmitting && (
          <ProgressBar isIndeterminate aria-label="Odesílání">
            <ProgressBar.Track>
              <ProgressBar.Fill />
            </ProgressBar.Track>
          </ProgressBar>
        )}
      </div>
      <Modal.Backdrop
        isOpen={
          !!paymentState &&
          paymentState.length === 1 &&
          paymentState[0] === "tab"
        }
        onOpenChange={(open) => {
          if (!open) setPaymentState(undefined);
        }}
      >
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Vyber ůčet:</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <div>
                <ErrorAlert e={error} />
                {isLoading && (
                  <ProgressBar isIndeterminate aria-label="Načítání">
                    <ProgressBar.Track>
                      <ProgressBar.Fill />
                    </ProgressBar.Track>
                  </ProgressBar>
                )}
                {data && (
                  <ListBox
                    aria-label="Ůčty"
                    selectionMode="none"
                    onAction={(key) => setPaymentState(["tab", Number(key)])}
                  >
                    {data.map((t) => (
                      <ListBox.Item key={t.id} id={t.id} textValue={t.name}>
                        {t.name}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                )}
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
};
