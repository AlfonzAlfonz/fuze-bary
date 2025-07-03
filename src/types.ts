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
  id: number;
  itemId: string;
  name: string;
  amount: number;
  price: number;
  createdAt: string;
  method: "cash" | "card" | `tab_${number}`;
};

export type Tab = {
  id: number;
  name: string;
};
