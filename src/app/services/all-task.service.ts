import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, Category } from '../interfaces/all-task.interface';

@Injectable({
  providedIn: 'root',
})
export class AllTasksService {
  private storageInitialized = false;

  // Usamos BehaviorSubject para mantener el estado actual y emitirlo a nuevos suscriptores
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private categoriesSubject = new BehaviorSubject<Category[]>([]);

  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();
  public categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  private readonly TASKS_KEY = 'tasks';
  private readonly CATEGORIES_KEY = 'categories';

  constructor(private storage: Storage) {
    this.initStorage();
  }

  private async initStorage(): Promise<void> {
    try {
      await this.storage.create();
      this.storageInitialized = true;

      await this.loadTasks();
      await this.loadCategories();
    } catch (error) {
      console.error('Error al inicializar Storage:', error);
    }
  }

  private async loadTasks(): Promise<void> {
    if (!this.storageInitialized) await this.initStorage();

    try {
      const tasks = await this.storage.get(this.TASKS_KEY) || [];
      this.tasksSubject.next(tasks);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      this.tasksSubject.next([]);
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

  private async saveTasks(tasks: Task[]): Promise<void> {
    if (!this.storageInitialized) await this.initStorage();

    try {
      await this.storage.set(this.TASKS_KEY, tasks);
      this.tasksSubject.next(tasks);
    } catch (error) {
      console.error('Error al guardar tareas:', error);
    }
  }

  private async saveCategories(categories: Category[]): Promise<void> {
    if (!this.storageInitialized) await this.initStorage();

    try {
      await this.storage.set(this.CATEGORIES_KEY, categories);
      this.categoriesSubject.next(categories);
    } catch (error) {
      console.error('Error al guardar categorías:', error);
    }
  }

  async addTask(task: Task): Promise<void> {
    const updatedTasks = [...this.tasksSubject.value, task];
    await this.saveTasks(updatedTasks);
  }

  async deleteTask(taskId: string): Promise<void> {
    const updatedTasks = this.tasksSubject.value.filter(task => task.id !== taskId);
    await this.saveTasks(updatedTasks);
  }

  async toggleTaskCompletion(taskId: string): Promise<void> {
    const updatedTasks = this.tasksSubject.value.map(task =>
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    );
    await this.saveTasks(updatedTasks);
  }

  async addCategory(category: Category): Promise<void> {
    const updatedCategories = [...this.categoriesSubject.value, category];
    await this.saveCategories(updatedCategories);
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const updatedCategories = this.categoriesSubject.value.filter(cat => cat.id !== categoryId);
    await this.saveCategories(updatedCategories);

    // Al eliminar una categoría, desvinculamos todas las tareas que la tenían asignada
    const updatedTasks = this.tasksSubject.value.map(task =>
      task.categoryId === categoryId ? { ...task, categoryId: undefined } : task
    );
    await this.saveTasks(updatedTasks);
  }

  getTasks(): Task[] {
    return this.tasksSubject.value;
  }

  getCategories(): Category[] {
    return this.categoriesSubject.value;
  }
}
