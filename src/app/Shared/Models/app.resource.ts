import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppResource {
  private resource: any = null!;

  constructor(private http: HttpClient) {}

  public getResource(key: any) {
    return this.resource[key];
  }

  async load(): Promise<void> {
    console.log('📥 Resource.load lancé');

    try {
      this.resource = await lastValueFrom(this.http.get('./locale/resource.json'));
      console.log('✅ Resource.load OK', this.resource);
    } catch (err) {
      console.error('❌ Erreur chargement resource.json', err);
      throw err;
    }
  }
}
