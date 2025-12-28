import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonCheckbox,
  IonChip,
  IonFab,
  IonFabButton,
  IonIcon,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AllTasksService } from '../services/all-task.service';
import { Task, Category } from '../interfaces/all-task.interface';
import { AddTaskModalComponent } from '../components/add-task-modal/add-task-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonLabel,
    IonCheckbox,
    IonChip,
    IonFab,
    IonFabButton,
    IonIcon
  ],
})
export class HomePage implements OnInit, OnDestroy {
  tasks: Task[] = [];
  categories: Category[] = [];
  filteredTasks: Task[] = [];
  selectedCategoryId: string | null = null;
  currentDate: string = '';

  private tasksSubscription?: Subscription;
  private categoriesSubscription?: Subscription;

  constructor(
    private tasksService: AllTasksService,
    private modalController: ModalController
  ) {
    addIcons({ add });
  }

  ngOnInit() {
    this.updateCurrentDate();

    this.tasksSubscription = this.tasksService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
      this.applyFilter();
    });

    this.categoriesSubscription = this.tasksService.categories$.subscribe(categories => {
      this.categories = categories;

      // Si la categoría seleccionada fue eliminada del sistema, reseteamos el filtro para evitar estados inconsistentes
      const categoryExists = categories.find(cat => cat.id === this.selectedCategoryId);
      if (this.selectedCategoryId && !categoryExists) {
        this.selectedCategoryId = null;
        this.applyFilter();
      }
    });
  }

  ngOnDestroy() {
    this.tasksSubscription?.unsubscribe();
    this.categoriesSubscription?.unsubscribe();
  }

  updateCurrentDate() {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    this.currentDate = today.toLocaleDateString('es-ES', options);
  }

  selectCategory(categoryId: string | null): void {
    this.selectedCategoryId = (this.selectedCategoryId === categoryId) ? null : categoryId;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.selectedCategoryId === null) {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(task => task.categoryId === this.selectedCategoryId);
    }
  }

  async toggleTaskCompletion(taskId: string): Promise<void> {
    try {
      await this.tasksService.toggleTaskCompletion(taskId);
    } catch (error) {
      console.error('Error al alternar el estado de la tarea:', error);
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      await this.tasksService.deleteTask(taskId);
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
    }
  }

  getCategoryColor(categoryId?: string): string {
    if (!categoryId) return '';
    const category = this.categories.find(cat => cat.id === categoryId);
    return category?.color || '';
  }

  getCategoryName(categoryId?: string): string {
    if (!categoryId) return 'Sin categoría';
    const category = this.categories.find(cat => cat.id === categoryId);
    return category?.name || 'Sin categoría';
  }

  async openAddTaskModal(): Promise<void> {
    try {
      const modal = await this.modalController.create({
        component: AddTaskModalComponent,
        componentProps: {}
      });

      await modal.present();

      const { data, role } = await modal.onWillDismiss();

      if (role === 'save' && data) {
        const newTask: Task = {
          id: Date.now().toString(),
          title: data.title,
          isCompleted: false,
          categoryId: data.categoryId
        };
        await this.tasksService.addTask(newTask);
      }
    } catch (error) {
      console.error('Error al gestionar el modal de nueva tarea:', error);
    }
  }
}
