import { Product } from "./product";

export interface Agency {
  id: number;
  name: string;
  code: string;
  ville: string;
  status: string;
  createdAt: Date;
  products?: Product[];
}
