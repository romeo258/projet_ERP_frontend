import { LigneCommande } from "./ligneCommande";

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
  // products?: Product[];
  ligneCommandes?: LigneCommande;
}
