import {
  Badge,
  Button,
  Card,
  Drawer,
  ProgressBar,
  Typography,
} from "@heroui/react";
import { ErrorAlert } from "../ErrorAlert";
import { Header } from "../Layout/Header";
import { useApplication } from "../useApplication";
import { OrderReview } from "./OrderReview";

export const BarMenu = () => {
  const application = useApplication();
  const { priceData, colorIndexes, actions, order } = application;

  const categorisedPriceData =
    priceData.data && groupBy(Object.values(priceData.data), (x) => x.category);

  return (
    <>
      <div className="flex grow flex-col">
        <Header>Bar</Header>
        <div className="mx-4">
          <ErrorAlert e={priceData.error} />
          {priceData.isLoading && (
            <ProgressBar isIndeterminate aria-label="Načítání">
              <ProgressBar.Track>
                <ProgressBar.Fill />
              </ProgressBar.Track>
            </ProgressBar>
          )}
        </div>
        <div className="flex gap-4 flex-col grow mx-4">
          {categorisedPriceData &&
            Object.entries(categorisedPriceData).map(([key, values]) => (
              <div key={key} className="flex flex-col gap-2">
                <Typography type="h5">{key}</Typography>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {values.map((item, i) => {
                    const amount = order.find(
                      (itm) => itm.itemId === item.id,
                    )?.amount;
                    return (
                      <Badge.Anchor>
                        <Button
                          key={i}
                          onPress={() => {
                            actions.addToOrder(item.id);
                          }}
                          style={{
                            backgroundColor:
                              COLORS[
                                colorIndexes!.indexOf(item.category) %
                                  COLORS.length
                              ],
                          }}
                          className="flex h-auto w-full flex-col items-start justify-between gap-1 whitespace-normal p-3 text-left text-black"
                        >
                          <span className="font-bold">{item.name}</span>
                          <span>{item.price} Kč</span>
                        </Button>
                        {amount && (
                          <Badge
                            color="default"
                            placement="bottom-right"
                            size="lg"
                            className="transform translate-0 rounded-none rounded-tl-3xl rounded-br-2xl border-0"
                          >
                            {amount}
                          </Badge>
                        )}
                      </Badge.Anchor>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>

        <Card className="block md:hidden sticky bottom-0">
          <Drawer>
            <Button fullWidth>Odeslat</Button>
            <Drawer.Backdrop>
              <Drawer.Content placement="bottom">
                <Drawer.Dialog className="overflow-scroll">
                  <OrderReview application={application} />
                </Drawer.Dialog>
              </Drawer.Content>
            </Drawer.Backdrop>
          </Drawer>
        </Card>
      </div>
      <Card className="hidden md:flex sticky top-0 min-w-75 flex-col justify-between p-0">
        <OrderReview application={application} />
      </Card>
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
  keySelector: (itm: T) => U,
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
