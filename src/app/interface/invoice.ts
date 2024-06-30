import { Customer } from "./customer";
import { LigneCommande } from "./ligneCommande";

export interface Invoice {
  id: number;
  invoiceNumber: string;
  services: string;
  status: string;
  total: number;
  createdAt: Date;
  agencyCode: string;
  ligneCommandes?: LigneCommande[];
  customer?: Customer;
}