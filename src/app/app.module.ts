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
import { CustomerComponent } from './component/customer/customer.component';
import { CustomersComponent } from './component/customers/customers.component';
import { TokenInterceptor } from './interceptor/token.interceptor';

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
    CustomerComponent,
    CustomersComponent
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
