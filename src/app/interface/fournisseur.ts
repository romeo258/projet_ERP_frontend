import { Product } from "./product";

export interface Fournisseur {
  id: number;
  code: string;
  name: string;
  address: string;
  city: string;
  email: string;
  phone: string;
  products?: Product[];
}
