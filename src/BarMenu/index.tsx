import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ErrorAlert } from "../ErrorAlert";
import { useStore } from "../store/db";
import { useApplication } from "../useApplication";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import RemoveIcon from "@mui/icons-material/Remove";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

type PaymentState =
  | ["cash"]
  | ["card"]
  | ["tab"]
  | ["tab", id: number]
  | undefined;

export const BarMenu = () => {
  const { priceData, colorIndexes, order, orderSubmitting, actions } =
    useApplication();

  const store = useStore();

  const { data, error, isLoading } = useQuery({
    queryKey: ["tabs"],
    queryFn: () => store.readAllTabs(),
  });

  const [paymentState, setPaymentState] = useState<PaymentState>();

  const categorisedPriceData =
    priceData.data && groupBy(Object.values(priceData.data), (x) => x.category);

  const [crew, setCrew] = useState(false);
  console.log(crew);
  return (
    <>
      <Stack gap={2} sx={{ flexGrow: 1 }}>
        <Typography variant="h4" sx={{ marginTop: 2 }}>
          Nabídka
        </Typography>
        <ErrorAlert e={priceData.error} />
        {priceData.isLoading && <LinearProgress />}
        {categorisedPriceData &&
          Object.entries(categorisedPriceData).map(([key, values]) => (
            <Stack key={key} gap={1}>
              <Typography variant="h5">{key}</Typography>
              <Grid container spacing={1}>
                {values.map((item, i) => (
                  <Grid size={4}>
                    <Card
                      key={i}
                      sx={{
                        backgroundColor:
                          COLORS[
                            colorIndexes!.indexOf(item.category) % COLORS.length
                          ],
                        color: "black",
                      }}
                    >
                      <CardActionArea
                        sx={{ p: 1.5 }}
                        onClick={() => actions.addToOrder(item.id)}
                      >
                        <Stack
                          direction="column"
                          justifyContent="space-between"
                        >
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold" }}
                          >
                            {item.name}
                          </Typography>
                          <Typography variant="body1">
                            {item.price} Kč
                          </Typography>
                        </Stack>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          ))}
      </Stack>
      <Stack
        gap={2}
        sx={{ flexGrow: 0, flexShrink: 0 }}
        pr={2}
        height="93vh"
        maxHeight="93vh"
        position="sticky"
        top={0}
        justifyContent="space-between"
        overflow="auto"
      >
        <Stack gap={2} sx={{ width: "300px" }}>
          <Typography variant="h4" sx={{ pt: 2 }}>
            Objednávka
          </Typography>
          <Stack gap={1}>
            {priceData.data &&
              order.map((item, i) => (
                <Card key={i}>
                  <Stack
                    direction="row"
                    gap={3}
                    alignItems="stretch"
                    justifyContent="space-between"
                  >
                    <Stack direction="row" gap={1} py={1} px={2}>
                      <Typography variant="body1">
                        <strong>{item.amount} ×</strong>
                      </Typography>
                      <Typography variant="body1">
                        {priceData.data[item.itemId].name}
                      </Typography>
                    </Stack>

                    <IconButton
                      onClick={() => actions.removeFromOrder(item.itemId)}
                      size="small"
                      sx={{
                        background: "rgba(255, 255, 255, .1)",
                        color: "red",
                        borderRadius: 0,
                        px: 1,
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Stack>
                </Card>
              ))}
          </Stack>
        </Stack>

        <Stack gap={1}>
          <FormControlLabel
            control={
              <Checkbox
                checked={crew}
                onChange={(_, checked) => setCrew(checked)}
              />
            }
            label="Crew sleva (20%)"
          />

          <Stack gap={2}>
            {!!order.length && (
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h5">Celkem</Typography>
                <Typography variant="h5">
                  {order.reduce(
                    (acc, x) =>
                      acc + priceData.data![x.itemId].price * x.amount,
                    0
                  ) * (crew ? 0.8 : 1)}{" "}
                  Kč
                </Typography>
              </Stack>
            )}
            <ToggleButtonGroup
              color="primary"
              value={paymentState?.[0]}
              exclusive
              onChange={(_, v) => setPaymentState([v])}
            >
              <ToggleButton value="cash">Hotově</ToggleButton>
              <ToggleButton value="card">Kartou</ToggleButton>
              <ToggleButton value="tab">
                {data &&
                paymentState &&
                paymentState[0] === "tab" &&
                paymentState[1] !== undefined
                  ? data.find((t) => t.id === paymentState[1])?.name
                  : "Ůčet"}
              </ToggleButton>
            </ToggleButtonGroup>
            <Button
              fullWidth
              variant="contained"
              disabled={
                order.length === 0 ||
                !paymentState ||
                (paymentState[0] === "tab" ? paymentState.length === 1 : false)
              }
              onClick={() => {
                if (!paymentState) return;

                actions.submitOrder(
                  paymentState[0] === "tab"
                    ? `tab_${paymentState[1]!}`
                    : paymentState[0],
                  crew ? 0.8 : 1
                );
                setPaymentState(undefined);
                setCrew(false);
              }}
            >
              Odeslat
            </Button>
            {orderSubmitting && <LinearProgress />}
          </Stack>
        </Stack>
      </Stack>
      <Dialog
        open={
          !!paymentState &&
          paymentState.length === 1 &&
          paymentState[0] === "tab"
        }
        onClose={() => setPaymentState(undefined)}
        maxWidth={false}
      >
        <DialogTitle>Vyber ůčet:</DialogTitle>

        <DialogContent sx={{ minWidth: "30vw" }}>
          <ErrorAlert e={error} />
          {isLoading && <LinearProgress />}
          {data && (
            <List>
              {data.map((t) => (
                <ListItemButton
                  key={t.id}
                  onClick={() => {
                    setPaymentState(["tab", t.id]);
                  }}
                >
                  {t.name}
                </ListItemButton>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const COLORS = [
  "oklch(92.4% 0.12 95.746)",
  "oklch(77.7% 0.152 181.912)",
  "oklch(80.8% 0.114 19.571)",
  "oklch(86.5% 0.127 207.078)",
  "oklch(71.4% 0.203 305.504)",
];

const groupBy = <T, U extends string>(
  array: T[],
  keySelector: (itm: T) => U
) => {
  const result: Record<U, T[]> = {} as never;

  for (const itm of array) {
    const key = keySelector(itm);

    if (!result[key]) {
      result[key] = [];
    }

    result[key].push(itm);
  }

  return result;
};
