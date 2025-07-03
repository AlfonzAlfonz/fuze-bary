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

export const BarMenu = () => {
  const { priceData, colorIndexes, order, orderSubmitting, actions } =
    useApplication();

  return (
    <>
      <Stack gap={2} sx={{ flexGrow: 6 }}>
        <Typography variant="h4">Nabídka</Typography>
        <ErrorAlert e={priceData.error} />
        {priceData.isLoading && <LinearProgress />}
        {priceData.data &&
          Object.values(priceData.data).map((item, i) => (
            <Card
              key={i}
              sx={{
                backgroundColor: COLORS[colorIndexes!.indexOf(item.category)],
                color: "black",
              }}
            >
              <CardActionArea
                sx={{ p: 1.5 }}
                onClick={() => actions.addToOrder(item.id)}
              >
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body1">{item.name}</Typography>
                  <Typography variant="body1">{item.price} Kč</Typography>
                </Stack>
              </CardActionArea>
            </Card>
          ))}
      </Stack>
      <Stack
        gap={2}
        sx={{ flexGrow: 4 }}
        pr={2}
        height="99vh"
        position="sticky"
        top={0}
      >
        <Typography variant="h4">Objednávka</Typography>
        {priceData.data &&
          order.map((item, i) => (
            <Card key={i} sx={{ p: 1 }}>
              <Stack direction="row" gap={1} alignItems="center">
                <Stack>
                  <Typography variant="body1">
                    <strong>{item.amount} ×</strong>
                  </Typography>
                  <Typography variant="body1">
                    {priceData.data[item.itemId].name}
                  </Typography>
                </Stack>
                <Button
                  onClick={() => actions.removeFromOrder(item.itemId)}
                  size="small"
                >
                  −
                </Button>
              </Stack>
            </Card>
          ))}

        {!!order.length && (
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h5">Celkem</Typography>
            <Typography variant="h5">
              {order.reduce(
                (acc, x) => acc + priceData.data![x.itemId].price * x.amount,
                0
              )}{" "}
              Kč
            </Typography>
          </Stack>
        )}

        <Stack direction="row" gap={1}>
          <Button
            variant="contained"
            onClick={() => actions.submitOrder("cash")}
            disabled={!order.length || orderSubmitting}
          >
            Hotově
          </Button>
          <Button
            variant="contained"
            onClick={() => actions.submitOrder("card")}
            disabled={!order.length || orderSubmitting}
          >
            Kartou
          </Button>
          <TabPayButton
            disabled={!order.length || orderSubmitting}
            onClick={(id) => actions.submitOrder(`tab_${id}`)}
          />
        </Stack>
        {orderSubmitting && <LinearProgress />}
      </Stack>
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

const TabPayButton = ({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: (id: number) => void;
}) => {
  const store = useStore();

  const [open, setOpen] = useState(false);

  const { data, error, isLoading } = useQuery({
    queryKey: ["tabs"],
    queryFn: () => store.readAllTabs(),
  });

  return (
    <>
      <Button
        variant="contained"
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        Ůčet
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth={false}>
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
                    onClick(t.id);
                    setOpen(false);
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
