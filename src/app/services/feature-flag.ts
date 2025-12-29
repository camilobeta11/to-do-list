import { Injectable, inject } from '@angular/core';
import { RemoteConfig } from '@angular/fire/remote-config';
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

  /**
   * Configura los ajustes de Remote Config
   * En desarrollo, minimumFetchIntervalMillis es 0 para pruebas rápidas
   * En producción, usa el valor por defecto (12 horas)
   */
  private configureRemoteConfig(): void {
    const settings = {
      minimumFetchIntervalMillis: environment.production ? 43200000 : 0, // 0 en dev, 12h en prod
    };
    
    this.remoteConfig.settings = settings;
    
    // Configurar valores por defecto
    this.remoteConfig.defaultConfig = {
      show_delete_button: 'true', // Valor por defecto como string
    };
  }

  /**
   * Inicializa Remote Config y obtiene los valores del servidor
   * @returns Promise que se resuelve cuando se completan las operaciones de fetch y activate
   */
  async initRemoteConfig(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Obtener y activar los valores del servidor
      await this.remoteConfig.fetchAndActivate();
      this.isInitialized = true;
      console.log('Remote Config inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar Remote Config:', error);
      // En caso de error, usar valores por defecto
      this.isInitialized = true;
    }
  }

  /**
   * Obtiene el valor booleano de la clave show_delete_button
   * @returns true si el botón de eliminar debe mostrarse, false en caso contrario
   */
  shouldShowDelete(): boolean {
    try {
      const value = this.remoteConfig.getValue('show_delete_button');
      // Remote Config devuelve strings, convertir a booleano
      const boolValue = value.asString().toLowerCase() === 'true';
      return boolValue;
    } catch (error) {
      console.error('Error al obtener show_delete_button de Remote Config:', error);
      // Valor por defecto en caso de error
      return true;
    }
  }

  /**
   * Obtiene un valor genérico de Remote Config como string
   * @param key Clave del valor a obtener
   * @param defaultValue Valor por defecto si no se encuentra la clave
   * @returns Valor de la clave o el valor por defecto
   */
  getStringValue(key: string, defaultValue: string = ''): string {
    try {
      return this.remoteConfig.getValue(key).asString();
    } catch (error) {
      console.error(`Error al obtener ${key} de Remote Config:`, error);
      return defaultValue;
    }
  }

  /**
   * Obtiene un valor booleano de Remote Config
   * @param key Clave del valor a obtener
   * @param defaultValue Valor por defecto si no se encuentra la clave
   * @returns Valor booleano de la clave o el valor por defecto
   */
  getBooleanValue(key: string, defaultValue: boolean = false): boolean {
    try {
      const value = this.remoteConfig.getValue(key);
      return value.asString().toLowerCase() === 'true';
    } catch (error) {
      console.error(`Error al obtener ${key} de Remote Config:`, error);
      return defaultValue;
    }
  }

  /**
   * Obtiene un valor numérico de Remote Config
   * @param key Clave del valor a obtener
   * @param defaultValue Valor por defecto si no se encuentra la clave
   * @returns Valor numérico de la clave o el valor por defecto
   */
  getNumberValue(key: string, defaultValue: number = 0): number {
    try {
      const value = this.remoteConfig.getValue(key);
      return parseFloat(value.asString()) || defaultValue;
    } catch (error) {
      console.error(`Error al obtener ${key} de Remote Config:`, error);
      return defaultValue;
    }
  }
}
