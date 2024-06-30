import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { LoginComponent } from './component/login/login.component';
import { FooterComponent } from './component/footer/footer.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './component/profile/profile.component';
import { RegisterComponent } from './component/register/register.component';
import { ResetpasswordComponent } from './component/resetpassword/resetpassword.component';
import { VerifyComponent } from './component/verify/verify.component';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { CustomersComponent } from './component/customer/customers/customers.component';
import { StatsComponent } from './component/stats/stats.component';
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
import { ExtractArrayValue } from './pipes/extractvalue.pipe';
import { NewcategoryComponent } from './component/category/newcategory/newcategory.component';
import { CategoryDetailComponent } from './component/category/category-detail/category-detail.component';
import { CategoriesComponent } from './component/category/categories/categories.component';
import { NewfournisseurComponent } from './component/fournisseur/newfournisseur/newfournisseur.component';
import { FournisseursComponent } from './component/fournisseur/fournisseurs/fournisseurs.component';
import { FournisseurDetailComponent } from './component/fournisseur/fournisseur-detail/fournisseur-detail.component';
import { ProductDetailComponent } from './component/product/product-detail/product-detail.component';
import { ProductsComponent } from './component/product/products/products.component';
import { NewproductComponent } from './component/product/newproduct/newproduct.component';
import { InventoriesComponent } from './component/inventory/inventories/inventories.component';
import { InventoryDetailComponent } from './component/inventory/inventory-detail/inventory-detail.component';
import { NewinventoryComponent } from './component/inventory/newinventory/newinventory.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { InvoicePrintComponent } from './component/invoice/invoice-print/invoice-print.component';
import { OrdersComponent } from './component/order/orders/orders.component';
import { OrderDetailComponent } from './component/order/order-detail/order-detail.component';

@NgModule({
  declarations: [
    ExtractArrayValue,
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
    NewcategoryComponent,
    CategoryDetailComponent,
    CategoriesComponent,
    NewfournisseurComponent,
    FournisseursComponent,
    FournisseurDetailComponent,
    ProductDetailComponent,
    ProductsComponent,
    NewproductComponent,
    InventoriesComponent,
    InventoryDetailComponent,
    NewinventoryComponent,
    InvoicePrintComponent,
    OrdersComponent,
    OrderDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    NgSelectModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
