import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppConfig {
  private config: any = null!;
  private env: string = '';

  constructor(private httpClient: HttpClient) {}

  public getConfig(key: any) {
    return this.config[key];
  }

  async load(): Promise<void> {
    console.log('Entrée dans AppConfig.load');

    try {
      const envResponse: any = await lastValueFrom(this.httpClient.get('./assets/env/env.json'));

      this.env = envResponse['env'];

      if (!this.env) {
        console.error('❌ Fichier env.json invalide ou vide');
        throw new Error('env is undefined');
      }

      this.config = await lastValueFrom(this.httpClient.get(`./assets/env/env.${this.env}.json`));

      console.log('✅ Configuration chargée :');
    } catch (error) {
      console.error('❌ Erreur lors du chargement de la configuration :', error);
      throw error;
    }
  }
}
