import { Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  User as FirebaseUser,
  browserLocalPersistence
} from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/class/user';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = getAuth();
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthSubject = new BehaviorSubject<boolean>(false);
  private isAdminSubject = new BehaviorSubject<boolean>(false);

  currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  isAuth$: Observable<boolean> = this.isAuthSubject.asObservable();
  isAdmin$: Observable<boolean> = this.isAdminSubject.asObservable();

  constructor(private userService: UserService) {
    // Forcer la persistance locale (même après fermeture navigateur)
    setPersistence(this.auth, browserLocalPersistence)
      .then(() => console.log('Persistance locale activée'))
      .catch(console.error);

    // Écouter les changements de connexion
    // Surveiller l'état de connexion
    onAuthStateChanged(this.auth, async firebaseUser => {
      if (firebaseUser) {
        try {
          const user = await this.userService.getUserByEmail(firebaseUser.email!);
          this.currentUserSubject.next(user);
          this.isAuthSubject.next(true);
          this.isAdminSubject.next(user.admin === true);
        } catch (err) {
          console.error('Erreur lors de la récupération de l’utilisateur', err);
          this.logout();
        }
      } else {
        this.logout();
      }
    });
  }

  /** Création utilisateur */
  createNewUser(email: string, password: string) {
    return new Promise<void>((resolve, reject) => {
      createUserWithEmailAndPassword(getAuth(), email, password).then(
        () => {
          resolve();
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }

  /** Connexion utilisateur */
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /** Récupérer l'utilisateur courant (instantané) */
  // getCurrentUser(): User | null {
  //   return this.auth.currentUser;
  // }

  /** Déconnexion utilisateur */
  logout() {
    this.currentUserSubject.next(null);
    this.isAuthSubject.next(false);
    this.isAdminSubject.next(false);
    return signOut(this.auth);
  }

  updatePasswordUser(user: FirebaseUser, newPassword: string) {
    return new Promise<void>((resolve, reject) => {
      updatePassword(user, newPassword).then(
        () => {
          resolve();
        },
        error => {
          reject(error.code);
        }
      );
    });
  }
}
