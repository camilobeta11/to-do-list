import { Injectable, inject } from '@angular/core';
import { RemoteConfig, fetchAndActivate, getValue } from '@angular/fire/remote-config';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlag {
  private remoteConfig = inject(RemoteConfig);
  private isInitialized = false;

  constructor() {
    this.configureRemoteConfig();
  }

  private configureRemoteConfig(): void {
    this.remoteConfig.settings = {
      minimumFetchIntervalMillis: environment.production ? 43200000 : 0,
      fetchTimeoutMillis: 60000,
    };

    this.remoteConfig.defaultConfig = {
      show_delete_button: true,
    };
  }

  async initRemoteConfig(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await fetchAndActivate(this.remoteConfig);
      this.isInitialized = true;
      console.log('✅ Remote Config inicializado y actualizado');
    } catch (error) {
      console.error('❌ Error al inicializar Remote Config:', error);
      this.isInitialized = true;
    }
  }

  shouldShowDelete(): boolean {
    try {
      // Usamos la instancia inyectada para obtener el valor
      const value = getValue(this.remoteConfig, 'show_delete_button');
      return value.asBoolean(); // .asBoolean() es más limpio que comparar strings
    } catch (error) {
      console.error('Error al obtener show_delete_button:', error);
      return true;
    }
  }

  // Versión genérica simplificada
  getBooleanValue(key: string, defaultValue: boolean = false): boolean {
    try {
      return getValue(this.remoteConfig, key).asBoolean();
    } catch {
      return defaultValue;
    }
  }
}
