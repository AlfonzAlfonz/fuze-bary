export type Item = {
  id: string;
  name: string;
  price: number;
  category: string;
};

export type OrderItem = {
  itemId: string;
  amount: number;
};

export type Transaction = {
  itemId: string;
  name: string;
  amount: number;
  price: number;
  createdAt: string;
  method: "cash" | "card";
};
