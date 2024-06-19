import { Agency } from "./agency";
import { Category } from "./category";
import { Fournisseur } from "./fournisseur";
import { User } from "./user";

export interface CombinedData {
  categories: Category[];
  agencies: Agency[];
  fournisseurs: Fournisseur[];
  user: User;
}
