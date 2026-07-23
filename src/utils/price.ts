import { config } from "../config";

export const formatPrice = (price: number) => `${price} ${config.currency}`;
