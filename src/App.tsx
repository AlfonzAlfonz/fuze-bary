import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useApplication } from "./useApplication";
import LinearProgress from "@mui/material/LinearProgress";

function App() {
  const { priceData, colorIndexes, order, orderSubmitting, actions } =
    useApplication();

  return (
    <Stack sx={{ minHeight: "100vh" }} direction="row" gap={2} py={2}>
      <Card sx={{ flexGrow: 1 }}>
        <CardContent>Sidebar</CardContent>
      </Card>
      <Stack gap={2} sx={{ flexGrow: 6 }}>
        <Typography variant="h4">Nabídka</Typography>
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
      <Stack gap={2} sx={{ flexGrow: 4 }} pr={2}>
        <Typography variant="h4">Objednávka</Typography>
        {priceData.data &&
          order.map((item, i) => (
            <Card key={i} sx={{ p: 1 }}>
              <Stack direction="row" gap={1} alignItems="center">
                <Typography variant="body1">
                  <strong>{item.amount} ×</strong>
                </Typography>
                <Typography variant="body1">
                  {priceData.data[item.itemId].name}
                </Typography>
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
        </Stack>
        {orderSubmitting && <LinearProgress />}
      </Stack>
    </Stack>
  );
}

export default App;

const COLORS = [
  "oklch(92.4% 0.12 95.746)",
  "oklch(80.8% 0.114 19.571)",
  "oklch(86.5% 0.127 207.078)",
  "oklch(71.4% 0.203 305.504)",
  "oklch(77.7% 0.152 181.912)",
];
