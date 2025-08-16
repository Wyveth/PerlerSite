import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppResource {
  private resource: any = null;

  constructor(private http: HttpClient) {}

  // Retourne la ressource complète
  getAllResources() {
    return this.resource;
  }

  // Retourne une clé spécifique
  getResource(key: string) {
    return this.resource ? this.resource[key] : null;
  }

  // Chargement du JSON pour APP_INITIALIZER
  load(): Promise<void> {
    console.log('📥 Resource.load lancé');
    return lastValueFrom(this.http.get('./locale/resource.json'))
      .then(res => {
        this.resource = res;
        console.log('✅ Resource.load OK', this.resource);
      })
      .catch(err => {
        console.error('❌ Erreur chargement resource.json', err);
        return Promise.reject(err);
      });
  }
}
