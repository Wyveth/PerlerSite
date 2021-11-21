import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';

import { AuthService } from './Shared/Services/auth.service';
import { UserService } from './Shared/Services/user.service';
import { ProductService } from './Shared/Services/product.service';

import { AuthGuardService } from './Shared/Guard/auth-guard.service';
import { ProductListComponent } from './Component/product-list/product-list.component';
import { ProductFormComponent } from './Component/product-form/product-form.component';
import { SingleProductComponent } from './Component/single-product/single-product.component';
import { SignupComponent } from './Component/auth/signup/signup.component';
import { SigninComponent } from './Component/auth/signin/signin.component';
import { HeaderComponent } from './Shared/Component/header/header.component';
import { HomeComponent } from './Component/home/home.component';
import { TagListComponent } from './Component/tag-list/tag-list.component';
import { TagFormComponent } from './Component/tag-form/tag-form.component';
import { TagService } from './Shared/Services/tag.service';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideAnalytics,getAnalytics } from '@angular/fire/analytics';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideMessaging,getMessaging } from '@angular/fire/messaging';
import { providePerformance,getPerformance } from '@angular/fire/performance';
import { provideRemoteConfig,getRemoteConfig } from '@angular/fire/remote-config';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { FileUploadService } from './Shared/Services/UploadFile.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UtilsService } from './Shared/Services/Utils.service';
import { SectionWelcomeComponent } from './Component/section-welcome/section-welcome.component';
import { SectionResumeComponent } from './Component/section-resume/section-resume.component';
import { SectionPortfolioComponent } from './Component/section-portfolio/section-portfolio.component';
import { SectionContactComponent } from './Component/section-contact/section-contact.component';
import { BreadcrumbsComponent } from './Shared/Component/breadcrumbs/breadcrumbs.component';
import { ContactListComponent } from './Component/contact-list/contact-list.component';
import { ContactService } from './Shared/Services/Contact.service';

const appRoutes: Routes = [
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/signin', component: SigninComponent },
  { path: 'home', component: HomeComponent },
  { path: 'tags', canActivate: [AuthGuardService], component: TagListComponent },
  { path: 'tags/new', canActivate: [AuthGuardService], component: TagFormComponent },
  { path: 'tags/edit/:id', canActivate: [AuthGuardService], component: TagFormComponent },
  { path: 'products', canActivate: [AuthGuardService], component: ProductListComponent },
  { path: 'products/new', canActivate: [AuthGuardService], component: ProductFormComponent },
  { path: 'products/edit/:id', canActivate: [AuthGuardService], component: ProductFormComponent },
  { path: 'products/viewA/:id', canActivate: [AuthGuardService], component: SingleProductComponent },
  { path: 'products/view/:id', component: SingleProductComponent },
  { path: 'contacts', canActivate: [AuthGuardService], component: ContactListComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SectionWelcomeComponent,
    SectionResumeComponent,
    SectionPortfolioComponent,
    SectionContactComponent,
    HeaderComponent,
    BreadcrumbsComponent,
    SignupComponent,
    SigninComponent,
    ProductFormComponent,
    ProductListComponent,
    SingleProductComponent,
    TagFormComponent,
    TagListComponent,
    ContactListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideAnalytics(() => getAnalytics()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideStorage(() => getStorage())
  ],
  providers: [AuthService, UserService, AuthGuardService, ProductService, TagService, ContactService, FileUploadService, UtilsService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

