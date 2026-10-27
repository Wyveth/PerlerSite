/**
 * Fournisseurs communs aux tests unitaires.
 * Les services Firebase sont remplacés par des doublures : aucun test n'appelle le réseau.
 */
import { EnvironmentProviders, Provider } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of } from 'rxjs';

import 'src/app/Shared/extension/string.extension';
import resource from 'src/locale/resource.json';
import { AppResource } from 'src/app/Shared/Models/app.resource';
import { AuthService } from 'src/app/api/services/auth.service';
import { ContactService } from 'src/app/api/services/contact.service';
import { FileUploadService } from 'src/app/api/services/upload-file.service';
import { PerlerTypeService } from 'src/app/api/services/perler-type.service';
import { ProductService } from 'src/app/api/services/product.service';
import { TagService } from 'src/app/api/services/tag.service';
import { UserService } from 'src/app/api/services/user.service';
import { User } from 'src/app/api/models/class/user';

/** Projet Firebase fictif (préfixe « demo- ») : rien n'est contacté tant qu'on ne lit/écrit pas */
export const TEST_FIREBASE_CONFIG = {
  apiKey: 'test-api-key',
  authDomain: 'demo-perlerwyveth.firebaseapp.com',
  projectId: 'demo-perlerwyveth',
  storageBucket: 'demo-perlerwyveth.appspot.com',
  appId: '1:000000000000:web:test'
};

/** Textes réels du site, chargés sans requête HTTP */
export const appResourceMock: Partial<AppResource> = {
  getAllResources: () => resource,
  getResource: (key: string) => (resource as Record<string, unknown>)[key],
  load: () => Promise.resolve()
};

const resolved = <T>(value?: T) => () => Promise.resolve(value as T);
const noValidation = () => () => of(null);

export const productServiceMock = {
  products$: of([]),
  productsShared$: of([]),
  getProduct: resolved(null),
  createProduct: resolved(),
  updateProduct: resolved(),
  removeProduct: resolved()
};

export const tagServiceMock = {
  tags$: of([]),
  getTag: resolved(null),
  createTag: resolved(),
  updateTag: resolved(),
  removeTag: resolved(),
  existingTagCodeValidator: noValidation
};

export const perlerTypeServiceMock = {
  perlerTypes$: of([]),
  getPerlerType: resolved(null),
  createPerlerType: resolved(),
  updatePerlerType: resolved(),
  removePerlerType: resolved(),
  existingPerlerTypeRefValidator: noValidation
};

export const userServiceMock = {
  users$: of([]),
  getUser: resolved(new User('Test', 'test@example.com')),
  getUserByEmail: resolved(new User('Test', 'test@example.com')),
  updateUser: resolved(),
  updateField: resolved(),
  removeUser: resolved(),
  existingFieldValidator: noValidation
};

export const authServiceMock = {
  currentUser$: of(null),
  isAuth$: of(false),
  isAdmin$: of(false),
  login: resolved(),
  logout: resolved(),
  register: resolved(),
  updatePasswordUser: resolved()
};

export const contactServiceMock = {
  contacts$: of([]),
  createContact: resolved(),
  removeContact: resolved()
};

export const fileUploadServiceMock = {
  getFilesUpload: resolved([]),
  pushFileToStorage: resolved(),
  deleteFile: resolved()
};

/** Socle commun : router, HTTP, animations, PrimeNG et textes */
export function provideTestBase(): (Provider | EnvironmentProviders)[] {
  return [
    provideRouter([]),
    provideHttpClient(),
    provideHttpClientTesting(),
    provideNoopAnimations(),
    MessageService,
    ConfirmationService,
    { provide: AppResource, useValue: appResourceMock }
  ];
}

/** Pour les composants : socle + doublures de tous les services de données */
export function provideTestDefaults(): (Provider | EnvironmentProviders)[] {
  return [
    ...provideTestBase(),
    { provide: ProductService, useValue: productServiceMock },
    { provide: TagService, useValue: tagServiceMock },
    { provide: PerlerTypeService, useValue: perlerTypeServiceMock },
    { provide: UserService, useValue: userServiceMock },
    { provide: AuthService, useValue: authServiceMock },
    { provide: ContactService, useValue: contactServiceMock },
    { provide: FileUploadService, useValue: fileUploadServiceMock }
  ];
}

/** Pour les services Firebase : vraie instance AngularFire sur un projet fictif */
export function provideFirebaseTesting(): EnvironmentProviders[] {
  return [
    provideFirebaseApp(() => initializeApp(TEST_FIREBASE_CONFIG)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage())
  ];
}
