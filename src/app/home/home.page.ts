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
  IonSegment,
  IonSegmentButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButton,
  IonButtons,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, settings } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AllTasksService } from '../services/all-task.service';
import { CategoriesService } from '../services/categories.service';
import { FeatureFlag } from '../services/feature-flag.service';
import { Task, Category } from '../interfaces/all-task.interface';
import { AddTaskModalComponent } from '../components/add-task-modal/add-task-modal.component';
import { ManageCategoriesModalComponent } from '../components/manage-categories-modal/manage-categories-modal.component';

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
    IonSegment,
    IonSegmentButton,
    IonFab,
    IonFabButton,
    IonIcon,
    IonButton,
    IonButtons
  ],
})
export class HomePage implements OnInit, OnDestroy {
  tasks: Task[] = [];
  categories: Category[] = [];
  filteredTasks: Task[] = [];
  selectedCategoryId: string | null = null;
  currentDate: string = '';
  showDeleteButton: boolean = true;
  remoteConfigActive: boolean = false;

  private tasksSubscription?: Subscription;
  private categoriesSubscription?: Subscription;

  constructor(
    private tasksService: AllTasksService,
    private categoriesService: CategoriesService,
    private featureFlag: FeatureFlag,
    private modalController: ModalController
  ) {
    addIcons({ add, settings });
  }

  async ngOnInit() {
    this.updateCurrentDate();

    // Inicializar Remote Config
    try {
      await this.featureFlag.initRemoteConfig();
      this.showDeleteButton = this.featureFlag.shouldShowDelete();
      this.remoteConfigActive = this.showDeleteButton;
    } catch (error) {
      console.error('Error al inicializar Remote Config:', error);
      this.remoteConfigActive = false;
      this.showDeleteButton = false; // Valor por defecto
    }

    this.tasksSubscription = this.tasksService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
      this.applyFilter();
    });

    this.categoriesSubscription = this.categoriesService.categories$.subscribe(categories => {
      this.categories = categories;

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
    this.selectedCategoryId = categoryId;
    this.applyFilter();
  }

  getSegmentValue(): string {
    return this.selectedCategoryId || 'all';
  }

  onSegmentChange(event: any): void {
    const value = event.detail.value;
    this.selectedCategoryId = value === 'all' ? null : value;
    this.applyFilter();
  }

  async openManageCategoriesModal(): Promise<void> {
    try {
      const modal = await this.modalController.create({
        component: ManageCategoriesModalComponent
      });

      await modal.present();
      await modal.onWillDismiss();
    } catch (error) {
      console.error('Error al abrir el modal de categorías:', error);
    }
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
