import { Fournisseur } from "./fournisseur";
import { LigneCommande } from "./ligneCommande";
import { Stock } from "./stock";

export interface Product {
  id: number;
  code: string;
  name: string;
  description: string;
  updateAt: Date;
  prixAchat: number;
  prixVente: number;
  quantity: number;
  status: string;
  isActive: boolean;
  ligneCommandes?: LigneCommande[];
  stocks?: Stock[];
}
