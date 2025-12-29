import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from '../interfaces/all-task.interface';
import { CategoriesService } from './categories.service';

@Injectable({
  providedIn: 'root',
})
export class AllTasksService {
  private storageInitialized = false;
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();
  private readonly TASKS_KEY = 'tasks';

  constructor(
    private storage: Storage,
    private categoriesService: CategoriesService
  ) {
    this.initStorage();
  }

  private async initStorage(): Promise<void> {
    try {
      await this.storage.create();
      this.storageInitialized = true;
      await this.loadTasks();
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

  private async saveTasks(tasks: Task[]): Promise<void> {
    if (!this.storageInitialized) await this.initStorage();

    try {
      await this.storage.set(this.TASKS_KEY, tasks);
      this.tasksSubject.next(tasks);
    } catch (error) {
      console.error('Error al guardar tareas:', error);
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

  async deleteCategory(categoryId: string): Promise<void> {
    await this.categoriesService.deleteCategory(categoryId);

    const updatedTasks = this.tasksSubject.value.map(task =>
      task.categoryId === categoryId ? { ...task, categoryId: undefined } : task
    );
    await this.saveTasks(updatedTasks);
  }

  getTasks(): Task[] {
    return this.tasksSubject.value;
  }

  getFilteredTasks(categoryId: string | null): Observable<Task[]> {
    return combineLatest([this.tasks$, this.categoriesService.categories$]).pipe(
      map(([tasks, categories]) => {
        if (categoryId === null) {
          return tasks;
        }
        return tasks.filter(task => task.categoryId === categoryId);
      })
    );
  }
}
