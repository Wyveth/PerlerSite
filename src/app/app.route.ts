import { Routes } from '@angular/router';
import { LayoutComponent } from './Shared/Component/layout/layout.component';
import { AuthAdminGuardService } from './Shared/Guard/authAdmin-guard.service';
import { AuthGuardService } from './Shared/Guard/auth-guard.service';

export const routes: Routes = [
    {
      path: '',
      component: LayoutComponent,
      children: [
        { 
            path: 'auth/signup', loadComponent() {
            return import('./Component/auth/signup/signup.component').then(
                (m) => m.SignupComponent,
            );
            }
        },
        { 
            path: 'auth/signin', loadComponent() {
                    return import('./Component/auth/signin/signin.component').then(
                        (m) => m.SigninComponent,
                    );
            }
        },
        { 
            path: 'home', loadComponent() {
                    return import('./Component/home/home.component').then(
                        (m) => m.HomeComponent,
                    );
            }
        },
        { 
          path: 'tags', canActivate: [AuthAdminGuardService], loadComponent() {
          return import('./Component/Admin/tag-list/tag-list.component').then(
            (m) => m.TagListComponent,
          );
        }
        },
        { 
          path: 'tags/new', canActivate: [AuthAdminGuardService], loadComponent() {
          return import('./Component/Admin/tag-form/tag-form.component').then(
            (m) => m.TagFormComponent,
          );}
        },
        { 
          path: 'tags/edit/:id', canActivate: [AuthAdminGuardService], loadComponent() {
          return import('./Component/Admin/tag-form/tag-form.component').then(
            (m) => m.TagFormComponent,
          );
        }
        },
        { 
          path: 'perlerTypes', canActivate: [AuthAdminGuardService], loadComponent() {
          return import('./Component/Admin/perlertype-list/perlertype-list.component').then(
            (m) => m.PerlertypeListComponent,
          );
        }
        },
        { 
          path: 'perlerTypes/new', canActivate: [AuthAdminGuardService], loadComponent() {
          return import('./Component/Admin/perlertype-form/perlertype-form.component').then(
            (m) => m.PerlertypeFormComponent,
          );
        }
        },
        { 
          path: 'perlerTypes/edit/:id', canActivate: [AuthAdminGuardService], loadComponent() {
          return import('./Component/Admin/perlertype-form/perlertype-form.component').then(
            (m) => m.PerlertypeFormComponent,
          );
        }
        },
        { 
          path: 'products', canActivate: [AuthAdminGuardService], loadComponent() {
          return import('./Component/Admin/product-list/product-list.component').then(
            (m) => m.ProductListComponent,
          );
        }
        },
        { 
          path: 'products/new', canActivate: [AuthAdminGuardService], loadComponent() {
          return import('./Component/Admin/product-form/product-form.component').then(
            (m) => m.ProductFormComponent,
          );
        }
        },
        { 
          path: 'products/edit/:id', canActivate: [AuthAdminGuardService], loadComponent() {
          return import('./Component/Admin/product-form/product-form.component').then(
            (m) => m.ProductFormComponent,
          );
        }
        },
        { 
          path: 'products/viewA/:id', canActivate: [AuthAdminGuardService], loadComponent() {
          return import('./Component/single-product/single-product.component').then(
            (m) => m.SingleProductComponent,
          );
        }
        },
        { 
          path: 'products/view/:id', loadComponent() {
          return import('./Component/single-product/single-product.component').then(
            (m) => m.SingleProductComponent,
          );
        }
        },
        { 
          path: 'contacts', canActivate: [AuthAdminGuardService], loadComponent() {
          return import('./Component/Admin/contact-list/contact-list.component').then(
            (m) => m.ContactListComponent,
          );
        }
        },
        { 
          path: 'users', canActivate: [AuthAdminGuardService], loadComponent() {
          return import('./Component/Admin/user-list/user-list.component').then(
            (m) => m.UserListComponent,
          );
        }
        },
        { 
          path: 'users/editA/:id', canActivate: [AuthAdminGuardService], loadComponent() {
          return import('./Component/Admin/user-edit/user-edit.component').then(
            (m) => m.UserEditComponent,
          );
        }
        },
        { 
          path: 'users/edit/:id', canActivate: [AuthGuardService], loadComponent() {
          return import('./Component/Admin/user-edit/user-edit.component').then(
            (m) => m.UserEditComponent,
          );
        }
        },
        { 
          path: 'profil/:id', canActivate: [AuthGuardService], loadComponent() {
          return import('./Component/profil/profil.component').then(
            (m) => m.ProfilComponent,
          );
        }
        },
        { 
          path: '', loadComponent() {
          return import('./Component/home/home.component').then(
            (m) => m.HomeComponent,
          );
        }
        },
        { 
          path: '**', 
          redirectTo: 'home' 
        }
      ]
    }
  ];
    