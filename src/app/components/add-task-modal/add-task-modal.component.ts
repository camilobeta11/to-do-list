import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonButtons
} from '@ionic/angular/standalone';
import { AllTasksService } from '../../services/all-task.service';
import { Category } from '../../interfaces/all-task.interface';

@Component({
  selector: 'app-add-task-modal',
  templateUrl: './add-task-modal.component.html',
  styleUrls: ['./add-task-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonButtons
  ],
})
export class AddTaskModalComponent implements OnInit, OnDestroy {
  taskForm!: FormGroup;
  categories: Category[] = [];
  private categoriesSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private tasksService: AllTasksService
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.categoriesSubscription = this.tasksService.categories$.subscribe(categories => {
      this.categories = categories;
    });
  }

  ngOnDestroy() {
    this.categoriesSubscription?.unsubscribe();
  }

  private initializeForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      categoryId: [null]
    });
  }

  async saveTask(): Promise<void> {
    if (this.taskForm.valid) {
      const { title, categoryId } = this.taskForm.value;

      const taskData = {
        title: title.trim(),
        categoryId: categoryId || undefined
      };

      await this.modalController.dismiss(taskData, 'save');
    } else {
      // Si el formulario es inválido, forzamos la validación visual en la UI
      Object.keys(this.taskForm.controls).forEach(key => {
        this.taskForm.get(key)?.markAsTouched();
      });
    }
  }

  async cancel(): Promise<void> {
    await this.modalController.dismiss(null, 'cancel');
  }

  hasError(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.taskForm.get(fieldName);
    if (field?.hasError('required')) return 'Este campo es requerido';
    if (field?.hasError('minlength')) return 'El título debe tener al menos 1 carácter';
    return '';
  }
}
