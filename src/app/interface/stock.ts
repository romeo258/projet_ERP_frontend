export interface Stock {
  id: number;
  stockNumber:string;
  createdAt: Date;
  prixAchat: number;
  prixVente: number;
  quantityIn: number;
  quantityOut: number;
  action: string;
}
