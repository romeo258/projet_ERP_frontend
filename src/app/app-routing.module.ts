import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { ProfileComponent } from './component/profile/profile.component';
import { RegisterComponent } from './component/register/register.component';
import { ResetpasswordComponent } from './component/resetpassword/resetpassword.component';
import { VerifyComponent } from './component/verify/verify.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { CustomersComponent } from './component/customer/customers/customers.component';
import { NewcustomerComponent } from './component/customer/newcustomer/newcustomer.component';
import { CustomerDetailComponent } from './component/customer/customer-detail/customer-detail.component';
import { UsersComponent } from './component/user/users/users.component';
import { UserDetailComponent } from './component/user/user-detail/user-detail.component';
import { InvoicesComponent } from './component/invoice/invoices/invoices.component';
import { NewinvoiceComponent } from './component/invoice/newinvoice/newinvoice.component';
import { InvoiceDetailComponent } from './component/invoice/invoice-detail/invoice-detail.component';
import { AgenciesComponent } from './component/agency/agencies/agencies.component';
import { NewagencyComponent } from './component/agency/newagency/newagency.component';
import { AgencyDetailComponent } from './component/agency/agency-detail/agency-detail.component';
import { CategoriesComponent } from './component/category/categories/categories.component';
import { NewcategoryComponent } from './component/category/newcategory/newcategory.component';
import { CategoryDetailComponent } from './component/category/category-detail/category-detail.component';
import { FournisseursComponent } from './component/fournisseur/fournisseurs/fournisseurs.component';
import { NewfournisseurComponent } from './component/fournisseur/newfournisseur/newfournisseur.component';
import { FournisseurDetailComponent } from './component/fournisseur/fournisseur-detail/fournisseur-detail.component';
import { ProductsComponent } from './component/product/products/products.component';
import { NewproductComponent } from './component/product/newproduct/newproduct.component';
import { ProductDetailComponent } from './component/product/product-detail/product-detail.component';
import { InventoriesComponent } from './component/inventory/inventories/inventories.component';
import { NewinventoryComponent } from './component/inventory/newinventory/newinventory.component';
import { InventoryDetailComponent } from './component/inventory/inventory-detail/inventory-detail.component';
import { InvoicePrintComponent } from './component/invoice/invoice-print/invoice-print.component';
import { OrdersComponent } from './component/order/orders/orders.component';
import { OrderDetailComponent } from './component/order/order-detail/order-detail.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'resetpassword', component: ResetpasswordComponent },
  { path: 'user/verify/account/:key', component: VerifyComponent },
  { path: 'user/verify/password/:key', component: VerifyComponent },

  { path: 'agencies', component: AgenciesComponent, canActivate: [AuthenticationGuard] },
  { path: 'agencies/new', component: NewagencyComponent, canActivate: [AuthenticationGuard] },
  { path: 'agencies/:id', component: AgencyDetailComponent, canActivate: [AuthenticationGuard] },

  { path: 'categories', component: CategoriesComponent, canActivate: [AuthenticationGuard] },
  { path: 'categories/new', component: NewcategoryComponent, canActivate: [AuthenticationGuard] },
  { path: 'categories/:id', component: CategoryDetailComponent, canActivate: [AuthenticationGuard] },

  { path: 'fournisseurs', component: FournisseursComponent, canActivate: [AuthenticationGuard] },
  { path: 'fournisseurs/new', component: NewfournisseurComponent, canActivate: [AuthenticationGuard] },
  { path: 'fournisseurs/:id', component: FournisseurDetailComponent, canActivate: [AuthenticationGuard] },

  { path: 'products', component: ProductsComponent, canActivate: [AuthenticationGuard] },
  { path: 'products/new', component: NewproductComponent, canActivate: [AuthenticationGuard] },
  { path: 'products/:id', component: ProductDetailComponent, canActivate: [AuthenticationGuard] },

  { path: 'inventories', component: InventoriesComponent, canActivate: [AuthenticationGuard] },
  { path: 'inventories/new', component: NewinventoryComponent, canActivate: [AuthenticationGuard] },
  { path: 'inventories/:id', component: InventoryDetailComponent, canActivate: [AuthenticationGuard] },

  { path: 'customers', component: CustomersComponent, canActivate: [AuthenticationGuard] },
  { path: 'customers/new', component: NewcustomerComponent, canActivate: [AuthenticationGuard] },
  { path: 'customers/:id', component: CustomerDetailComponent, canActivate: [AuthenticationGuard] },

  { path: 'invoices', component: InvoicesComponent, canActivate: [AuthenticationGuard] },
  { path: 'invoices/new', component: NewinvoiceComponent, canActivate: [AuthenticationGuard] },
  { path: 'invoices/:id', component: InvoiceDetailComponent, canActivate: [AuthenticationGuard] },
  { path: 'invoices/:id/:invoiceNumber', component: InvoicePrintComponent, canActivate: [AuthenticationGuard] },

  { path: 'orders', component: OrdersComponent, canActivate: [AuthenticationGuard] },
  { path: 'orders/:id', component: OrderDetailComponent, canActivate: [AuthenticationGuard] },


  { path: 'users', component: UsersComponent, canActivate: [AuthenticationGuard] },
  { path: 'users/:id', component: UserDetailComponent, canActivate: [AuthenticationGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard] },

  { path: '', component: HomeComponent, canActivate: [AuthenticationGuard] },
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
