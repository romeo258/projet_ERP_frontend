import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { LoginComponent } from './component/login/login.component';
import { FooterComponent } from './component/footer/footer.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from './component/profile/profile.component';
import { RegisterComponent } from './component/register/register.component';
import { ResetpasswordComponent } from './component/resetpassword/resetpassword.component';
import { VerifyComponent } from './component/verify/verify.component';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { CustomersComponent } from './component/customer/customers/customers.component';
import { StatsComponent } from './component/stats/stats.component';
import { CommandComponent } from './component/command/command.component';
import { CustomerDetailComponent } from './component/customer/customer-detail/customer-detail.component';
import { NewcustomerComponent } from './component/customer/newcustomer/newcustomer.component';
import { InvoicesComponent } from './component/invoice/invoices/invoices.component';
import { InvoiceDetailComponent } from './component/invoice/invoice-detail/invoice-detail.component';
import { NewinvoiceComponent } from './component/invoice/newinvoice/newinvoice.component';
import { NewagencyComponent } from './component/agency/newagency/newagency.component';
import { AgencyDetailComponent } from './component/agency/agency-detail/agency-detail.component';
import { AgenciesComponent } from './component/agency/agencies/agencies.component';
import { UsersComponent } from './component/user/users/users.component';
import { UserDetailComponent } from './component/user/user-detail/user-detail.component';
import { CategoryComponent } from './component/category/category.component';
import { ProductComponent } from './component/product/product.component';
import { FournisseurComponent } from './component/fournisseur/fournisseur.component';
import { InventoryComponent } from './component/inventory/inventory.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    SidebarComponent,
    LoginComponent,
    FooterComponent,
    ProfileComponent,
    RegisterComponent,
    ResetpasswordComponent,
    VerifyComponent,
    CustomersComponent,
    StatsComponent,
    CommandComponent,
    CustomerDetailComponent,
    NewcustomerComponent,
    InvoicesComponent,
    InvoiceDetailComponent,
    NewinvoiceComponent,
    NewagencyComponent,
    AgencyDetailComponent,
    AgenciesComponent,
    UsersComponent,
    UserDetailComponent,
    CategoryComponent,
    ProductComponent,
    FournisseurComponent,
    InventoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
