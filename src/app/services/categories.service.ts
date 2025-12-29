import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from '../interfaces/all-task.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private storageInitialized = false;
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$: Observable<Category[]> = this.categoriesSubject.asObservable();
  private readonly CATEGORIES_KEY = 'categories';

  constructor(private storage: Storage) {
    this.initStorage();
  }

  private async initStorage(): Promise<void> {
    try {
      await this.storage.create();
      this.storageInitialized = true;
      await this.loadCategories();
    } catch (error) {
      console.error('Error al inicializar Storage en CategoriesService:', error);
    }
  }

  private async loadCategories(): Promise<void> {
    if (!this.storageInitialized) await this.initStorage();

    try {
      const categories = await this.storage.get(this.CATEGORIES_KEY) || [];
      this.categoriesSubject.next(categories);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      this.categoriesSubject.next([]);
    }
  }

  private async saveCategories(categories: Category[]): Promise<void> {
    if (!this.storageInitialized) await this.initStorage();

    try {
      await this.storage.set(this.CATEGORIES_KEY, categories);
      this.categoriesSubject.next(categories);
    } catch (error) {
      console.error('Error al guardar categorías:', error);
      throw error;
    }
  }

  getCategories(): Category[] {
    return this.categoriesSubject.value;
  }

  getCategoryById(categoryId: string): Category | undefined {
    return this.categoriesSubject.value.find(cat => cat.id === categoryId);
  }

  async addCategory(category: Category): Promise<void> {
    if (!category.name || category.name.trim().length === 0) {
      throw new Error('El nombre de la categoría no puede estar vacío');
    }

    if (!category.color) {
      throw new Error('La categoría debe tener un color asignado');
    }

    const existingCategories = this.categoriesSubject.value;
    const categoryExists = existingCategories.some(cat => cat.name.toLowerCase().trim() === category.name.toLowerCase().trim());
    
    if (categoryExists) {
      throw new Error('Ya existe una categoría con ese nombre');
    }

    const updatedCategories = [...existingCategories, category];
    await this.saveCategories(updatedCategories);
  }

  async updateCategory(categoryId: string, updates: Partial<Category>): Promise<void> {
    if (updates.name !== undefined && (!updates.name || updates.name.trim().length === 0)) {
      throw new Error('El nombre de la categoría no puede estar vacío');
    }

    const existingCategories = this.categoriesSubject.value;
    const categoryIndex = existingCategories.findIndex(cat => cat.id === categoryId);
    
    if (categoryIndex === -1) {
      throw new Error('Categoría no encontrada');
    }

    if (updates.name) {
      const nameExists = existingCategories.some(
        (cat, index) => index !== categoryIndex && cat.name.toLowerCase().trim() === updates.name!.toLowerCase().trim()
      );
      
      if (nameExists) {
        throw new Error('Ya existe una categoría con ese nombre');
      }
    }

    const updatedCategories = existingCategories.map(cat =>
      cat.id === categoryId ? { ...cat, ...updates } : cat
    );
    
    await this.saveCategories(updatedCategories);
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const existingCategories = this.categoriesSubject.value;
    const categoryExists = existingCategories.some(cat => cat.id === categoryId);
    
    if (!categoryExists) {
      throw new Error('Categoría no encontrada');
    }

    const updatedCategories = existingCategories.filter(cat => cat.id !== categoryId);
    await this.saveCategories(updatedCategories);
  }
}

