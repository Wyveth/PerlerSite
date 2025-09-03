import { ExtraOptions, Routes } from '@angular/router';
import { LayoutComponent } from './shared/component/layout/layout.component';
import { AuthAdminGuardService } from './shared/guard/authAdmin-guard.service';
import { AuthGuardService } from './shared/guard/auth-guard.service';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'auth/signup',
        loadComponent() {
          return import('./views/auth/signup/signup.component').then(m => m.SignupComponent);
        }
      },
      {
        path: 'auth/signin',
        loadComponent() {
          return import('./views/auth/signin/signin.component').then(m => m.SigninComponent);
        }
      },
      {
        path: 'tags',
        canActivate: [AuthAdminGuardService],
        loadComponent() {
          return import('./views/admin/tag/tag-list/tag-list.component').then(
            m => m.TagListComponent
          );
        }
      },
      {
        path: 'tags/new',
        canActivate: [AuthAdminGuardService],
        loadComponent() {
          return import('./views/admin/tag/tag-form/tag-form.component').then(
            m => m.TagFormComponent
          );
        }
      },
      {
        path: 'tags/edit/:id',
        canActivate: [AuthAdminGuardService],
        loadComponent() {
          return import('./views/admin/tag/tag-form/tag-form.component').then(
            m => m.TagFormComponent
          );
        }
      },
      {
        path: 'perler-types',
        canActivate: [AuthAdminGuardService],
        loadComponent() {
          return import('./views/admin/perlertype/perlertype-list/perlertype-list.component').then(
            m => m.PerlertypeListComponent
          );
        }
      },
      {
        path: 'perler-types/new',
        canActivate: [AuthAdminGuardService],
        loadComponent() {
          return import('./views/admin/perlertype/perlertype-form/perlertype-form.component').then(
            m => m.PerlertypeFormComponent
          );
        }
      },
      {
        path: 'perler-types/edit/:id',
        canActivate: [AuthAdminGuardService],
        loadComponent() {
          return import('./views/admin/perlertype/perlertype-form/perlertype-form.component').then(
            m => m.PerlertypeFormComponent
          );
        }
      },
      {
        path: 'products',
        canActivate: [AuthAdminGuardService],
        loadComponent() {
          return import('./views/admin/product/product-list/product-list.component').then(
            m => m.ProductListComponent
          );
        }
      },
      {
        path: 'products/new',
        canActivate: [AuthAdminGuardService],
        loadComponent() {
          return import('./views/admin/product/product-form/product-form.component').then(
            m => m.ProductFormComponent
          );
        }
      },
      {
        path: 'products/edit/:id',
        canActivate: [AuthAdminGuardService],
        loadComponent() {
          return import('./views/admin/product/product-form/product-form.component').then(
            m => m.ProductFormComponent
          );
        }
      },
      {
        path: 'products/view/:id',
        loadComponent() {
          return import('./views/single-product/single-product.component').then(
            m => m.SingleProductComponent
          );
        }
      },
      {
        path: 'contacts',
        canActivate: [AuthAdminGuardService],
        loadComponent() {
          return import('./views/admin/contact/contact-list/contact-list.component').then(
            m => m.ContactListComponent
          );
        }
      },
      {
        path: 'users',
        canActivate: [AuthAdminGuardService],
        loadComponent() {
          return import('./views/admin/user/user-list/user-list.component').then(
            m => m.UserListComponent
          );
        }
      },
      {
        path: 'users/edit/:id',
        canActivate: [AuthGuardService],
        loadComponent() {
          return import('./views/admin/user/user-edit/user-edit.component').then(
            m => m.UserEditComponent
          );
        }
      },
      {
        path: 'profil/:id',
        canActivate: [AuthGuardService],
        loadComponent() {
          return import('./views/profil/profil.component').then(m => m.ProfilComponent);
        }
      },
      {
        path: '',
        loadComponent() {
          return import('./views/home/home.component').then(m => m.HomeComponent);
        }
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }
];
