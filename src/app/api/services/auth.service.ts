import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../models/class/user';

@Injectable({
  providedIn: 'root'
})
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  // Au lieu de false, mettre null = "en attente"
  private isAuthSubject = new BehaviorSubject<boolean | null>(null);
  isAuth$ = this.isAuthSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean | null>(null);
  isAdmin$ = this.isAdminSubject.asObservable();

  constructor(
    private auth: Auth,
    private userService: UserService
  ) {
    this.initAuthListener();
  }

  private initAuthListener() {
    onAuthStateChanged(this.auth, async firebaseUser => {
      if (firebaseUser?.email) {
        try {
          const user = await this.userService.getUserByEmail(firebaseUser.email);
          this.currentUserSubject.next(user);
          this.isAuthSubject.next(true);
          this.isAdminSubject.next(user.admin === true);
        } catch (err) {
          console.error('Erreur récupération utilisateur', err);
          this.logout();
        }
      } else {
        this.logout();
      }
    });
  }

  createNewUser(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    this.currentUserSubject.next(null);
    this.isAuthSubject.next(false);
    this.isAdminSubject.next(false);
    return signOut(this.auth);
  }

  // updatePasswordUser(user: FirebaseUser, newPassword: string) {
  //   return new Promise<void>((resolve, reject) => {
  //     updatePassword(user, newPassword).then(
  //       () => {
  //         resolve();
  //       },
  //       error => {
  //         reject(error.code);
  //       }
  //     );
  //   });
  // }
}
