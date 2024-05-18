import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { NavbarComponent } from './component/navbar/navbar.component';
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
import { CommandComponent } from './component/command/command.component';
import { AgenciesComponent } from './component/agency/agencies/agencies.component';
import { NewagencyComponent } from './component/agency/newagency/newagency.component';
import { AgencyDetailComponent } from './component/agency/agency-detail/agency-detail.component';
import { CategoryComponent } from './component/category/category.component';
import { ProductComponent } from './component/product/product.component';
import { FournisseurComponent } from './component/fournisseur/fournisseur.component';
import { InventoryComponent } from './component/inventory/inventory.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'resetpassword', component: ResetpasswordComponent },
  { path: 'user/verify/account/:key', component: VerifyComponent },
  { path: 'user/verify/password/:key', component: VerifyComponent },

  { path: 'agencies', component: AgenciesComponent, canActivate: [AuthenticationGuard] },
  { path: 'agencies/new', component: NewagencyComponent, canActivate: [AuthenticationGuard] },
  { path: 'agencies/:id', component: AgencyDetailComponent, canActivate: [AuthenticationGuard] },

  { path: 'categories', component: CategoryComponent, canActivate: [AuthenticationGuard] },

  { path: 'products', component: ProductComponent, canActivate: [AuthenticationGuard] },

  { path: 'fournisseurs', component: FournisseurComponent, canActivate: [AuthenticationGuard] },

  { path: 'inventories', component: InventoryComponent, canActivate: [AuthenticationGuard] },

  { path: 'customers', component: CustomersComponent, canActivate: [AuthenticationGuard] },
  { path: 'customers/new', component: NewcustomerComponent, canActivate: [AuthenticationGuard] },
  { path: 'customers/:id', component: CustomerDetailComponent, canActivate: [AuthenticationGuard] },

  { path: 'invoices', component: InvoicesComponent, canActivate: [AuthenticationGuard] },
  { path: 'invoices/new', component: NewinvoiceComponent, canActivate: [AuthenticationGuard] },
  { path: 'invoices/:id/:invoiceNumber', component: InvoiceDetailComponent, canActivate: [AuthenticationGuard] },

  { path: 'orders', component: CommandComponent, canActivate: [AuthenticationGuard] },

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
